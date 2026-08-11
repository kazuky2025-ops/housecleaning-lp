import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { reasons } from "@/data/reasons";

export default function Reasons() {
  return (
    <Section
      id="reasons"
      tone="mist"
      eyebrow="Reasons"
      title="選ばれる理由"
      lead="はじめてハウスクリーニングをご依頼される方にも、安心してお任せいただけるように。"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className={`rounded-2xl p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(10,37,40,0.08)] border ${
              reason.highlight
                ? "bg-natural-light border-natural/30"
                : "bg-paper border-border/60"
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                reason.highlight ? "bg-natural text-paper" : "bg-brand-light text-brand"
              }`}
            >
              <Icon name={reason.icon} className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="mt-3 text-base font-bold text-ink">{reason.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
