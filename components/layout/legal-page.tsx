import { PageHero } from "@/components/layout/page-hero";
import { heroImages } from "@/lib/content/hero-images";
import { SectionReveal } from "@/components/ui/section-reveal";

type Section = { heading: string; body: string[] };

type Props = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
};

export function LegalPage({ title, subtitle, lastUpdated, sections }: Props) {
  return (
    <>
      <PageHero
        title={title}
        subtitle={subtitle}
        badge="Legal"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
        backgroundImage={heroImages.legal}
      />
      <div className="page-wrap py-12 md:py-16">
        <p className="text-sm text-zinc-400">Last updated: {lastUpdated}</p>
        <div className="prose prose-invert mt-10 max-w-3xl space-y-10">
          {sections.map((s, i) => (
            <SectionReveal key={s.heading} delay={i * 0.05}>
              <section>
                <h2 className="font-display text-xl font-bold text-white">{s.heading}</h2>
                {s.body.map((p, j) => (
                  <p key={j} className="mt-3 text-zinc-400 leading-relaxed">
                    {p}
                  </p>
                ))}
              </section>
            </SectionReveal>
          ))}
        </div>
      </div>
    </>
  );
}
