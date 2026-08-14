import type { Metadata } from "next";
import { Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/data/siteConfig";
import { organizationJsonLd } from "@/lib/jsonld";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCta from "@/components/layout/FloatingCta";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
});

const pageTitle = `${siteConfig.brandName}｜${siteConfig.areaCoverage}対応のハウスクリーニング`;
const ogpDescription =
  "西東京市を中心に東京西部へ出張対応。エアコン・浴室・レンジフード・トイレなどのハウスクリーニング。LINEから簡単にご相談・お見積もりいただけます。";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: pageTitle,
    template: `%s｜${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  keywords: [
    "エアコンクリーニング",
    "ハウスクリーニング",
    siteConfig.seoAreaName,
    `${siteConfig.seoAreaName} エアコンクリーニング`,
    `${siteConfig.seoAreaName} ハウスクリーニング`,
  ],
  authors: [{ name: siteConfig.operator }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteConfig.siteUrl,
    siteName: siteConfig.brandName,
    title: pageTitle,
    description: ogpDescription,
    images: [
      {
        url: "/ogp-v2.png",
        width: 1734,
        height: 907,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: ogpDescription,
    images: ["/ogp-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#123c40",
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${shipporiMincho.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-ink bg-paper">
        <Header />
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer />
        <FloatingCta />
        <Script
          id="ld-json-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
