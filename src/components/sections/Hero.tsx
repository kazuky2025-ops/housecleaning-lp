import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import Container from "@/components/ui/Container";
import LineCtaButton from "@/components/ui/LineCtaButton";
import Icon from "@/components/ui/Icon";

const trustBadges = [
  { icon: "car", label: "都内全域対応" },
  { icon: "shield", label: "女性も安心" },
  { icon: "yen", label: "明朗会計" },
  { icon: "helper", label: "押し売りなし" },
] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden text-paper">
      {/* 背景写真: エアコンクリーニング作業中の様子 */}
      <Image
        src="/images/hero/hero-01.png"
        alt="エアコンクリーニング作業中のスタッフ"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "55% 22%" }}
      />
      {/* 文字を読みやすくする黒〜濃紺のオーバーレイ（約45%） */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-dark/45 via-brand-dark/45 to-brand-dark/60" />

      <Container className="relative py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-paper/90">
            {siteConfig.areaCoverage}対応のハウスクリーニング専門店
          </p>

          <h1 className="mt-5 whitespace-pre-line font-serif text-3xl sm:text-5xl font-semibold leading-snug tracking-wide">
            {siteConfig.catchCopy}
          </h1>

          <p className="mt-4 whitespace-pre-line text-sm sm:text-base leading-relaxed text-paper/85">
            {siteConfig.subCopy}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {trustBadges.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1.5 text-xs font-medium text-paper/90"
              >
                <Icon name={badge.icon} className="h-3.5 w-3.5" strokeWidth={2} />
                {badge.label}
              </span>
            ))}
          </div>

          <div className="mt-8 mx-auto max-w-sm">
            <LineCtaButton size="lg" />
          </div>

          <p className="mt-5 text-xs text-paper/70">
            24時間メッセージ送信可能・返信は営業時間内（{siteConfig.replyHours}）
            <br />
            お見積り無料／LINEでの内容確認後、当店からの返信をもってご予約確定となります
          </p>
        </div>
      </Container>
    </section>
  );
}
