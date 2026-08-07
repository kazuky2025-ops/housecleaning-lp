import Image from "next/image";
import Icon from "./Icon";
import type { IconName } from "@/types";

type ImagePlaceholderProps = {
  /** 実画像パス（public配下）。未設定なら装飾プレースホルダーを表示します。 */
  src?: string;
  alt: string;
  icon?: IconName;
  label?: string;
  className?: string;
  variant?: "light" | "brand";
  /** true の場合、親要素いっぱいに絶対配置で表示します（親に position が必要）。 */
  fill?: boolean;
  /** 被写体の位置に応じてトリミング位置を調整したい場合に指定（例: "35% center"） */
  objectPosition?: string;
};

/**
 * 画像未設置の間、見た目の破綻なく代替表示する装飾プレースホルダー。
 * src に画像パスを指定すると自動的に next/image での表示に切り替わります。
 * 差し替え手順は public/images/README.md を参照してください。
 */
export default function ImagePlaceholder({
  src,
  alt,
  icon = "sparkles",
  label,
  className = "",
  variant = "light",
  fill = false,
  objectPosition,
}: ImagePlaceholderProps) {
  const positionClass = fill ? "absolute inset-0" : "relative w-full h-full";

  if (src) {
    return (
      <div className={`${positionClass} overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
    );
  }

  const isBrand = variant === "brand";

  return (
    <div
      className={`${positionClass} flex flex-col items-center justify-center gap-2 overflow-hidden ${
        isBrand
          ? "bg-gradient-to-br from-brand to-brand-dark text-paper"
          : "bg-gradient-to-br from-brand-light to-mist-dark text-brand"
      } ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <Icon name={icon} className="relative h-8 w-8 opacity-70" strokeWidth={1.5} />
      {label && (
        <span className="relative text-xs font-medium opacity-70">{label}</span>
      )}
    </div>
  );
}
