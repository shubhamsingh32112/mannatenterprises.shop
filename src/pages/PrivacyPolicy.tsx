const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Last updated: February 24, 2026
        </p>

        <div className="space-y-5 text-sm leading-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">Information we collect</h2>
            <p>
              We collect basic account details, transaction details, and support-related information
              needed to provide wallet checkout and customer support.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">How we use information</h2>
            <p>
              Data is used to process payments, maintain account security, detect misuse, and improve
              service reliability.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Data sharing</h2>
            <p>
              Payment information is processed by secure payment partners. We do not sell personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Contact</h2>
            <p>
              For privacy concerns, contact support at{" "}
              <a className="underline" href="mailto:support@matchvibe.com">
                support@matchvibe.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
