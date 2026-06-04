"use client";

import { motion } from "framer-motion";
import type { FaqCategory } from "@/lib/content/faqs";

export function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  return (
    <div className="space-y-10">
      {categories.map((cat, ci) => (
        <div key={cat.title}>
          <h2 className="font-display text-xl font-bold text-zinc-900">{cat.title}</h2>
          <div className="mt-4 space-y-3">
            {cat.items.map((item, i) => (
              <motion.details
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (ci + i) * 0.03 }}
                className="group glass rounded-2xl p-5 open:shadow-md"
              >
                <summary className="cursor-pointer list-none font-semibold text-zinc-900 marker:hidden">{item.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{item.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
