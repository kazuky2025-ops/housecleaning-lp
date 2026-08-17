import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import {
  airconPricing,
  airconOption,
  setDiscounts,
  travelFees,
  travelFeeNote,
  parkingNote,
  trustPoints,
  pricingNotes,
} from "@/data/pricing";
import { services } from "@/data/services";
import { siteConfig } from "@/data/siteConfig";

export default function Pricing() {
  const aircon = services.find((service) => service.isMain);

  return (
    <Section
      id="pricing"
      tone="mist"
      eyebrow="Pricing"
      title="エアコンクリーニング料金"
      lead={aircon?.description}
    >
      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        {airconPricing.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl border bg-paper p-6 sm:p-7 text-center ${
              plan.isPopular
                ? "border-brand shadow-[0_12px_32px_-14px_rgba(18,60,64,0.4)]"
                : "border-border"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-paper">
                人気No.1
              </span>
            )}
            <p className="text-sm font-bold text-ink">{plan.name}</p>
            <p className="mt-3 text-4xl sm:text-5xl font-bold text-brand">
              {plan.price.toLocaleString()}
              <span className="text-lg font-medium">円</span>
            </p>
            <p className="mt-1 text-xs text-ink-soft">{plan.unit}</p>
            {plan.description && (
              <p className="mt-4 text-xs leading-relaxed text-ink-soft">{plan.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-dashed border-brand/30 bg-brand-light/50 p-4 sm:p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-brand">
          <Icon name="spray" className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <p className="text-sm text-ink">
          <span className="font-bold text-ink">オプション：{airconOption.name}</span>
          <span className="ml-2 font-bold text-brand">
            +{airconOption.price.toLocaleString()}円
          </span>
          <span className="ml-1 text-xs text-ink-soft">（{airconOption.description}）</span>
        </p>
      </div>

      <div className="mx-auto mt-9 max-w-3xl">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          Set Discount
        </p>
        <h3 className="mt-1.5 text-center font-serif text-xl sm:text-2xl font-semibold text-ink">
          お得なセット割
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {setDiscounts.map((plan) => (
            <div
              key={plan.id}
              className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent-light p-5 text-center"
            >
              {plan.badge && (
                <span className="absolute right-0 top-0 rounded-bl-xl bg-accent px-2.5 py-1 text-[10px] font-bold text-paper">
                  {plan.badge}
                </span>
              )}
              <p className="mt-3 text-xs font-bold leading-snug text-ink">{plan.name}</p>
              {plan.priceNote && (
                <p className="mt-2 text-[11px] text-ink-soft line-through decoration-ink-soft/60">
                  {plan.priceNote}
                </p>
              )}
              <p className="mt-1 text-2xl font-bold text-brand">
                {plan.price.toLocaleString()}
                <span className="text-sm font-medium">円</span>
              </p>
              <p className="text-[11px] text-ink-soft">{plan.unit}</p>
              {plan.description && (
                <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">{plan.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-3xl">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-brand uppercase">
          Area &amp; Travel Fee
        </p>
        <h3 className="mt-1.5 text-center font-serif text-xl sm:text-2xl font-semibold text-ink">
          対応エリア・交通費
        </h3>
        <p className="mt-2 text-center text-sm text-ink-soft">
          {siteConfig.areaCoverage}対応
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-paper">
          <ul className="divide-y divide-border">
            {travelFees.map((tier) => (
              <li
                key={tier.range}
                className="flex items-center justify-between px-5 py-3 text-sm sm:px-6"
              >
                <span className="text-ink">{tier.range}</span>
                <span className="font-bold text-brand">
                  {tier.price === 0 ? "無料" : `${tier.price.toLocaleString()}円`}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-center text-[11px] text-ink-soft">{travelFeeNote}</p>

        <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-border bg-mist p-4 sm:p-5">
          <Icon name="car" className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
          <p className="text-xs leading-relaxed text-ink-soft">
            <span className="font-bold text-ink">駐車料金：</span>
            {parkingNote}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-3xl">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-brand uppercase">
          Peace of Mind
        </p>
        <h3 className="mt-1.5 text-center font-serif text-xl sm:text-2xl font-semibold text-ink">
          安心ポイント
        </h3>

        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {trustPoints.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-paper px-4 py-3 text-sm text-ink"
            >
              <Icon name="check" className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mx-auto mt-7 max-w-3xl space-y-1.5">
        {pricingNotes.map((note) => (
          <li key={note} className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
            <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
            {note}
          </li>
        ))}
      </ul>
    </Section>
  );
}
