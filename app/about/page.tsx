import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { companyStats, team, timeline } from "@/lib/content/site";
import { heroImages } from "@/lib/content/hero-images";
import { Target, Eye, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Nextgen Bike Rent Service — Ranchi's premium bike rental startup. Our mission, team, story, and commitment to Jharkhand riders.",
  openGraph: { title: "About Nextgen Bike Rent | Ranchi" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="About Nextgen"
        title="Building Ranchi's most trusted bike rental platform"
        subtitle="We started with a simple idea: local riders deserve a premium, transparent, app-grade rental experience — not outdated counters and hidden fees."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        backgroundImage={heroImages.about}
      />

      <div className="page-wrap space-y-20 py-16 md:py-24">
        <SectionReveal className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="section-title">Who we are</h2>
            <p className="section-subtitle mt-4 text-zinc-400">
              Nextgen Bike Rent Service is a Ranchi-born mobility company serving students, professionals, tourists, and families across Jharkhand. We combine a carefully maintained fleet with modern technology — OTP login, live pricing, secure payments, and responsive local support.
            </p>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Unlike generic rental counters, we treat every ride as a product experience: sanitized bikes, documented handovers, clear policies, and honest pricing displayed before you pay.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {companyStats.map((s) => (
              <div key={s.label} className="rounded-2xl p-6 text-center bg-[#0A0A0A] border border-white/10 hover:border-[#FF6B1A] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,26,0.3)] hover:-translate-y-1">
                <p className="font-display text-3xl font-bold text-white">
                  {s.isDecimal ? s.value : `${s.value.toLocaleString()}${s.suffix}`}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Target, title: "Mission", text: "Make two-wheeler access in Ranchi affordable, safe, and delightful through technology and local expertise." },
              { icon: Eye, title: "Vision", text: "Become Eastern India's most trusted premium bike rental brand — one city perfected at a time." },
              { icon: Heart, title: "Values", text: "Transparency, rider safety, fleet quality, and community-first service in everything we do." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl p-6 bg-[#0A0A0A] border border-white/10 transition-all duration-300 hover:border-[#FF6B1A] hover:shadow-[0_0_30px_rgba(255,107,26,0.3)] hover:-translate-y-1">
                <Icon className="h-8 w-8 text-[#FF6B1A]" />
                <h3 className="mt-4 font-display text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <h2 className="section-title">Our story</h2>
          <p className="section-subtitle mt-2">
            From 12 bikes on Kanke Road to Ranchi&apos;s premium rental platform.
          </p>
          <div className="relative mt-12 border-l-2 border-[#FF6B1A]/30 pl-8 md:pl-12">
            {timeline.map((t, i) => (
              <div key={t.year} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[calc(2rem+5px)] flex h-3 w-3 rounded-full bg-[#FF6B1A] md:-left-[calc(3rem+5px)]" />
                <p className="text-sm font-bold text-[#FF6B1A]">{t.year}</p>
                <h3 className="font-display text-lg font-bold text-white">{t.title}</h3>
                <p className="mt-1 text-zinc-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <h2 className="section-title text-center">Leadership team</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl p-6 text-center bg-[#0A0A0A] border border-white/10 hover:border-[#FF6B1A] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,26,0.3)] hover:-translate-y-1">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B1A] to-[#FF8A3D] text-xl font-bold text-white">
                  {m.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-semibold text-white">{m.name}</h3>
                <p className="text-sm font-medium text-[#FF6B1A]">{m.role}</p>
                <p className="mt-2 text-xs text-zinc-400">{m.bio}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="rounded-3xl bg-gradient-to-r from-[#FF6B1A] to-[#FF8A3D] p-10 text-center text-white md:p-14">
          <h2 className="font-display text-3xl font-bold">Ready to ride with us?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">Join thousands of Ranchi riders who trust Nextgen for daily commutes and weekend adventures.</p>
          <Link href="/bikes" className="mt-8 inline-block">
            <Button variant="glass" size="lg" className="border-white/30 bg-white text-[#FF6B1A]">
              Browse fleet
            </Button>
          </Link>
        </SectionReveal>
      </div>
    </>
  );
}
