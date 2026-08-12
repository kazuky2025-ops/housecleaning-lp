import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BLOG_DIR, BLOG_DRAFTS_DIR, parseMeta } from "@/lib/blog";
import { isBlogCategory, BLOG_CATEGORIES } from "@/types/blog";
import type { BlogPostMeta } from "@/types/blog";

export { BLOG_DIR, BLOG_DRAFTS_DIR, BLOG_CATEGORIES, isBlogCategory };

export type LoadedPost = {
  slug: string;
  file: string;
  status: "published" | "draft";
  /** frontmatterの検証に失敗した場合はここにエラー文言が入り、meta は null になります */
  error?: string;
  meta: BlogPostMeta | null;
  rawContent: string;
};

function readMd(dir: string, file: string, status: "published" | "draft"): LoadedPost {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  const { data, content } = matter(raw);
  try {
    const meta = parseMeta(slug, data);
    return { slug, file, status, meta, rawContent: content };
  } catch (err) {
    return {
      slug,
      file,
      status,
      error: err instanceof Error ? err.message : String(err),
      meta: null,
      rawContent: content,
    };
  }
}

function listMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !/^readme\.md$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

/** 公開済み記事（content/blog/*.md）を読み込みます */
export function loadPublishedPosts(): LoadedPost[] {
  return listMdFiles(BLOG_DIR).map((file) => readMd(BLOG_DIR, file, "published"));
}

/** 下書き記事（content/blog/drafts/*.md）を読み込みます */
export function loadDraftPosts(): LoadedPost[] {
  return listMdFiles(BLOG_DRAFTS_DIR).map((file) => readMd(BLOG_DRAFTS_DIR, file, "draft"));
}

export function loadAllPosts(): LoadedPost[] {
  return [...loadPublishedPosts(), ...loadDraftPosts()];
}

/**
 * ヘッダーの実際のナビゲーションリンクから、LP内で有効な `/#anchor` の
 * 一覧を動的に取得します（ハードコードして二重管理にならないようにするため）。
 */
export function getValidLpAnchors(): string[] {
  const anchors = new Set<string>();
  for (const file of ["Header.tsx", "Footer.tsx"]) {
    const filePath = path.join(process.cwd(), "src", "components", "layout", file);
    const src = fs.readFileSync(filePath, "utf-8");
    for (const match of src.matchAll(/href:\s*"(\/#[a-z-]+)"/g)) {
      anchors.add(match[1]);
    }
  }
  return [...anchors];
}

/** 文字列を正規化し、日本語でも比較しやすいように2文字bigramの集合にします */
function toBigrams(text: string): Set<string> {
  const normalized = text
    .toLowerCase()
    .replace(/[\s　。、,.!?！？「」『』（）()・\-ー]/g, "");
  const grams = new Set<string>();
  for (let i = 0; i < normalized.length - 1; i++) {
    grams.add(normalized.slice(i, i + 2));
  }
  if (grams.size === 0 && normalized.length > 0) grams.add(normalized);
  return grams;
}

/** 0〜1のJaccard類似度。しきい値の目安: 0.35以上でテーマ重複の疑いあり */
export function textSimilarity(a: string, b: string): number {
  const setA = toBigrams(a);
  const setB = toBigrams(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const gram of setA) {
    if (setB.has(gram)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export const SIMILARITY_WARNING_THRESHOLD = 0.35;

export type SimilarityHit = { slug: string; status: string; title: string; score: number };

/** candidateText（タイトル+説明+見出し等）を既存記事と比較し、類似度が高い順に返します */
export function findSimilarPosts(candidateText: string, existing: LoadedPost[]): SimilarityHit[] {
  return existing
    .filter((post) => post.meta)
    .map((post) => {
      const compareText = `${post.meta!.title} ${post.meta!.description}`;
      return {
        slug: post.slug,
        status: post.status,
        title: post.meta!.title,
        score: textSimilarity(candidateText, compareText),
      };
    })
    .filter((hit) => hit.score >= SIMILARITY_WARNING_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
