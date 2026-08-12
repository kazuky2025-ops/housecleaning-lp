import type { Metadata } from "next";
import Section from "@/components/ui/Section";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPostsMeta } from "@/lib/blog";

const title = "お役立ち記事";
const description =
  "エアコンクリーニングやハウスクリーニングに関するお役立ち情報を発信しています。西東京市を中心に東京西部エリアの皆さまに役立つ情報をお届けします。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <Section
      id="blog"
      tone="mist"
      eyebrow="Blog"
      title={title}
      lead="エアコンクリーニングやお掃除に関するお役立ち情報をお届けします。"
    >
      {posts.length === 0 ? (
        <p className="text-center text-sm text-ink-soft">
          現在準備中です。近日公開予定です。
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Section>
  );
}
