import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/types";

const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/#pricing", label: "エアコンクリーニングの料金", icon: "yen" },
  { href: "/#other-services", label: "浴室・レンジフード・トイレクリーニング", icon: "droplet" },
  { href: "/#before-after", label: "施工事例（ビフォーアフター）", icon: "sparkles" },
  { href: "/#contact", label: "対応エリア・LINEで相談する", icon: "map" },
];

/**
 * 記事下部に置く、LP内の該当セクションへの内部リンク集。
 * 本文中の自然なリンクとは別に、まとめて確認したい読者向けの一覧です。
 */
export default function RelatedServiceLinks() {
  return (
    <div className="rounded-2xl border border-border bg-paper p-5 sm:p-6">
      <p className="text-sm font-bold text-ink">あわせて確認する</p>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-mist px-4 py-3 text-sm text-ink transition-colors hover:border-brand/40 hover:text-brand"
            >
              <Icon name={link.icon} className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
