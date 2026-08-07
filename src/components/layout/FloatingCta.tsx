import { siteConfig } from "@/data/siteConfig";
import Icon from "@/components/ui/Icon";
import { LINE_CTA_LABEL } from "@/components/ui/LineCtaButton";

/**
 * スマホ画面下部に常時表示する固定LINE CTAバー。
 * スクロール位置に関わらず、常に1タップでLINE公式アカウントへ
 * アクセスできるようにし、問い合わせ率を最大化します。
 */
export default function FloatingCta() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/90 shadow-[0_-8px_24px_-12px_rgba(10,37,40,0.25)]">
      <a
        href={siteConfig.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-paper bg-line active:bg-line-dark"
      >
        <Icon name="line" className="h-5 w-5" strokeWidth={2} />
        {LINE_CTA_LABEL}
      </a>
    </div>
  );
}
