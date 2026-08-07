import Script from "next/script";
import Section from "@/components/ui/Section";
import { faqItems } from "@/data/faq";
import { faqJsonLd } from "@/lib/jsonld";

export default function Faq() {
  return (
    <Section
      id="faq"
      tone="mist"
      eyebrow="FAQ"
      title="よくある質問"
      lead="ご依頼前によくいただくご質問をまとめました。"
    >
      <div className="mx-auto max-w-2xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-paper">
        {faqItems.map((item) => (
          <details key={item.question} className="group p-5 sm:p-6 open:bg-brand-light/40">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm sm:text-base font-bold text-ink marker:content-none">
              <span className="flex gap-2">
                <span className="text-brand">Q.</span>
                {item.question}
              </span>
              <span
                aria-hidden
                className="mt-0.5 shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 flex gap-2 text-sm leading-relaxed text-ink-soft">
              <span className="font-bold text-accent">A.</span>
              {item.answer}
            </p>
          </details>
        ))}
      </div>

      <Script
        id="ld-json-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </Section>
  );
}
