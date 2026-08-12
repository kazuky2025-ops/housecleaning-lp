import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { blogCategoryMeta } from "@/data/blogCategories";
import type { BlogCategory } from "@/types/blog";

type BlogThumbnailProps = {
  image?: string;
  imageAlt?: string;
  category: BlogCategory;
  /** imageAlt未設定時に使うフォールバックのalt（通常は記事タイトル） */
  alt: string;
  className?: string;
  fill?: boolean;
};

/**
 * ブログ記事のアイキャッチ表示。
 * image（public配下の画像パス）が未設定の間は、カテゴリに応じた
 * ブランドプレースホルダー（ImagePlaceholder、濃紺グラデーション）を自動表示します。
 * 画像が設定されている場合は next/image（object-cover相当）で表示します。
 */
export default function BlogThumbnail({
  image,
  imageAlt,
  category,
  alt,
  className = "",
  fill = true,
}: BlogThumbnailProps) {
  return (
    <ImagePlaceholder
      src={image}
      alt={imageAlt || alt}
      icon={blogCategoryMeta[category].icon}
      label={image ? undefined : category}
      variant="brand"
      fill={fill}
      className={className}
    />
  );
}
