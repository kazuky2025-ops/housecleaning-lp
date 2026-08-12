/**
 * npm run blog:check [-- --slug <slug>] [--skip-build]
 *
 * 公開前の安全チェックです。git操作・公開操作は一切行いません。
 * 既定では content/blog/*.md（公開済み）と content/blog/drafts/*.md（下書き）の
 * 全記事を対象に検証します。--slug を指定すると1件だけに絞れます。
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import matter from "gray-matter";
import {
  loadAllPosts,
  getValidLpAnchors,
  textSimilarity,
  SIMILARITY_WARNING_THRESHOLD,
  type LoadedPost,
} from "./shared";
import { findUnknownTokens } from "../../src/lib/blogFacts";
import { siteConfig } from "../../src/data/siteConfig";

type Issue = { slug: string; level: "error" | "warning"; message: string };

function main() {
  const argv = process.argv.slice(2);
  const skipBuild = argv.includes("--skip-build");
  const slugFilterIdx = argv.indexOf("--slug");
  const slugFilter = slugFilterIdx !== -1 ? argv[slugFilterIdx + 1] : undefined;

  let posts = loadAllPosts();
  if (slugFilter) {
    posts = posts.filter((p) => p.slug === slugFilter);
    if (posts.length === 0) {
      console.error(`\n✗ slug "${slugFilter}" の記事が見つかりません（公開済み・下書きとも）\n`);
      process.exit(1);
    }
  }

  const issues: Issue[] = [];
  const anchors = new Set(getValidLpAnchors());
  const publishedSlugs = new Set(
    loadAllPosts()
      .filter((p) => p.status === "published")
      .map((p) => p.slug)
  );
  const allSlugs = loadAllPosts().map((p) => p.slug);

  // slug重複（公開済み・下書きをまたいだ衝突も検知）
  const slugCounts = new Map<string, number>();
  for (const s of allSlugs) slugCounts.set(s, (slugCounts.get(s) ?? 0) + 1);

  for (const post of posts) {
    const label = `[${post.status}] ${post.slug}`;

    if (post.error) {
      issues.push({ slug: post.slug, level: "error", message: `frontmatter不正: ${post.error}` });
      continue; // metaが無いのでこれ以降のチェックは意味がない
    }
    const meta = post.meta!;

    if ((slugCounts.get(post.slug) ?? 0) > 1) {
      issues.push({ slug: post.slug, level: "error", message: "slugが他の記事（公開済み/下書き）と重複しています" });
    }

    // frontmatter完全性の追加チェック（parseMetaで拾えない軽微な項目）
    if (!meta.description || meta.description.length < 10) {
      issues.push({ slug: post.slug, level: "warning", message: "descriptionが短すぎます（10文字未満）" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.publishedAt)) {
      issues.push({ slug: post.slug, level: "error", message: `publishedAtの形式が不正です: "${meta.publishedAt}"（YYYY-MM-DD）` });
    }

    // 生ファイル全体（frontmatter含む）に対するチェック
    const rawPath =
      post.status === "published"
        ? path.join(process.cwd(), "content", "blog", post.file)
        : path.join(process.cwd(), "content", "blog", "drafts", post.file);
    const raw = fs.readFileSync(rawPath, "utf-8");

    if (raw.includes("housecleaning-lp")) {
      issues.push({ slug: post.slug, level: "error", message: "旧Vercel URL（housecleaning-lp）が含まれています" });
    }

    for (const lineeMatch of raw.matchAll(/https?:\/\/lin\.ee\/[a-zA-Z0-9]+/g)) {
      if (lineeMatch[0] !== siteConfig.lineUrl) {
        issues.push({
          slug: post.slug,
          level: "error",
          message: `LINE URLが正しくありません: "${lineeMatch[0]}"（正: ${siteConfig.lineUrl}）。本文にLINE URLを直接書かず、CTAブロックを使ってください`,
        });
      }
    }

    // 未定義トークン
    const unknownTokens = findUnknownTokens(post.rawContent);
    if (unknownTokens.length > 0) {
      issues.push({
        slug: post.slug,
        level: "error",
        message: `未定義のトークンがあります: ${unknownTokens.map((t) => `{{${t}}}`).join(", ")}`,
      });
    }

    // H1使用チェック（軽微・警告のみ）
    if (/^#\s+/m.test(post.rawContent)) {
      issues.push({ slug: post.slug, level: "warning", message: "本文に # (H1) が使われています。タイトルと二重になるため ## から始めてください" });
    }

    // 内部リンクの存在チェック（画像 ![alt](src) は下の画像チェックで扱うため除外）
    const imageSrcs = new Set(
      [...post.rawContent.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1])
    );
    for (const linkMatch of post.rawContent.matchAll(/\]\(([^)\s]+)\)/g)) {
      const href = linkMatch[1];
      if (imageSrcs.has(href)) continue;
      if (!href.startsWith("/")) continue; // 外部リンク・アンカーのみの#等は対象外
      if (href === "/") continue;
      if (href.startsWith("/#")) {
        if (!anchors.has(href)) {
          issues.push({ slug: post.slug, level: "error", message: `存在しないLPアンカーへのリンクです: ${href}` });
        }
        continue;
      }
      const blogLinkMatch = href.match(/^\/blog\/([a-z0-9-]+)\/?$/);
      if (href === "/blog" || href === "/blog/") continue;
      if (blogLinkMatch) {
        const targetSlug = blogLinkMatch[1];
        if (!publishedSlugs.has(targetSlug)) {
          issues.push({
            slug: post.slug,
            level: "error",
            message: `存在しない（または未公開の）記事へのリンクです: ${href}`,
          });
        }
        continue;
      }
      issues.push({ slug: post.slug, level: "error", message: `未知の内部リンクです: ${href}` });
    }

    // 画像の存在チェック（アイキャッチ・本文中の画像）
    if (meta.image) {
      const imgPath = path.join(process.cwd(), "public", meta.image.replace(/^\//, ""));
      if (!fs.existsSync(imgPath)) {
        issues.push({ slug: post.slug, level: "error", message: `imageの画像ファイルが存在しません: ${meta.image}` });
      }
      if (!meta.imageAlt) {
        issues.push({ slug: post.slug, level: "warning", message: "imageは設定されていますがimageAltが空です。具体的なalt文を設定してください" });
      }
    }
    for (const imgMatch of post.rawContent.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const src = imgMatch[1];
      if (!src.startsWith("/")) continue;
      const imgPath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
      if (!fs.existsSync(imgPath)) {
        issues.push({ slug: post.slug, level: "error", message: `本文中の画像ファイルが存在しません: ${src}` });
      }
    }

    void label;
  }

  // タイトル重複・テーマ類似度チェック（全記事の総当たり）
  const validPosts = posts.filter((p) => p.meta);
  for (let i = 0; i < validPosts.length; i++) {
    for (let j = i + 1; j < validPosts.length; j++) {
      const a = validPosts[i];
      const b = validPosts[j];
      if (a.meta!.title.trim() === b.meta!.title.trim()) {
        issues.push({
          slug: a.slug,
          level: "error",
          message: `タイトルが "${b.slug}" と完全に一致しています`,
        });
        continue;
      }
      const score = textSimilarity(
        `${a.meta!.title} ${a.meta!.description}`,
        `${b.meta!.title} ${b.meta!.description}`
      );
      if (score >= SIMILARITY_WARNING_THRESHOLD) {
        issues.push({
          slug: a.slug,
          level: "warning",
          message: `"${b.slug}" とテーマが類似しています（類似度 ${(score * 100).toFixed(0)}%）。地域名だけ置き換えた量産記事になっていないか確認してください`,
        });
      }
    }
  }

  let buildOk = true;
  let tscOk = true;
  if (!skipBuild) {
    console.log("\n▶ tsc --noEmit を実行中...");
    try {
      execSync("npx tsc --noEmit", { stdio: "pipe", cwd: process.cwd() });
      console.log("  ✓ TypeScriptエラーなし");
    } catch (err) {
      tscOk = false;
      const output = err && typeof err === "object" && "stdout" in err ? String((err as { stdout: Buffer }).stdout) : String(err);
      console.log("  ✗ TypeScriptエラーがあります:\n" + output);
    }

    console.log("▶ npm run build を実行中（時間がかかります）...");
    try {
      execSync("npm run build", { stdio: "pipe", cwd: process.cwd() });
      console.log("  ✓ ビルド成功");
    } catch (err) {
      buildOk = false;
      const output = err && typeof err === "object" && "stdout" in err ? String((err as { stdout: Buffer }).stdout) : String(err);
      console.log("  ✗ ビルドエラーがあります:\n" + output);
    }
  } else {
    console.log("\n（--skip-build のため build / tsc はスキップしました）");
  }

  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");

  console.log(`\n================ blog:check 結果（対象: ${posts.length}件） ================\n`);
  if (errors.length === 0 && warnings.length === 0) {
    console.log("問題は見つかりませんでした。");
  }
  if (errors.length > 0) {
    console.log(`✗ エラー ${errors.length}件:`);
    for (const issue of errors) console.log(`  - [${issue.slug}] ${issue.message}`);
  }
  if (warnings.length > 0) {
    console.log(`\n⚠ 警告 ${warnings.length}件（公開ブロックはしませんが確認推奨）:`);
    for (const issue of warnings) console.log(`  - [${issue.slug}] ${issue.message}`);
  }

  const ok = errors.length === 0 && buildOk && tscOk;
  console.log(`\n${ok ? "✓ 公開前チェックを通過しました。" : "✗ 未解決のエラーがあります。公開前に修正してください。"}\n`);
  process.exit(ok ? 0 : 1);
}

main();
