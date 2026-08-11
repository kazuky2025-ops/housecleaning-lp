import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import LineCtaButton from "@/components/ui/LineCtaButton";
import { siteConfig } from "@/data/siteConfig";

const steps = [
  { label: "LINEで友だち追加", icon: "line" as const },
  { label: "メッセージで内容を送信", icon: "chat" as const },
  { label: "当店からの返信でご予約確定", icon: "check" as const },
];

export default function Contact() {
  return (
    <Section
      id="contact"
      tone="mist"
      eyebrow="LINE"
      title="LINEで相談する"
      lead="お見積り・ご相談は無料です。まずは公式LINEからお気軽にメッセージをお送りください。"
    >
      <div className="mx-auto max-w-xl rounded-3xl border border-brand/20 bg-paper p-6 sm:p-8 text-center shadow-[0_8px_32px_-16px_rgba(18,60,64,0.25)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-line/10 text-line">
          <Icon name="line" className="h-7 w-7" strokeWidth={1.75} />
        </span>
        <h3 className="mt-3 text-lg font-bold text-ink">公式LINEで簡単お問い合わせ</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          24時間メッセージ送信可能です（返信は営業時間内：{siteConfig.replyHours}）。
          <br />
          LINEで内容を確認後、当店からの返信をもってご予約確定となります。
        </p>

        <div className="mt-5">
          <LineCtaButton size="lg" />
        </div>

        <ol className="mt-6 grid grid-cols-3 gap-3 text-left">
          {steps.map((step, index) => (
            <li key={step.label} className="flex flex-col items-center text-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand text-xs font-bold">
                {index + 1}
              </span>
              <Icon name={step.icon} className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <p className="text-[11px] leading-snug text-ink-soft">{step.label}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-border bg-paper p-5">
        <ul className="space-y-3 text-sm text-ink-soft">
          <li className="flex items-start gap-2.5">
            <Icon name="car" className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
            <span>
              <span className="font-bold text-ink">対応エリア：{siteConfig.areaCoverage}</span>
              <br />
              {siteConfig.areaNote}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Icon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
            <span>
              <span className="font-bold text-ink">定休日：{siteConfig.holiday}</span>
            </span>
          </li>
        </ul>
      </div>
    </Section>
  );
}
