import Section from "@/components/ui/Section";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { beforeAfterItems } from "@/data/beforeAfter";

export default function BeforeAfter() {
  return (
    <Section
      id="before-after"
      tone="mist"
      eyebrow="Before / After"
      title="ビフォーアフター"
      lead="実際の作業事例の一部をご紹介します。分解洗浄でここまできれいになります。"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {beforeAfterItems.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-paper">
            <div className="grid grid-cols-2">
              <div className="relative aspect-square">
                <ImagePlaceholder
                  fill
                  src={item.beforeImage || undefined}
                  alt={`${item.title}（作業前）`}
                  icon="search"
                  label="Before"
                  objectPosition={item.beforeObjectPosition}
                />
                <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-bold text-paper">
                  Before
                </span>
              </div>
              <div className="relative aspect-square">
                <ImagePlaceholder
                  fill
                  src={item.afterImage || undefined}
                  alt={`${item.title}（作業後）`}
                  icon="sparkles"
                  label="After"
                  variant="brand"
                  objectPosition={item.afterObjectPosition}
                />
                <span className="absolute left-2 top-2 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold text-paper">
                  After
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-brand">{item.service}</p>
              <h3 className="mt-1 text-sm font-bold text-ink">{item.title}</h3>
              {item.comment && (
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{item.comment}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
