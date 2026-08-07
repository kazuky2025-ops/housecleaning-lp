import { siteConfig } from "@/data/siteConfig";
import { faqItems } from "@/data/faq";
import { services } from "@/data/services";

/**
 * LocalBusiness（MEO対策）向け構造化データ
 * Google ビジネスプロフィール・検索結果でのリッチ表示を狙います。
 */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: siteConfig.brandName,
  image: `${siteConfig.siteUrl}/opengraph-image`,
  url: siteConfig.siteUrl,
  sameAs: [siteConfig.lineUrl],
  priceRange: "¥¥",
  areaServed: {
    "@type": "AdministrativeArea",
    name: siteConfig.areaCoverage,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "サービス一覧",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.shortDescription,
      },
    })),
  },
};

/** よくある質問（FAQPage）向け構造化データ */
export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};
