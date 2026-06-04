import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin } from "lucide-react";
import { heroImages } from "@/lib/content/hero-images";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Nextgen Bike Rent Service in Ranchi. Open roles in operations, fleet, customer support, and technology.",
};

const openings = [
  { title: "Fleet Technician", type: "Full-time", location: "Ranchi", desc: "Maintain and quality-check our bike fleet. Experience with two-wheeler servicing preferred." },
  { title: "Customer Support Executive", type: "Full-time", location: "Ranchi", desc: "Handle bookings, rider queries, and roadside coordination. Excellent Hindi/English communication." },
  { title: "Operations Associate", type: "Part-time", location: "Ranchi", desc: "Manage pickups, returns, and handover documentation at our Ranchi hubs." },
  { title: "Digital Marketing Intern", type: "Internship", location: "Remote/Ranchi", desc: "Create content for social media, blog, and local SEO campaigns." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        badge="Careers"
        title="Build mobility with us"
        subtitle="We're growing Ranchi's favourite bike rental brand. Join a team that cares about riders, technology, and local community."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        backgroundImage={heroImages.careers}
      />
      <div className="page-wrap py-16 md:py-24">
        <SectionReveal>
          <p className="max-w-3xl text-lg text-zinc-600 leading-relaxed">
            At Nextgen, you'll work on real problems — fleet quality, booking UX, and rider trust — not corporate fluff. We offer competitive pay, growth paths, and a culture that respects hustle and integrity.
          </p>
        </SectionReveal>
        <div className="mt-12 space-y-4">
          {openings.map((job, i) => (
            <SectionReveal key={job.title} delay={i * 0.05}>
              <div className="glass card-lift flex flex-col gap-4 rounded-2xl p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <h3 className="font-display text-lg font-bold text-zinc-900">{job.title}</h3>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-500">
                    <span>{job.type}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600">{job.desc}</p>
                </div>
                <Link href="/contact">
                  <Button variant="outline">Apply now</Button>
                </Link>
              </div>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal className="mt-16 text-center">
          <p className="text-zinc-600">Don't see your role? Send your CV to ranchi@nextgenbike.in</p>
        </SectionReveal>
      </div>
    </>
  );
}
