"use client";

import { useEffect, useRef, useState } from "react";
import {
  whyChooseFeatures,
  ORBIT_DESIGN_SIZE,
  ORBIT_RADIUS_X,
  ORBIT_RADIUS_Y,
} from "@/lib/content/why-choose-features";
import { CenterCard } from "./center-card";
import { FeatureCard } from "./feature-card";
import { MobileOrbitLayout } from "./mobile-orbit-layout";

const FEATURE_COUNT = whyChooseFeatures.length;

function polarPosition(index: number) {
  const angle = (index / FEATURE_COUNT) * 2 * Math.PI - Math.PI / 2;
  const x = 50 + ORBIT_RADIUS_X * Math.cos(angle);
  const y = 50 + ORBIT_RADIUS_Y * Math.sin(angle);
  return { left: `${x}%`, top: `${y}%` };
}

export function OrbitLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.getBoundingClientRect().width;
      setScale(Math.min(1, width / ORBIT_DESIGN_SIZE));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const scaledHeight = ORBIT_DESIGN_SIZE * scale;

  return (
    <>
      <MobileOrbitLayout />
      <div
        ref={containerRef}
        className="relative mx-auto hidden w-full max-w-[1100px] px-2 sm:px-4 md:block"
        style={{ height: scaledHeight }}
      >
      <div
        className="absolute left-1/2 top-0 origin-top -translate-x-1/2"
        style={{
          width: ORBIT_DESIGN_SIZE,
          height: ORBIT_DESIGN_SIZE,
          transform: `scale(${scale})`,
        }}
      >
        <div className="relative h-full w-full">
          <div
            className="pointer-events-none absolute inset-[21%] rounded-full border border-dashed border-[#FF653F]/25"
            aria-hidden
          />

          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <CenterCard />
          </div>

          {whyChooseFeatures.map((feature, index) => {
            const pos = polarPosition(index);

            return (
              <div
                key={feature.title}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.left, top: pos.top }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}
