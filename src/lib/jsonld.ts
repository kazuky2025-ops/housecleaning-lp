import { siteConfig } from "@/data/siteConfig";
import { faqItems } from "@/data/faq";
import { services } from "@/data/services";
import type { BlogPostMeta } from "@/types/blog";

/**
 * LocalBusiness（MEO対策）向け構造化データ
 * Google ビジネスプロフィール・検索結果でのリッチ表示を狙います。
 */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: siteConfig.brandName,
  image: `${siteConfig.siteUrl}/ogp-v2.png`,
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

/**
 * ブログ記事向け BlogPosting 構造化データ。
 * アイキャッチ画像未設定の記事は、記事ごとに自動生成されるOGP画像を image として使います。
 */
export function blogPostingJsonLd(post: BlogPostMeta) {
  const url = `${siteConfig.siteUrl}/blog/${post.slug}`;
  const image = post.image
    ? `${siteConfig.siteUrl}${post.image}`
    : `${url}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.siteUrl}${siteConfig.logoImage}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image,
  };
}
