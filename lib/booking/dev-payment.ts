/** Local / staging test payments without Razorpay checkout */
export function isTestPaymentAllowed(): boolean {
  if (process.env.NODE_ENV === "production") {
    return process.env.ALLOW_TEST_PAYMENTS === "true";
  }
  return process.env.ALLOW_TEST_PAYMENTS !== "false";
}
