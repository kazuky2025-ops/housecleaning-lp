/**
 * npm run blog:publish -- <slug>
 *
 * content/blog/drafts/<slug>.md を content/blog/<slug>.md へ移動します。
 * これは「人間が公開を承認した」ことを表す操作です。
 *
 * このスクリプトは git commit / git push / Vercelへのデプロイ は一切行いません。
 * 実際にサイトへ公開するには、この後で自分の判断で
 * git add / git commit / git push を実行してください。
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { BLOG_DIR, BLOG_DRAFTS_DIR } from "./shared";

function main() {
  const slug = process.argv[2];
  if (!slug || slug.startsWith("--")) {
    console.error("\n✗ 使い方: npm run blog:publish -- <slug>\n");
    process.exit(1);
  }

  const draftPath = path.join(BLOG_DRAFTS_DIR, `${slug}.md`);
  if (!fs.existsSync(draftPath)) {
    console.error(`\n✗ content/blog/drafts/${slug}.md が見つかりません\n`);
    process.exit(1);
  }

  const publishedPath = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(publishedPath)) {
    console.error(`\n✗ content/blog/${slug}.md は既に存在します\n`);
    process.exit(1);
  }

  console.log(`\n▶ 公開前チェックを実行します（npm run blog:check -- --slug ${slug}）...\n`);
  try {
    execSync(`npx tsx scripts/blog/check.ts --slug ${slug}`, { stdio: "inherit", cwd: process.cwd() });
  } catch {
    console.error("\n✗ チェックに失敗したため、公開フォルダへは移動していません。上記のエラーを解消してから再実行してください。\n");
    process.exit(1);
  }

  fs.renameSync(draftPath, publishedPath);

  console.log(`\n✓ content/blog/${slug}.md へ移動しました。`);
  console.log("\nまだ git commit / push / 本番デプロイは行われていません。");
  console.log("内容に問題なければ、次のコマンドで公開してください（実行するかはあなたの判断です）:\n");
  console.log(`  git add content/blog/${slug}.md`);
  console.log(`  git commit -m "Add blog post: ${slug}"`);
  console.log("  git push origin master\n");
}

main();
