import type { BlogCategory, BlogCategoryMeta } from "@/types/blog";

/** ブログカテゴリごとの表示アイコン */
export const blogCategoryMeta: Record<BlogCategory, BlogCategoryMeta> = {
  エアコンクリーニング: { icon: "wind" },
  水回りクリーニング: { icon: "droplet" },
  お掃除の知識: { icon: "sparkles" },
  施工事例: { icon: "clipboard" },
  地域情報: { icon: "map" },
};
