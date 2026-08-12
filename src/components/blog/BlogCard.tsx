import Link from "next/link";
import BlogThumbnail from "./BlogThumbnail";
import type { BlogPostMeta } from "@/types/blog";

function formatJaDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-paper transition-shadow duration-200 hover:shadow-[0_12px_32px_-16px_rgba(18,60,64,0.35)]"
    >
      <div className="relative aspect-[16/10]">
        <BlogThumbnail thumbnail={post.thumbnail} category={post.category} alt={post.title} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <span className="rounded-full bg-brand-light px-2.5 py-1 font-semibold text-brand">
            {post.category}
          </span>
          <time dateTime={post.publishedAt}>{formatJaDate(post.publishedAt)}</time>
        </div>
        <h3 className="mt-3 line-clamp-2 text-base font-bold text-ink transition-colors group-hover:text-brand">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
