import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import Icon from "./Icon";

type LogoProps = {
  /** onBrand: フッター（白背景ロゴ・80px）で使う場合はtrue。未指定はヘッダー（透過ロゴ・56px）。 */
  onBrand?: boolean;
  className?: string;
};

/**
 * サイト共通のロゴ表示。
 * ヘッダーは siteConfig.logoImage（背景透過版・高さ56px）、
 * フッターは siteConfig.logoImageFooter（白背景版・高さ80px・中央配置）を表示します。
 * どちらも空文字の間はアイコン＋屋号のテキストロゴにフォールバックします。
 */
export default function Logo({ onBrand = false, className = "" }: LogoProps) {
  const src = onBrand ? siteConfig.logoImageFooter : siteConfig.logoImage;

  if (src) {
    return (
      <span className={`block ${onBrand ? "mx-auto w-fit" : ""} ${className}`}>
        <Image
          src={src}
          alt={siteConfig.brandName}
          width={512}
          height={512}
          sizes={onBrand ? "240px" : "190px"}
          className={`w-auto object-contain ${onBrand ? "h-[80px]" : "h-14"}`}
          priority={!onBrand}
        />
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          onBrand ? "bg-paper/10" : "bg-brand"
        }`}
      >
        <Icon name="helper" className="h-4 w-4 text-paper" strokeWidth={2} />
      </span>
      <span
        className={`font-serif text-sm sm:text-base font-semibold tracking-wide ${
          onBrand ? "text-paper" : "text-ink"
        }`}
      >
        {siteConfig.brandName}
      </span>
    </span>
  );
}
