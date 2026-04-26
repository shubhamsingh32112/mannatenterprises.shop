import { useEffect, useMemo, useState } from "react";

type CheckoutOrderResponse = {
  success: boolean;
  data?: {
    orderId: string;
    amount: number;
    currency: string;
    coins: number;
    keyId: string;
  };
  error?: string;
};

type VerifyResponse = {
  success: boolean;
  data?: {
    appOpenUrl?: string;
    coinsAdded?: number;
    message?: string;
  };
  error?: string;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (eventName: string, handler: (response: unknown) => void) => void;
    };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
const APP_RETURN_DEEP_LINK = import.meta.env.VITE_APP_RETURN_DEEP_LINK || "zztherapy://wallet";

const loadRazorpayScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if ((window as Window & { Razorpay?: unknown }).Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });

const WalletCheckout = () => {
  const [status, setStatus] = useState<"loading" | "ready" | "processing" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Preparing checkout...");
  const [coins, setCoins] = useState<number | null>(null);
  const [appOpenUrl, setAppOpenUrl] = useState<string | null>(null);

  const checkoutToken = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("session");
  }, []);

  const apiBaseUrl = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("apiBase");
    if (fromQuery && fromQuery.trim().length > 0) {
      return fromQuery.trim().replace(/\/$/, "");
    }
    return API_BASE_URL.replace(/\/$/, "");
  }, []);

  const openApp = () => {
    if (!appOpenUrl) return;
    window.location.href = appOpenUrl;
  };

  const buildFallbackAppUrl = (payment: "success" | "failed", reason?: string): string => {
    const [base, existingQuery] = APP_RETURN_DEEP_LINK.split("?");
    const query = new URLSearchParams(existingQuery || "");
    query.set("payment", payment);
    if (reason) query.set("reason", reason);
    return `${base}?${query.toString()}`;
  };

  useEffect(() => {
    const startCheckout = async () => {
      if (!checkoutToken) {
        setStatus("failed");
        setMessage("Missing checkout session. Please retry from the app.");
        return;
      }

      try {
        await loadRazorpayScript();

        const orderResp = await fetch(`${apiBaseUrl}/payment/web/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checkoutToken }),
        });

        const orderData = (await orderResp.json()) as CheckoutOrderResponse;
        if (!orderResp.ok || !orderData.success || !orderData.data) {
          throw new Error(orderData.error || "Failed to create order");
        }

        setCoins(orderData.data.coins);
        setStatus("ready");
        setMessage(`Pay INR ${orderData.data.amount / 100} for ${orderData.data.coins} coins`);

        const options: Record<string, unknown> = {
          key: orderData.data.keyId,
          amount: orderData.data.amount,
          currency: orderData.data.currency,
          name: "Match Vibe",
          description: `${orderData.data.coins} Coins`,
          order_id: orderData.data.orderId,
          // Docs-aligned configuration: render a UPI-only checkout block.
          config: {
            display: {
              blocks: {
                upi_only: {
                  name: "Pay via UPI",
                  instruments: [{ method: "upi" }],
                },
              },
              sequence: ["block.upi_only"],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
          handler: async (response: RazorpaySuccessResponse) => {
            try {
              setStatus("processing");
              setMessage("Verifying payment...");

              const verifyResp = await fetch(`${apiBaseUrl}/payment/web/verify`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  checkoutToken,
                  ...response,
                }),
              });

              const verifyData = (await verifyResp.json()) as VerifyResponse;
              const nextAppUrl = verifyData.data?.appOpenUrl || null;
              setAppOpenUrl(nextAppUrl);

              if (!verifyResp.ok || !verifyData.success) {
                throw new Error(verifyData.error || "Payment verification failed");
              }

              setStatus("success");
              setMessage(verifyData.data?.message || "Payment successful. Opening app...");

              if (nextAppUrl) {
                window.location.href = nextAppUrl;
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "Verification failed";
              setStatus("failed");
              setMessage(errorMessage);
              setAppOpenUrl(buildFallbackAppUrl("failed", "verification_failed"));
            }
          },
          modal: {
            ondismiss: () => {
              setStatus("failed");
              setMessage("Payment cancelled. You can retry from the app wallet.");
              setAppOpenUrl(buildFallbackAppUrl("failed", "cancelled"));
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", () => {
          setStatus("failed");
          setMessage("Payment failed. Please retry from the app.");
          setAppOpenUrl(buildFallbackAppUrl("failed", "payment_failed"));
        });
        razorpay.open();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Checkout failed";
        const userFacing =
          errorMessage === "Failed to fetch"
            ? "Could not reach payment server. Please retry in a moment."
            : errorMessage;
        setStatus("failed");
        setMessage(userFacing);
      }
    };

    void startCheckout();
  }, [checkoutToken, apiBaseUrl]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-3">Match Vibe Wallet Checkout</h1>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Status:</span> {status}
          </p>
          {coins !== null ? (
            <p>
              <span className="font-medium">Coins:</span> {coins}
            </p>
          ) : null}
        </div>

        {(status === "success" || status === "failed") && appOpenUrl ? (
          <button
            type="button"
            onClick={openApp}
            className="mt-6 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Open App
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default WalletCheckout;
