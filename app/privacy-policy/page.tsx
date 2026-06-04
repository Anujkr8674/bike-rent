import { LegalPage } from "@/components/layout/legal-page";
import { privacyPolicy } from "@/lib/content/legal";

export const metadata = { title: privacyPolicy.title, description: privacyPolicy.subtitle };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title={privacyPolicy.title}
      subtitle={privacyPolicy.subtitle}
      lastUpdated={privacyPolicy.lastUpdated}
      sections={privacyPolicy.sections}
    />
  );
}
