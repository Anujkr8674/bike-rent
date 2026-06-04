import { LegalPage } from "@/components/layout/legal-page";
import { refundPolicy } from "@/lib/content/legal";

export const metadata = { title: refundPolicy.title, description: refundPolicy.subtitle };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title={refundPolicy.title}
      subtitle={refundPolicy.subtitle}
      lastUpdated={refundPolicy.lastUpdated}
      sections={refundPolicy.sections}
    />
  );
}
