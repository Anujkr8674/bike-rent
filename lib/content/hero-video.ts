import { siteAssets } from "@/lib/site-assets";

export const heroVideo = {
  /** Primary source controlled from the central asset registry */
  src: siteAssets.hero.video,
  cdnSrc: siteAssets.hero.video,
  localSrc: "/videos/bike.mp4",
  fallbacks: [siteAssets.hero.video2],
  poster: siteAssets.hero.poster,
};

export const heroVideoSources = [heroVideo.src, ...heroVideo.fallbacks];
