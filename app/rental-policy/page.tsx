import { LegalPage } from "@/components/layout/legal-page";
import { rentalPolicy } from "@/lib/content/legal";

export const metadata = { title: rentalPolicy.title, description: rentalPolicy.subtitle };

export default function RentalPolicyPage() {
  return (
    <LegalPage
      title={rentalPolicy.title}
      subtitle={rentalPolicy.subtitle}
      lastUpdated={rentalPolicy.lastUpdated}
      sections={rentalPolicy.sections}
    />
  );
}
