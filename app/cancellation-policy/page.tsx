import { LegalPage } from "@/components/layout/legal-page";
import { cancellationPolicy } from "@/lib/content/legal";

export const metadata = { title: cancellationPolicy.title, description: cancellationPolicy.subtitle };

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      title={cancellationPolicy.title}
      subtitle={cancellationPolicy.subtitle}
      lastUpdated={cancellationPolicy.lastUpdated}
      sections={cancellationPolicy.sections}
    />
  );
}
