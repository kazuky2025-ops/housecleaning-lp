import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import Icon from "./Icon";

type LogoProps = {
  /** onBrand: フッター（暗背景用・白〜アイボリー配色）で使う場合はtrue。未指定はヘッダー（白背景用・濃紺配色）。 */
  onBrand?: boolean;
  className?: string;
};

/**
 * サイト共通のロゴ表示。
 * ヘッダーは siteConfig.logoImage（白背景用・マスターの濃紺＋水色配色をそのまま維持）、
 * フッターは siteConfig.logoImageFooter（暗背景用・濃紺部分のみ白〜アイボリーへ
 * 再着色し、水色の噴射・泡はブランドカラーのまま維持・中央配置）を表示します。
 * どちらも public/images/logo/tokyo-ouchi-migaki-logo-master.png を原本として、
 * 周囲の透明余白のみトリミングしたもの（横1291×縦634px／比率約2.04:1、
 * ヘッダー・フッターで共通）で、家・高圧洗浄ガン・噴射・泡・輝き・文字の形状と
 * 縦横比は一切変更していません。
 * 高さをブレークポイントごとに指定し、幅はaspect比から自動計算（w-auto）することで、
 * 引き伸ばし・比率崩れを防いでいます。
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
          width={1291}
          height={634}
          sizes={onBrand ? "(min-width: 640px) 196px, 163px" : "130px"}
          className={`w-auto object-contain ${onBrand ? "h-20 sm:h-24" : "h-16"}`}
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
