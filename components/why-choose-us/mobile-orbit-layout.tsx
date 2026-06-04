"use client";

import { whyChooseFeatures } from "@/lib/content/why-choose-features";
import { CenterCard } from "./center-card";
import { FeatureCard } from "./feature-card";

export function MobileOrbitLayout() {
  return (
    <div className="md:hidden">
      <div className="flex justify-center">
        <CenterCard className="w-[min(88vw,260px)]" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
        {whyChooseFeatures.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            index={index}
            className="w-full max-w-none"
            variant="mobile"
          />
        ))}
      </div>
    </div>
  );
}
