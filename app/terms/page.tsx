import { LegalPage } from "@/components/layout/legal-page";
import { termsConditions } from "@/lib/content/legal";

export const metadata = { title: termsConditions.title, description: termsConditions.subtitle };

export default function TermsPage() {
  return (
    <LegalPage
      title={termsConditions.title}
      subtitle={termsConditions.subtitle}
      lastUpdated={termsConditions.lastUpdated}
      sections={termsConditions.sections}
    />
  );
}
