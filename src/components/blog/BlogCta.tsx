import Icon from "@/components/ui/Icon";
import LineCtaButton from "@/components/ui/LineCtaButton";
import { siteConfig } from "@/data/siteConfig";

type BlogCtaProps = {
  className?: string;
};

/**
 * 記事本文の途中・下部で使う共通CTAブロック。
 * リンク先は siteConfig.lineUrl（LineCtaButton経由）のみを使用します。
 */
export default function BlogCta({ className = "" }: BlogCtaProps) {
  return (
    <div
      className={`rounded-3xl border border-brand/20 bg-mist p-6 text-center sm:p-8 ${className}`}
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-line/10 text-line">
        <Icon name="line" className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <p className="mt-3 text-base font-bold text-ink">
        エアコンクリーニングのご相談は公式LINEから
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        お見積り・ご相談は無料です。{siteConfig.areaCoverage}へ出張対応しております。
      </p>
      <div className="mt-4 mx-auto max-w-sm">
        <LineCtaButton size="lg" />
      </div>
    </div>
  );
}
