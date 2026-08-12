/**
 * npm run blog:new -- --title "..." --slug "..." --category "..." --keyword "..." [--description "..."] [--force]
 *
 * 新しいブログ記事の「下書き」を content/blog/drafts/ に1つ生成します。
 * - この時点では /blog/ には一切反映されません（drafts/ は本番コードから読まれません）
 * - git commit / push / 本番公開は一切行いません
 * - 既存記事とタイトル・説明文が似すぎている場合は警告し、--force なしでは停止します
 *
 * 本文はプレースホルダー（見出しと執筆メモ）だけを書き出します。
 * 実際の文章は、このあとMarkdownファイルを直接編集して書いてください
 * （Claude Codeに続けて執筆を依頼する場合も、このファイルを編集する形になります）。
 */
import fs from "node:fs";
import path from "node:path";
import {
  BLOG_DRAFTS_DIR,
  BLOG_CATEGORIES,
  isBlogCategory,
  loadAllPosts,
  findSimilarPosts,
  getValidLpAnchors,
  today,
} from "./shared";
import { blogFacts } from "../../src/lib/blogFacts";

type Args = {
  title?: string;
  slug?: string;
  category?: string;
  keyword?: string;
  description?: string;
  force: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = { force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--force") {
      args.force = true;
      continue;
    }
    const key = arg.replace(/^--/, "") as keyof Omit<Args, "force">;
    if (["title", "slug", "category", "keyword", "description"].includes(key)) {
      args[key] = argv[++i];
    }
  }
  return args;
}

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.title) fail("--title は必須です（例: --title \"エアコンの臭いが気になる方へ\"）");
  if (!args.slug) fail("--slug は必須です（半角英数字とハイフンのみ。例: --slug \"aircon-smell-causes\"）");
  if (!args.category) fail(`--category は必須です。次のいずれかを指定してください: ${BLOG_CATEGORIES.join(" / ")}`);
  if (!isBlogCategory(args.category)) {
    fail(`category "${args.category}" は未定義です。次のいずれかを指定してください: ${BLOG_CATEGORIES.join(" / ")}`);
  }
  if (!args.keyword) fail("--keyword は必須です（狙う検索キーワードを1つ。例: --keyword \"エアコン 臭い 原因\"）");
  if (!/^[a-z0-9-]+$/.test(args.slug)) {
    fail(`slug "${args.slug}" は半角英数字とハイフンのみで指定してください`);
  }

  const description = args.description ?? `${args.title}について解説します。`;

  fs.mkdirSync(BLOG_DRAFTS_DIR, { recursive: true });
  const draftPath = path.join(BLOG_DRAFTS_DIR, `${args.slug}.md`);
  if (fs.existsSync(draftPath)) {
    fail(`content/blog/drafts/${args.slug}.md は既に存在します。別のslugを指定するか、既存ファイルを編集してください。`);
  }

  const existing = loadAllPosts();

  // slug完全一致チェック（下書き・公開済みの両方）
  const slugConflict = existing.find((post) => post.slug === args.slug);
  if (slugConflict) {
    fail(
      `slug "${args.slug}" は既に${slugConflict.status === "published" ? "公開済み記事" : "下書き"}で使われています（${slugConflict.file}）。別のslugを指定してください。`
    );
  }

  // タイトル・説明文の類似度チェック（地域名だけ変えた量産記事などを検知）
  const candidateText = `${args.title} ${description} ${args.keyword}`;
  const similar = findSimilarPosts(candidateText, existing);

  if (similar.length > 0 && !args.force) {
    console.log("\n⚠ 既存記事とテーマが重複している可能性があります:\n");
    for (const hit of similar) {
      console.log(
        `  - [${hit.status === "published" ? "公開済み" : "下書き"}] ${hit.slug}（類似度 ${(hit.score * 100).toFixed(0)}%）\n      "${hit.title}"`
      );
    }
    console.log(
      "\n地域名だけを入れ替えた量産記事など、内容がほぼ同じ記事は作らないでください。"
    );
    console.log(
      "内容を変えて別テーマにするか、本当に新規で必要なら --force を付けて再実行してください。\n"
    );
    process.exit(1);
  }

  const anchors = getValidLpAnchors();
  const suggestedAnchor =
    {
      エアコンクリーニング: "/#pricing",
      水回りクリーニング: "/#other-services",
      お掃除の知識: "/#reasons",
      施工事例: "/#before-after",
      地域情報: "/#contact",
    }[args.category] ?? "/#pricing";

  const relatedPublished = existing.filter(
    (post) => post.status === "published" && post.meta && post.slug !== args.slug
  );

  const frontmatter = [
    "---",
    `title: "${args.title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `publishedAt: "${today()}"`,
    `updatedAt: "${today()}"`,
    `category: "${args.category}"`,
    `author: "東京おうちミガキ。編集部"`,
    `image: ""`,
    `imageAlt: ""`,
    "---",
  ].join("\n");

  const tokenHints = Object.keys(blogFacts)
    .map((key) => `      {{${key}}} → ${blogFacts[key]}`)
    .join("\n");

  const body = `
<!--
  執筆メモ（公開前に必ずこのコメントごと削除してください）
  ------------------------------------------------------------
  狙うキーワード: ${args.keyword}
  カテゴリ: ${args.category}

  ルール:
  - # (H1) は使わない。本文は ## から始める
  - 料金・対応エリアなどの事実は下記のトークン（二重中括弧で囲んだ名前）を
    本文中に書いて参照する（本文に直接金額を書かない）。使えるトークン一覧:
${tokenHints}
  - 医療・健康効果を断定しない（「治る」「改善する」等は禁止）
  - 検索ボリューム等の数字を推測で書かない
  - 文字数を稼ぐための冗長な文章は禁止。検索意図を満たす長さで十分
  - LINE CTAは本文下部に自動挿入されます。途中にも置きたい場合のみ、CTAとだけ書いた
    HTMLコメント行を1つ追加してください（書き方はcontent/blog/README.md参照）
  - アイキャッチ画像を使う場合は public/images/blog/ に実ファイルを置き、
    frontmatterの image に "/images/blog/ファイル名" を、imageAlt に具体的な
    alt文を書く。画像がない間は image を空のままにする（自動でプレースホルダー表示）
  - 内部リンクは実在するURLのみ使用（LPの主な遷移先: ${anchors.join(", ")}）
  - 関連する既存記事があれば自然に内部リンクしてください:
${relatedPublished.length > 0 ? relatedPublished.map((p) => `      /blog/${p.slug} … 「${p.meta!.title}」`).join("\n") : "      （現在、関連付けられる公開済み記事はありません）"}
-->

## 導入（検索意図に直接答える）

「${args.keyword}」で検索する方が知りたいことに、最初の数行で結論から答える。

## 結論

## 理由

## 具体例

## 自分でできること

## 業者に依頼した方がいいケース

## 東京おうちミガキ。で対応できる場合

[サービス内容・料金の詳細](${suggestedAnchor}) もあわせてご確認ください。

## まとめ
`;

  fs.writeFileSync(draftPath, `${frontmatter}\n${body}`, "utf-8");

  console.log("\n================ ブログ記事ドラフトを作成しました ================\n");
  console.log(`記事タイトル: ${args.title}`);
  console.log(`狙うテーマ/キーワード: ${args.keyword}`);
  console.log(`検索意図: 「${args.keyword}」と検索する方は、${args.category}に関する情報を探していると考えられます（推測であり、検索ボリューム等の実測値ではありません）`);
  console.log(`slug: ${args.slug}`);
  console.log(`保存先: content/blog/drafts/${args.slug}.md`);
  console.log(
    `関連記事: ${relatedPublished.length > 0 ? relatedPublished.map((p) => `/blog/${p.slug}`).join(", ") : "なし"}`
  );
  console.log(`内部リンク候補: ${suggestedAnchor}（LPの有効なアンカー: ${anchors.join(", ")}）`);
  console.log(`使用できる自社データトークン: ${Object.keys(blogFacts).length}件（src/lib/blogFacts.ts参照）`);
  console.log(`画像設定状況: 未設定（image: ""。カテゴリのプレースホルダーが自動表示されます。画像を用意したら public/images/blog/ に置き、frontmatterのimage/imageAltに記入してください）`);
  console.log(
    `SEO事前チェック: ${similar.length > 0 ? `類似記事あり（--forceで続行）: ${similar.map((s) => s.slug).join(", ")}` : "重大な重複なし"}`
  );
  console.log("\n次のステップ:");
  console.log(`  1. content/blog/drafts/${args.slug}.md を直接編集して本文を執筆する`);
  console.log("  2. npm run blog:check で検証する");
  console.log(`  3. 問題なければ npm run blog:publish -- ${args.slug} で公開フォルダへ移動する`);
  console.log("\n記事を確認してください。本番公開はまだ行っていません。\n");
}

main();
