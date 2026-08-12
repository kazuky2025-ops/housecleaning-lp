import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import BlogThumbnail from "@/components/blog/BlogThumbnail";
import ArticleBody from "@/components/blog/ArticleBody";
import BlogCta from "@/components/blog/BlogCta";
import RelatedServiceLinks from "@/components/blog/RelatedServiceLinks";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { blogPostingJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/data/siteConfig";

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteConfig.siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatJaDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const hasMidCta = post.htmlParts.length > 1;

  return (
    <article className="bg-paper py-12 sm:py-18">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-brand"
        >
          <Icon name="chevronDown" className="h-4 w-4 rotate-90" strokeWidth={2} />
          記事一覧に戻る
        </Link>

        <div className="mt-6 flex items-center gap-2 text-xs text-ink-soft">
          <span className="rounded-full bg-brand-light px-2.5 py-1 font-semibold text-brand">
            {post.category}
          </span>
          <time dateTime={post.publishedAt}>{formatJaDate(post.publishedAt)}</time>
          {post.updatedAt !== post.publishedAt && (
            <span>（更新：{formatJaDate(post.updatedAt)}）</span>
          )}
        </div>

        <h1 className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-wide text-ink sm:text-3xl">
          {post.title}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          {post.description}
        </p>

        <div
          className={`relative mt-6 overflow-hidden rounded-2xl ${
            post.image ? "aspect-[3/2]" : "aspect-[16/9]"
          }`}
        >
          <BlogThumbnail
            image={post.image}
            imageAlt={post.imageAlt}
            category={post.category}
            alt={post.title}
          />
        </div>

        <ArticleBody html={post.htmlParts[0]} />

        {hasMidCta && (
          <>
            <BlogCta className="mt-10" />
            <ArticleBody html={post.htmlParts[1]} />
          </>
        )}

        <BlogCta className="mt-10" />

        <div className="mt-8">
          <RelatedServiceLinks />
        </div>

        <p className="mt-8 text-xs text-ink-soft">執筆：{post.author}</p>
      </Container>

      <Script
        id="ld-json-blog-posting"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(post)) }}
      />
    </article>
  );
}
