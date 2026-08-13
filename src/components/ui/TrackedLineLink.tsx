"use client";

import type { AnchorHTMLAttributes, MouseEventHandler } from "react";
import { usePathname } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { siteConfig } from "@/data/siteConfig";

/**
 * LINEボタンが紐づくサービスを確実に判別できる場合のみ指定します。
 * 判別できない（複数サービス共通・汎用の）ボタンでは省略してください。
 */
export type LineClickServiceName =
  | "aircon"
  | "bathroom"
  | "rangehood"
  | "toilet"
  | "general";

type TrackedLineLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  /** サイト内のどの位置のLINEボタンか（例: hero, header, floating, bottom, blog_middle） */
  ctaLocation: string;
  /** 判別できる場合のみ設定するサービス名 */
  serviceName?: LineClickServiceName;
};

/**
 * サイト内すべてのLINEリンクの基盤コンポーネント。
 * リンク先（siteConfig.lineUrl）とGA4への line_click イベント送信を一箇所に集約しています。
 * 新しいLINEボタンを追加する場合は、これを直接使うか LineCtaButton 経由で ctaLocation を指定してください。
 */
export default function TrackedLineLink({
  ctaLocation,
  serviceName,
  onClick,
  ...anchorProps
}: TrackedLineLinkProps) {
  const pathname = usePathname();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    try {
      sendGAEvent("event", "line_click", {
        cta_location: ctaLocation,
        page_path: pathname,
        page_title: document.title,
        link_url: siteConfig.lineUrl,
        ...(serviceName ? { service_name: serviceName } : {}),
      });
    } catch {
      // GA4計測に失敗してもLINEへの遷移は妨げない
    }
    onClick?.(event);
  };

  return (
    <a
      href={siteConfig.lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...anchorProps}
    />
  );
}
