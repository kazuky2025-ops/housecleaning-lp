import type { IconName } from "@/types";

/**
 * ブログのカテゴリ一覧。
 * カテゴリを追加する場合はここに追記し、
 * src/data/blogCategories.ts にアイコンを対応させてください。
 */
export const BLOG_CATEGORIES = [
  "エアコンクリーニング",
  "水回りクリーニング",
  "お掃除の知識",
  "施工事例",
  "地域情報",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export function isBlogCategory(value: string): value is BlogCategory {
  return (BLOG_CATEGORIES as readonly string[]).includes(value);
}

/** 記事の一覧表示・メタデータ生成に使うフロントマター情報 */
export type BlogPostMeta = {
  /** URLスラッグ。content/blog/<slug>.md のファイル名から決まります */
  slug: string;
  title: string;
  description: string;
  /** ISO日付文字列（例: "2026-08-12"） */
  publishedAt: string;
  /** ISO日付文字列。省略時は publishedAt と同じ値になります */
  updatedAt: string;
  category: BlogCategory;
  author: string;
  /** public配下のサムネイル画像パス。未設定ならブランドプレースホルダーを表示 */
  thumbnail?: string;
};

/** 記事本文まで含んだ完全なデータ（詳細ページ用） */
export type BlogPost = BlogPostMeta & {
  /**
   * 本文HTML。通常は要素1つ（htmlParts[0]）。
   * Markdown本文中に `<!-- CTA -->` の行がある場合はそこで分割され、
   * 要素2つ（CTA挿入位置の前後）になります。
   */
  htmlParts: string[];
};

export type BlogCategoryMeta = {
  icon: IconName;
};
