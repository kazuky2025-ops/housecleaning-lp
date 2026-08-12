import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { isBlogCategory, type BlogPost, type BlogPostMeta } from "@/types/blog";
import { applyBlogFacts } from "@/lib/blogFacts";

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");
export const BLOG_DRAFTS_DIR = path.join(BLOG_DIR, "drafts");

/** 記事本文中でCTAを挿入したい位置に置くマーカー行 */
const CTA_MARKER = "<!-- CTA -->";

function listPostFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md") && !/^readme\.md$/i.test(file))
    .sort();
}

/** slug はファイル名（拡張子なし）で管理します。frontmatterに slug は不要です。 */
function slugFromFile(file: string): string {
  return file.replace(/\.md$/, "");
}

/**
 * frontmatterを検証してBlogPostMetaに変換します。
 * 必須項目の欠落・未定義categoryはここで例外を投げます
 * （ビルド時／`npm run blog:check` の両方から共有される検証ロジックです）。
 */
export function parseMeta(slug: string, data: Record<string, unknown>): BlogPostMeta {
  const missing = ["title", "description", "publishedAt", "category"].filter(
    (key) => !data[key]
  );
  if (missing.length > 0) {
    throw new Error(
      `content/blog/${slug}.md のfrontmatterに必須項目がありません: ${missing.join(", ")}`
    );
  }
  const category = data.category as string;
  if (!isBlogCategory(category)) {
    throw new Error(
      `content/blog/${slug}.md の category "${category}" は未定義のカテゴリです。src/types/blog.ts の BLOG_CATEGORIES を確認してください。`
    );
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    publishedAt: String(data.publishedAt),
    updatedAt: data.updatedAt ? String(data.updatedAt) : String(data.publishedAt),
    category,
    author: data.author ? String(data.author) : "東京おうちミガキ。編集部",
    image: data.image ? String(data.image) : undefined,
    imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
  };
}

/**
 * 執筆メモなど `<!-- ... -->` のHTMLコメントを本文から除去します。
 * remarkのCommonMark解析では複数行コメントが常にHTMLブロックとして
 * 認識されるとは限らず、地の文として表示されてしまうことがあるため、
 * 変換前に明示的に取り除いています（`<!-- CTA -->` は分割処理側で
 * 既に取り除かれた後に呼ばれるため対象外）。
 */
function stripHtmlComments(markdown: string): string {
  return markdown.replace(/<!--[\s\S]*?-->/g, "");
}

async function markdownToHtml(markdown: string): Promise<string> {
  const processor = remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify);
  const result = await processor.process(stripHtmlComments(markdown));
  return String(result);
}

/** 全記事のメタ情報を公開日の新しい順で返します（一覧・サイトマップ用） */
export function getAllPostsMeta(): BlogPostMeta[] {
  return listPostFiles()
    .map((file) => {
      const slug = slugFromFile(file);
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      return parseMeta(slug, data);
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getAllPostSlugs(): string[] {
  return listPostFiles().map(slugFromFile);
}

/**
 * 指定slugの記事を本文HTML付きで返します。存在しない場合は null。
 * generateMetadata とページ本体の両方から呼ばれるため、
 * 同一リクエスト内では1回だけ実行されるように cache() でメモ化しています。
 */
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(raw);
  const meta = parseMeta(slug, data);
  const content = applyBlogFacts(rawContent);

  const ctaIndex = content
    .split("\n")
    .findIndex((line) => line.trim() === CTA_MARKER);

  let htmlParts: string[];
  if (ctaIndex === -1) {
    htmlParts = [await markdownToHtml(content)];
  } else {
    const lines = content.split("\n");
    const before = lines.slice(0, ctaIndex).join("\n");
    const after = lines.slice(ctaIndex + 1).join("\n");
    htmlParts = [await markdownToHtml(before), await markdownToHtml(after)];
  }

  return { ...meta, htmlParts };
});
