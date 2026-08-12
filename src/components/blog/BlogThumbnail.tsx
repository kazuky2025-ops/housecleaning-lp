import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { blogCategoryMeta } from "@/data/blogCategories";
import type { BlogCategory } from "@/types/blog";

type BlogThumbnailProps = {
  thumbnail?: string;
  category: BlogCategory;
  alt: string;
  className?: string;
  fill?: boolean;
};

/**
 * ブログ記事のサムネイル表示。
 * thumbnail（public配下の画像パス）が未設定の間は、カテゴリに応じた
 * ブランドプレースホルダー（ImagePlaceholder）を自動表示します。
 */
export default function BlogThumbnail({
  thumbnail,
  category,
  alt,
  className = "",
  fill = true,
}: BlogThumbnailProps) {
  return (
    <ImagePlaceholder
      src={thumbnail}
      alt={alt}
      icon={blogCategoryMeta[category].icon}
      label={thumbnail ? undefined : category}
      variant="brand"
      fill={fill}
      className={className}
    />
  );
}
