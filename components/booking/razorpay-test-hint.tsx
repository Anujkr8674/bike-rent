"use client";

const TEST_CARDS = [
  { label: "Visa (success)", number: "4111 1111 1111 1111" },
  { label: "Mastercard (success)", number: "5267 3181 8797 5449" },
];

export function RazorpayTestHint({ showTestPayNote }: { showTestPayNote?: boolean }) {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_ALLOW_TEST_PAYMENTS !== "true") {
    return null;
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
      <p className="font-semibold text-amber-900">Razorpay test mode</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-amber-900/90">
        <li>
          Random card numbers fail validation. Use Razorpay test cards only (any future expiry, any CVV).
        </li>
        {TEST_CARDS.map((card) => (
          <li key={card.number}>
            <span className="font-medium">{card.label}:</span>{" "}
            <code className="rounded bg-white/80 px-1 py-0.5 text-xs">{card.number}</code>
          </li>
        ))}
        <li>
          The red browser message about &quot;secure connection&quot; on HTTP is normal on localhost — it
          only disables autofill, not payment.
        </li>
        {showTestPayNote ? (
          <li>
            For unlimited bookings without the card form, use <strong>Test pay (skip Razorpay)</strong>{" "}
            below.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
