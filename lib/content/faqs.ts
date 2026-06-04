export type FaqItem = { q: string; a: string };
export type FaqCategory = { title: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    title: "Booking",
    items: [
      { q: "How do I book a bike in Ranchi?", a: "Choose your bike, select pickup and return dates, complete OTP verification, and pay the advance online. You'll receive confirmation instantly." },
      { q: "Can I book hourly rentals?", a: "Yes. We offer both hourly and daily plans. Hourly is ideal for quick city errands; daily works best for tours and weekend trips." },
      { q: "What documents are required?", a: "Valid driving license (DL), government ID (Aadhaar/PAN), and for some premium bikes a refundable security deposit." },
      { q: "Is there a minimum rental duration?", a: "Minimum hourly rental is 2 hours. Daily rentals start from 24 hours with flexible extension options." },
    ],
  },
  {
    title: "Payment",
    items: [
      { q: "What payment methods do you accept?", a: "We accept UPI, cards, and net banking via Razorpay. A booking advance (30%) secures your slot; balance at pickup." },
      { q: "Is my payment secure?", a: "All transactions are encrypted and processed through Razorpay with industry-standard security." },
      { q: "What is the security deposit?", a: "A refundable deposit (typically ₹1,500–₹3,000 depending on bike) is collected at pickup and returned after inspection at drop-off." },
    ],
  },
  {
    title: "Cancellation & Refunds",
    items: [
      { q: "Can I cancel my booking?", a: "Yes. Free cancellation up to 24 hours before pickup. Later cancellations may incur a small fee — see our Cancellation Policy." },
      { q: "How long do refunds take?", a: "Approved refunds are processed within 5–7 business days to your original payment method." },
    ],
  },
  {
    title: "Rental & Usage",
    items: [
      { q: "Is fuel included?", a: "Fuel is not included. Bikes are provided with a standard fuel level; please return with similar level or pay refuel charges." },
      { q: "Can I take the bike outside Ranchi?", a: "Inter-city travel requires prior approval. Contact support before booking for outstation trips." },
      { q: "What if the bike breaks down?", a: "Call our 24×7 Ranchi support line. We'll arrange roadside assistance or a replacement where possible." },
      { q: "Are helmets provided?", a: "Yes, one helmet per booking is included. Additional helmets available on request." },
    ],
  },
];

export const allFaqs = faqCategories.flatMap((c) => c.items);
