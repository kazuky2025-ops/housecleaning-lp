import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "/#reasons", label: "選ばれる理由" },
  { href: "/#pricing", label: "エアコン料金" },
  { href: "/#before-after", label: "施工事例" },
  { href: "/#other-services", label: "ハウスクリーニング" },
  { href: "/#voice", label: "お客様の声" },
  { href: "/#faq", label: "よくある質問" },
  { href: "/blog", label: "ブログ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden xl:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={siteConfig.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-line px-4 py-2 text-xs sm:text-sm font-bold text-paper transition-colors hover:bg-line-dark"
        >
          <Icon name="line" className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">LINEで相談する</span>
          <span className="sm:hidden">LINE</span>
        </a>
      </div>
    </header>
  );
}
