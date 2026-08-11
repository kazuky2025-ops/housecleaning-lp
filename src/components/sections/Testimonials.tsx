import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <Section
      id="voice"
      tone="paper"
      eyebrow="Voice"
      title="お客様の声"
      lead="ご依頼いただいたお客様から嬉しいお声をいただいています。"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex flex-col rounded-2xl border border-border bg-mist p-5"
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  name="star"
                  className={`h-4 w-4 ${
                    i < testimonial.rating ? "text-accent fill-accent" : "text-border fill-border"
                  }`}
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink">
              &ldquo;{testimonial.comment}&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
              <div>
                <p className="text-xs font-bold text-ink">{testimonial.name}</p>
                <p className="text-[11px] text-ink-soft">{testimonial.attribute}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-brand">{testimonial.service}</p>
                <p className="text-[11px] text-ink-soft">{testimonial.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
