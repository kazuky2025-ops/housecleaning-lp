import { siteConfig } from "@/data/siteConfig";
import Icon from "./Icon";

export const LINE_CTA_LABEL = "LINEで無料見積もり・空き状況を確認";

type LineCtaButtonProps = {
  size?: "md" | "lg";
  className?: string;
  label?: string;
};

const sizeClasses: Record<NonNullable<LineCtaButtonProps["size"]>, string> = {
  md: "text-sm px-5 py-3",
  lg: "text-base px-6 py-4",
};

/**
 * サイト内すべてのメインCTAで共通利用するLINE誘導ボタン。
 * リンク先は siteConfig.lineUrl の1箇所を変更するだけで全ボタンに反映されます。
 */
export default function LineCtaButton({
  size = "lg",
  className = "w-full",
  label = LINE_CTA_LABEL,
}: LineCtaButtonProps) {
  return (
    <a
      href={siteConfig.lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-line font-bold text-paper shadow-[0_10px_30px_-12px_rgba(6,199,85,0.55)] transition-transform duration-150 ease-out hover:bg-line-dark active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${sizeClasses[size]} ${className}`}
    >
      <Icon name="line" className="h-5 w-5" />
      {label}
    </a>
  );
}
