# 東京おうちミガキ｜公式サイト（LP）

ハウスクリーニング事業（メイン：エアコンクリーニング）の問い合わせ最大化を
目的としたスマホファーストのランディングページです。

Next.js（App Router）+ TypeScript + Tailwind CSS v4 で構築しています。

## 開発の始め方

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

```bash
npm run build   # 本番ビルド
npm run start   # 本番ビルドの起動確認
npm run lint    # ESLint
```

## 公開前に必ず差し替えてください（TODO）

すべて `src/data/siteConfig.ts` の1ファイルにまとまっています。

| 項目 | 現在の値 | 差し替え先 |
| --- | --- | --- |
| LINE公式アカウントURL | `https://lin.ee/your-line-id`（ダミー） | 実際の友だち追加URL |
| 本番URL（`siteUrl`） | `https://example.com` | 取得した独自ドメイン |

住所は非公開方針のため、サイト上・構造化データともに掲載していません
（`src/data/siteConfig.ts` にも住所フィールドは保持していません）。

なお `src/data/services.ts` の浴室・レンジフード・トイレ・水回り3点セットの
「作業内容」「作業時間目安」は暫定の内容です（料金はご指定いただいた金額を反映済み）。
実際の作業内容に合わせて調整してください。

これらを変更すると、ヘッダー・フッター・CTAボタン・構造化データ（SEO/MEO）
など、サイト全体に自動反映されます。

## サイトの更新方法

すべて `src/data/` 配下のファイルを編集するだけで反映されます。コンポーネント側の
コードを触る必要はありません。

| 内容 | 編集するファイル |
| --- | --- |
| 屋号・LINE URL・対応エリア・定休日など基本情報 | `src/data/siteConfig.ts` |
| サービス一覧（エアコン以外は料金・作業内容・所要時間も） | `src/data/services.ts` |
| エアコンクリーニングの料金・オプション | `src/data/pricing.ts` |
| 選ばれる理由 | `src/data/reasons.ts` |
| ビフォーアフター事例 | `src/data/beforeAfter.ts` |
| お客様の声 | `src/data/testimonials.ts` |
| よくある質問 | `src/data/faq.ts` |
| ブログ記事（お役立ち記事） | `content/blog/*.md`（詳細は [content/blog/README.md](content/blog/README.md)） |

例：エアコン以外のサービスを1件追加したい場合は `src/data/services.ts` の配列に
`isMain: false` のオブジェクトを1つ追加するだけで、「その他のクリーニングサービス」の
アコーディオンに自動で反映されます。

## ページ構成

`src/app/page.tsx` にて以下の順で構成しています。

1. ファーストビュー（`Hero`）
2. 選ばれる理由（`Reasons`）
3. エアコンクリーニング料金（`Pricing`）
4. ビフォーアフター（`BeforeAfter`）
5. ハウスクリーニング（`OtherServices`、アコーディオン形式）
6. お客様の声（`Testimonials`）
7. よくある質問（`Faq`）
8. LINEで相談する（`Contact`）

## ブログ（お役立ち記事）

SEO集客向けのブログ機能を `/blog/` 以下に実装しています。記事はReactコンポーネントではなく
`content/blog/*.md` のMarkdownファイルで管理し、ファイルを1つ追加するだけで一覧・記事ページ・
サイトマップに自動反映されます。追加方法・frontmatterの仕様・運用ルールは
[content/blog/README.md](content/blog/README.md) を参照してください。

- `/blog/` … 記事一覧（`src/app/blog/page.tsx`）
- `/blog/<slug>/` … 記事詳細（`src/app/blog/[slug]/page.tsx`）。記事ごとに
  canonical・OGP・BlogPosting構造化データ・OGP画像を自動生成します
- `npm run blog:new` / `npm run blog:check` / `npm run blog:publish` …
  記事の下書き作成・公開前チェック（重複記事・壊れたリンク・画像・ビルド確認）・
  公開フォルダへの移動を行う半自動フロー（**git commit/push・本番公開は含まれません**）。
  詳しい使い方は [content/blog/README.md](content/blog/README.md) を参照してください
- `src/lib/blog.ts` … Markdown読み込み・frontmatter検証・HTML変換
- 記事のURLは `sitemap.xml` に自動追加されます（`src/app/sitemap.ts`）

## 画像の差し替え

`public/images/README.md` を参照してください。画像が未設置の間は
自動で装飾プレースホルダーが表示されるため、画像なしでも公開可能です。

## お問い合わせ導線について

電話番号・Web予約フォームは廃止し、お問い合わせ導線は公式LINEのみに
統一しています。サイト内のすべてのCTAボタンは `src/data/siteConfig.ts`
の `lineUrl` を参照しているため、この1箇所を変更するだけで
ヘッダー・スマホ下部固定バー・各セクションのボタンすべてに反映されます。

「LINEでメッセージを送信＝即予約確定」ではなく、**当店からの返信をもって
予約確定**となる旨をHero・お問い合わせセクション・FAQ内で明記しています。
即時予約・自動予約・即日対応を連想させる表現は使用していません。

## SEO / MEO

- `src/app/layout.tsx`：title・description・OGP・Twitterカードのメタデータ
- `src/lib/jsonld.ts`：LocalBusiness（MEO向け）／FAQPage の構造化データ
- `src/app/sitemap.ts`・`src/app/robots.ts`：サイトマップ・robots.txt
- `src/app/opengraph-image.tsx`・`src/app/icon.tsx`：OGP画像・favicon（自動生成、画像ファイル不要）
- `src/app/blog/`：ブログのSEO設定（記事ごとのcanonical・OGP・BlogPosting構造化データ）

「エアコンクリーニング」「ハウスクリーニング」「地域名」で上位表示を狙う
構造になっています。地域名は `siteConfig.seoAreaName` を差し替えるだけで
タイトル・description・構造化データ全体に反映されます。

## デプロイ

Vercel へのデプロイを推奨します。GitHubリポジトリと連携し、
[Vercel](https://vercel.com/new) にインポートするだけで公開できます。
独自ドメインを設定したら、`siteConfig.siteUrl` を必ずそのドメインに更新してください。
