import { useEffect, useMemo, useState } from "react";

type CheckoutOrderResponse = {
  success: boolean;
  data?: {
    orderId: string;
    amount: number;
    currency: string;
    planId: string;
    durationDays: number;
    priceInr?: number;
    label?: string;
    keyId: string;
  };
  error?: string;
};

type VerifyResponse = {
  success: boolean;
  data?: {
    appOpenUrl?: string;
    expiresAt?: string;
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
const APP_RETURN_DEEP_LINK =
  import.meta.env.VITE_MOMENTS_PREMIUM_RETURN_DEEP_LINK || "zztherapy://moments-plan";

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

const MomentsPremiumCheckout = () => {
  const [status, setStatus] = useState<"loading" | "ready" | "processing" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Preparing Moments Premium checkout...");
  const [durationDays, setDurationDays] = useState<number | null>(null);
  const [planLabel, setPlanLabel] = useState<string | null>(null);
  const [priceInr, setPriceInr] = useState<number | null>(null);
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
    query.set("status", payment);
    if (reason) query.set("reason", reason);
    return `${base}?${query.toString()}`;
  };

  useEffect(() => {
    let cancelled = false;

    const startCheckout = async () => {
      if (!checkoutToken) {
        setStatus("failed");
        setMessage("Missing checkout session. Please retry from the app.");
        return;
      }

      try {
        await loadRazorpayScript();
        if (cancelled) return;

        const orderResp = await fetch(`${apiBaseUrl}/moments-premium/checkout/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutToken }),
        });

        const orderData = (await orderResp.json()) as CheckoutOrderResponse;
        if (!orderResp.ok || !orderData.success || !orderData.data) {
          throw new Error(orderData.error || "Failed to create order");
        }
        if (cancelled) return;

        const data = orderData.data;
        setDurationDays(data.durationDays);
        setPlanLabel(data.label ?? null);
        setPriceInr(
          typeof data.priceInr === "number"
            ? data.priceInr
            : Math.round(data.amount / 100),
        );
        setStatus("ready");
        const planName = data.label ?? `${data.durationDays}-day plan`;
        setMessage(
          `Subscribe to ${planName} for ₹${
            typeof data.priceInr === "number"
              ? data.priceInr
              : Math.round(data.amount / 100)
          }`,
        );

        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Match Vibe Moments Premium",
          description: `${planName} • ${data.durationDays} days`,
          order_id: data.orderId,
          handler: async (response: unknown) => {
            const payment = response as RazorpaySuccessResponse;
            setStatus("processing");
            setMessage("Verifying payment...");

            try {
              const verifyResp = await fetch(`${apiBaseUrl}/moments-premium/checkout/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  checkoutToken,
                  razorpay_order_id: payment.razorpay_order_id,
                  razorpay_payment_id: payment.razorpay_payment_id,
                  razorpay_signature: payment.razorpay_signature,
                }),
              });
              const verifyData = (await verifyResp.json()) as VerifyResponse;
              if (!verifyResp.ok || !verifyData.success) {
                throw new Error(verifyData.error || "Verification failed");
              }
              setStatus("success");
              setMessage(verifyData.data?.message || "Moments Premium activated!");
              setAppOpenUrl(
                verifyData.data?.appOpenUrl || buildFallbackAppUrl("success"),
              );
            } catch (err) {
              setStatus("failed");
              setMessage(err instanceof Error ? err.message : "Verification failed");
              setAppOpenUrl(buildFallbackAppUrl("failed", "verify_failed"));
            }
          },
          modal: {
            ondismiss: () => {
              setStatus("failed");
              setMessage("Payment cancelled");
              setAppOpenUrl(buildFallbackAppUrl("failed", "cancelled"));
            },
          },
          theme: { color: "#7B39FD" },
        });

        rzp.open();
      } catch (err) {
        if (cancelled) return;
        setStatus("failed");
        setMessage(err instanceof Error ? err.message : "Checkout failed");
        setAppOpenUrl(buildFallbackAppUrl("failed", "checkout_error"));
      }
    };

    void startCheckout();
    return () => {
      cancelled = true;
    };
  }, [checkoutToken, apiBaseUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-purple-900">Moments Premium</h1>
        {planLabel != null && priceInr != null && (
          <p className="text-lg font-semibold text-purple-800">
            {planLabel} • ₹{priceInr}
          </p>
        )}
        {durationDays != null && (
          <p className="text-sm text-gray-500">{durationDays}-day access</p>
        )}
        <p className="text-gray-700">{message}</p>
        {status === "success" && appOpenUrl && (
          <button
            type="button"
            onClick={openApp}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Return to App
          </button>
        )}
        {status === "failed" && appOpenUrl && (
          <button
            type="button"
            onClick={openApp}
            className="w-full py-3 rounded-xl border border-purple-300 text-purple-700 font-semibold"
          >
            Back to App
          </button>
        )}
      </div>
    </div>
  );
};

export default MomentsPremiumCheckout;
