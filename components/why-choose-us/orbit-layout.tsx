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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play feature rotation on mobile every 4.5 seconds (only when user has not tapped manually)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURE_COUNT);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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

  const handleFeatureClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false); // Disable auto-play once user interacts
  };

  const scaledHeight = ORBIT_DESIGN_SIZE * scale;

  return (
    <div className="flex flex-col items-center">
      {/* Circle Orbit Layout Container */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[1100px] px-2 sm:px-4"
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
            {/* Dashed Orbit Ring */}
            <div
              className="pointer-events-none absolute inset-[21%] rounded-full border border-dashed border-[#FF6B1A]/25"
              aria-hidden
            />

            {/* Central Enhanced Image Card */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <CenterCard className="w-[210px] md:w-[272px]" />
            </div>

            {/* Feature Cards positioned in polar grid */}
            {whyChooseFeatures.map((feature, index) => {
              const pos = polarPosition(index);
              const isActive = index === activeIndex;

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
                    isActive={isActive}
                    onClick={() => handleFeatureClick(index)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
