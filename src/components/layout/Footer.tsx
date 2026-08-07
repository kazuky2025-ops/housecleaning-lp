import { siteConfig } from "@/data/siteConfig";
import Icon from "@/components/ui/Icon";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "#reasons", label: "選ばれる理由" },
  { href: "#pricing", label: "エアコン料金" },
  { href: "#before-after", label: "施工事例" },
  { href: "#other-services", label: "ハウスクリーニング" },
  { href: "#voice", label: "お客様の声" },
  { href: "#faq", label: "よくある質問" },
  { href: "#contact", label: "LINE相談" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-paper/80">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo onBrand className="mb-4" />
            <p className="text-xs font-medium text-accent-light">{siteConfig.brandConcept}</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-paper mb-4">メニュー</h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-paper/70 hover:text-paper transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-paper mb-4">お問い合わせ</h3>
            <ul className="space-y-3 text-sm text-paper/70">
              <li className="flex items-start gap-2">
                <Icon name="line" className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  公式LINEにて受付中
                  <br />
                  24時間メッセージ送信可能・返信は営業時間内（{siteConfig.replyHours}）
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="car" className="h-4 w-4 mt-0.5 shrink-0" />
                <span>対応エリア：{siteConfig.areaCoverage}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="calendar" className="h-4 w-4 mt-0.5 shrink-0" />
                <span>定休日：{siteConfig.holiday}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-paper/15 pt-6 text-center text-xs text-paper/60">
          © {new Date().getFullYear()} {siteConfig.operator}
        </div>
      </Container>
    </footer>
  );
}
