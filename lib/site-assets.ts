const supabaseStorageBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BASE_URL?.replace(/\/$/, "") ?? "";

export function supabasePublicAsset(path: string, fallback = "") {
  const normalizedPath = path.replace(/^\/+/, "");
  const bucket = "assets";

  if (supabaseStorageBaseUrl) {
    const base = supabaseStorageBaseUrl.replace(/\/$/, "");
    const baseEndsWithBucket = base.endsWith(`/${bucket}`) || base.endsWith(`/${bucket}/`);
    if (baseEndsWithBucket) {
      return `${base}/${normalizedPath}`;
    }
    return `${base}/${bucket}/${normalizedPath}`;
  }

  return fallback || `/${normalizedPath}`;
}

export const siteAssets = {
  logo: supabasePublicAsset("logo/logo3.png"),
  hero: {
    video: "/videos/bike.mp4",
    video2: "/videos/hero-3.mp4",
    poster: supabasePublicAsset("hero/hero1.png"),

    carouselImages: {
      cityRide: "https://images.unsplash.com/photo-1558980664-10ea7d3fb147?auto=format&fit=crop&w=1920&q=90",
      ktmOrange: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=1920&q=90",
      sportBike: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1920&q=90",
      windingRoad: "/images/winding-road.png",
    },
  },
  pageHeroes: {
    about: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80",
    contact: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80",
    faq: "https://images.unsplash.com/photo-1558980664-10ea7d3fb147?w=1600&q=80",
    whyChoose: "https://images.unsplash.com/photo-1611241443798-2fdcdb9a7fbe?w=1600&q=80",
    bikes: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&q=80",
    testimonials: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80",
    blog: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    ranchi: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=1600&q=80",
    support: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=1600&q=80",
    careers: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
    legal: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80",
  },
  whyChoose: {
    center: supabasePublicAsset("why-choose/why.jpg"),
  },
  benefits: {
    verifiedBikes: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80",
    secureBooking: "https://images.unsplash.com/photo-1611241443798-2fdcdb9a7fbe?w=400&q=80",
    affordablePricing: "https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?w=400&q=80",
    supportTeam: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&q=80",
    easyCancellation: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=400&q=80",
    sanitizedHelmets: "https://images.unsplash.com/photo-1571646750134-6f9d8db5f9e5?w=400&q=80",
    flexibleDuration: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=400&q=80",
    instantConfirmation: "https://images.unsplash.com/photo-1623070592232-8b6be9f64f52?w=400&q=80",
  },
  impact: {
    cleaning: supabasePublicAsset("bike-category/cmpzb5iei0001l8041ktuhfmi/Activa-removebg-preview.png"),
    helmet: supabasePublicAsset("bike-category/cmpz5s1eu000ac6h87x1d1xol/R15-removebg-preview.png"),
    sunset: supabasePublicAsset("impact/pic5.jpeg"),
    scooter1: supabasePublicAsset("impact/pic3.avif"),
    bikerider: supabasePublicAsset("impact/pic4.avif"),
    twins: supabasePublicAsset("impact/pic2.avif"),
    highway: supabasePublicAsset("impact/pic1.avif"),
    parked: supabasePublicAsset("bike-category/cmpzb69xc0002l804cl14lb5f/bullet-removebg-preview.png"),
    front: supabasePublicAsset("bike-category/cmpzb6htv0003js04vvyszflg/Himaliyan-removebg-preview.png"),
    scooter2: supabasePublicAsset("bike-category/cmpzb5d6d0000l80488k1wvm0/splendor-removebg-preview.png"),
  },
  bikes: {
    pulsar150: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    pulsarNs200: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1200&q=80",
    apacheRtr: "https://images.unsplash.com/photo-1611241443798-2fdcdb9a7fbe?auto=format&fit=crop&w=1200&q=80",
    ktmDuke: "https://images.unsplash.com/photo-1623070592232-8b6be9f64f52?auto=format&fit=crop&w=1200&q=80",
    r15: "https://images.unsplash.com/photo-1571646750134-6f9d8db5f9e5?auto=format&fit=crop&w=1200&q=80",
    mt15: "https://images.unsplash.com/photo-1619771914272-e3a8f6f8d0ff?auto=format&fit=crop&w=1200&q=80",
    classic350: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=1200&q=80",
    hunter350: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80",
    activa: "https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=1200&q=80",
    jupiter: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=1200&q=80",
    access125: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?auto=format&fit=crop&w=1200&q=80",
    ntorq: "https://images.unsplash.com/photo-1558980664-10ea7d3fb147?auto=format&fit=crop&w=1200&q=80",
  },
  blog: {
    guide: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80",
    cityRides: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=1200&q=80",
    weekendTrips: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=1200&q=80",
    affordable: "https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?w=1200&q=80",
    monsoon: "https://images.unsplash.com/photo-1611241443798-2fdcdb9a7fbe?w=1200&q=80",
    hourlyVsDaily: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=1200&q=80",
  },
  testimonials: {
    rahul: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    priya: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    amit: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    sneha: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    vikash: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    anjali: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  pagePreviews: {
    about: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=85",
  },

  service: {
    bullet: supabasePublicAsset("service/blue_motorcycle.png"),
    scooter: supabasePublicAsset("service/blue_scooter.png"),
  },
  faqHome: {
    faq: supabasePublicAsset("faq/faq1.jpg"),
  },
  faqPage: {
    faq: supabasePublicAsset("faq/faq1.jpg"),
  }
  // siteAssets.pageHeroes.faq
} as const;
