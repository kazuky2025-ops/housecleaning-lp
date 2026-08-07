import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { services } from "@/data/services";

export default function OtherServices() {
  const otherServices = services.filter((service) => !service.isMain);

  return (
    <Section
      id="other-services"
      tone="paper"
      eyebrow="House Cleaning"
      title="ハウスクリーニング"
      lead="エアコン以外のお掃除もまとめてお任せいただけます。「詳しい料金・サービス内容を見る」からご確認ください。"
    >
      <div className="mx-auto max-w-2xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-mist">
        {otherServices.map((service) => (
          <details key={service.slug} className="group p-5 sm:p-6 open:bg-paper">
            <summary className="flex cursor-pointer list-none items-center gap-4 marker:content-none">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                <Icon name={service.icon} className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm sm:text-base font-bold text-ink">
                  {service.name}
                </span>
                <span className="block text-xs text-ink-soft">{service.shortDescription}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-brand">
                詳しい料金・サービス内容を見る
                <Icon
                  name="chevronDown"
                  className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2}
                />
              </span>
            </summary>

            <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold text-ink-soft">料金</p>
                <p className="mt-1 text-2xl font-bold text-brand">
                  {service.price?.toLocaleString()}
                  <span className="text-sm font-medium">円</span>
                </p>
                <p className="text-[11px] text-ink-soft">税込</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-soft">作業内容</p>
                <ul className="mt-1 space-y-1">
                  {service.workContent?.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs leading-relaxed text-ink">
                      <Icon name="check" className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-soft">作業時間目安</p>
                <p className="mt-1 text-sm text-ink">{service.duration}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
