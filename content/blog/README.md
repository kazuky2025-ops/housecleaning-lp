# ブログ記事の追加方法（半自動フロー）

記事は次の順番で追加します。**どの段階でも `git commit` / `git push` / 本番公開は自動では行われません。** 実際に公開するかどうかは、必ず人間が最後に判断してください。

```
① npm run blog:new       … 下書きを作成（content/blog/drafts/ に保存。サイトには反映されない）
② 下書きを編集して執筆     … 人間（またはClaude Code）が本文を書く／直す
③ npm run blog:check     … 公開前チェック（frontmatter・重複・リンク・画像・ビルド等）
④ npm run blog:publish   … 人間が内容を承認し、公開フォルダへ移動（まだ公開されない）
⑤ git commit / git push  … ここで初めてVercelにデプロイされ、本番公開される
⑥ Google Search Console でインデックス登録をリクエスト（任意・推奨）
```

---

## ① 新しい記事を作る（`npm run blog:new`）

```bash
npm run blog:new -- --title "記事タイトル" --slug "url-slug" --category "エアコンクリーニング" --keyword "狙うキーワード"
```

| オプション | 必須 | 説明 |
| --- | --- | --- |
| `--title` | ✅ | 記事タイトル |
| `--slug` | ✅ | URLになる文字列。**半角英数字とハイフンのみ**（例: `aircon-smell-causes`） |
| `--category` | ✅ | カテゴリ一覧（下記）のいずれか1つ |
| `--keyword` | ✅ | 狙う検索キーワード（1つ。統計や検索ボリュームの入力は不要です） |
| `--description` | – | meta description。省略すると仮の文章が入るので、必ず後で書き直してください |
| `--force` | – | 重複警告を無視して作成する場合に付けます |

実行すると、まず **`content/blog/` と `content/blog/drafts/` の既存記事すべて**とタイトル・説明文の類似度をチェックします。似ている記事があると一覧表示され、`--force` を付けない限り作成を中止します。地域名だけを入れ替えた量産記事などを防ぐための仕組みです。

問題がなければ `content/blog/drafts/<slug>.md` を作成します。**この時点では `/blog/` には一切表示されません**（`drafts/` フォルダはサイトのコードから読み込まれないためです）。frontmatterと、執筆ガイド（守るべきルール・使える自社データトークン一覧・関連記事候補）を書き込んだ見出しの骨組みが入っています。

## ② 下書きを編集する

`content/blog/drafts/<slug>.md` を直接編集して本文を書きます。ファイル先頭のHTMLコメント（執筆メモ）に、守るべきルールと使えるトークンの一覧が書かれています。**公開前にこのコメントは削除してください。**

Claude Codeに続けて執筆を依頼する場合は、「`content/blog/drafts/<slug>.md` の本文を書いて」のように、このファイルを直接編集してもらう形になります。

### 料金・対応エリアなどの事実は「トークン」で参照する

本文に金額を直接書くと、将来 `src/data/pricing.ts` で値段を変更したときに記事だけ古い金額のまま残ってしまいます。そのため、本文中では次のように二重中括弧のトークンを使ってください（ビルド時に実際の値へ自動置換されます）。

```
通常壁掛けエアコンは{{pricing.aircon.normal}}（税込）で承っております。
```

利用できる主なトークン（全一覧は `src/lib/blogFacts.ts` を参照）:

| トークン | 内容 |
| --- | --- |
| `{{pricing.aircon.normal}}` | 通常壁掛けエアコンの料金 |
| `{{pricing.aircon.autoClean}}` | お掃除機能付きエアコンの料金 |
| `{{pricing.aircon.outdoorUnit}}` | 室外機洗浄オプションの料金 |
| `{{pricing.bathroom}}` / `{{pricing.rangeHood}}` / `{{pricing.toilet}}` / `{{pricing.mizumawariSet}}` | 各サービスの料金 |
| `{{pricing.detergentOption}}` | 天然由来洗剤オプションの料金 |
| `{{pricing.travelFeeNote}}` / `{{pricing.parkingNote}}` | 交通費・駐車料金の注記文 |
| `{{area.coverage}}` | 対応エリアの表記（例: 西東京市を中心に東京西部） |
| `{{area.servedCities}}` | 実際の対応市区町村一覧 |
| `{{contact.replyHours}}` / `{{contact.holiday}}` | 返信対応時間・定休日 |
| `{{brand.name}}` | 屋号 |

存在しないトークンを書くと `npm run blog:check`（および本番ビルド）がエラーで止まります。

### 画像（アイキャッチ）の追加方法

アイキャッチ画像は `/blog/` 一覧のカード上部と、記事詳細ページ上部の両方に自動で使われます（`next/image` による `object-fit: cover` 表示で、縦横比は崩れません）。

- 画像が**ない**場合: frontmatterの `image` は空のままにしてください。カテゴリに応じた濃紺のブランドプレースホルダーが自動表示され、「画像未設定」であることが一目でわかる見た目になります。**表示崩れやエラーにはなりません**
- 画像が**ある**場合:
  1. `public/images/blog/` に画像ファイル（`.jpg` / `.png` / `.webp` など）を置く
  2. frontmatterに次の2行を書く
     ```yaml
     image: "/images/blog/ファイル名.jpg"
     imageAlt: "エアコンクリーニング作業中の様子"
     ```
  3. 存在しないパスを書くと `npm run blog:check` がエラーで検知します。`imageAlt` が空の場合は警告が出ます（具体的なaltを書いてください）
- 画像を設定すると、そのページのOGP画像（`og:image`）とBlogPosting構造化データの`image`にも同じ写真が使われます（未設定の記事は、これまでどおり記事ごとに自動生成されるブランド画像のままです）
- 本文中に画像を追加する場合も同様に、`public/images/blog/` へ実ファイルを置いてから `![説明文](/images/blog/ファイル名.jpg)` の形式で参照してください。**altテキスト（説明文の部分）は必ず具体的に書いてください**
- 施工事例記事でBefore/After写真を使う場合も同じ方法です。実際に提供された写真のみを使用してください

### frontmatter（`blog:new` が自動生成します）

| 項目 | 必須 | 説明 |
| --- | --- | --- |
| `title` | ✅ | 記事タイトル。`<title>`・OGP・構造化データに使われます |
| `description` | ✅ | meta description・OGP descriptionに使われます |
| `publishedAt` | ✅ | 公開日（`YYYY-MM-DD`） |
| `updatedAt` | – | 更新日。省略時は `publishedAt` と同じ扱いになります |
| `category` | ✅ | カテゴリ一覧のいずれか1つ |
| `author` | – | 省略時は「東京おうちミガキ。編集部」になります |
| `image` | – | `public/images/blog/` 配下のアイキャッチ画像パス。空でOK（プレースホルダー表示） |
| `imageAlt` | – | アイキャッチ画像のalt文。`image`を設定する場合は具体的に書いてください |

`slug` はフロントマターに書きません。**ファイル名がそのままslugになります。**

### カテゴリ一覧（`src/types/blog.ts` の `BLOG_CATEGORIES`）

- エアコンクリーニング
- 水回りクリーニング
- お掃除の知識
- 施工事例
- 地域情報

新しいカテゴリが必要な場合は `src/types/blog.ts` の `BLOG_CATEGORIES` と `src/data/blogCategories.ts` のアイコン対応を追加してください（既存記事には影響しません）。

### 本文（Markdown）の書き方

- `#`（H1）は使わないでください。タイトルはページ側が自動で見出しとして表示します。本文は `##`（H2）から始めてください
- 表・箇条書き・強調（GFM）が使えます
- LP内の該当箇所へ自然にリンクしたい場合は、通常のMarkdownリンクを使ってください
  - 例: `[エアコンクリーニングの料金表](/#pricing)`
  - 使えるリンク先: `/#reasons`（選ばれる理由）, `/#pricing`（料金）, `/#before-after`（施工事例）,
    `/#other-services`（浴室・レンジフード・トイレ）, `/#voice`（お客様の声）, `/#faq`（よくある質問）,
    `/#contact`（対応エリア・LINE相談）, 公開済みの他記事は `/blog/<slug>`
  - リンクは文章に自然に溶け込む範囲にとどめ、SEO目的で無理に増やさないでください
  - 存在しないURLへのリンクは `npm run blog:check` がエラーとして検知します
- 本文中の好きな位置に `<!-- CTA -->` という行を1つだけ置くと、そこにLINE無料見積もりの
  CTAブロックが自動で挿入されます（記事下部には常にCTAが表示されるため、必須ではありません）
- LINEのURLを本文に直接書かないでください（`https://lin.ee/...` を手打ちすると
  `npm run blog:check` がエラーにします）。誘導は `<!-- CTA -->` に任せてください

## ③ 公開前チェック（`npm run blog:check`）

```bash
npm run blog:check                       # content/blog/ と drafts/ の全記事をチェック
npm run blog:check -- --slug my-article  # 1件だけチェック
npm run blog:check -- --skip-build       # buildとtscを省略して素早く確認（執筆中の途中確認向け）
```

チェック内容:

- frontmatterの不足・不正なcategory
- slugの重複（公開済み・下書きをまたいだ重複も検知）
- タイトルの完全一致・テーマの類似（地域名だけ置き換えた量産記事の検知）
- 存在しない内部リンク（LPアンカー・他記事slug）
- 存在しない画像ファイル（アイキャッチ`image`・本文中の画像）
- 古いVercel URL（`housecleaning-lp`）の混入
- LINE URLの誤り
- 未定義の `{{token}}`
- `npm run build` / `tsc --noEmit` のエラー

「エラー」は公開前に必ず解消してください。「警告」（テーマ類似度など）は自動ブロックしませんが、内容を見て地域名だけの量産記事になっていないか確認してください。

## ④ 公開フォルダへ移動する（`npm run blog:publish`）

```bash
npm run blog:publish -- <slug>
```

内部で `npm run blog:check -- --slug <slug>` を自動実行し、問題がなければ
`content/blog/drafts/<slug>.md` を `content/blog/<slug>.md` へ移動します。
**この操作自体はgitやVercelには一切触れません。** 移動後、ローカルで

```bash
npm run dev
```

を起動し、`http://localhost:3000/blog/<slug>/` を実際に開いて最終確認してください。

## ⑤ 本番公開する

内容に問題がなければ、自分の判断で以下を実行してください（このリポジトリの仕組みは代行しません）。

```bash
git add content/blog/<slug>.md
git commit -m "Add blog post: <slug>"
git push origin master
```

pushすると、Vercelが自動でビルド・デプロイします（既存のLPと同じ仕組みです）。

## ⑥ Google Search Console でインデックス登録をリクエストする（推奨）

公開後、Googleに早く見つけてもらうために以下を行うと効果的です。

1. [Google Search Console](https://search.google.com/search-console) に、`https://www.ouchimigaki.jp` を登録済みのプロパティで開く
2. 上部の検索ボックスに記事の完全なURL（例: `https://www.ouchimigaki.jp/blog/<slug>`）を入力する
3. 「URL検査」結果が表示されたら、「インデックス登録をリクエスト」をクリックする
4. 数分〜数十分ほど検証が行われます。完了すれば登録リクエストは受理されます（実際にインデックスされ検索結果に出るまでは別途時間がかかります）
5. サイトマップは `https://www.ouchimigaki.jp/sitemap.xml` に記事URLが自動で追加されるので、Search Console左メニューの「サイトマップ」に一度 `sitemap.xml` を登録しておくと、以後の新記事もGoogleに自動で伝わりやすくなります

---

## 運用ルール（重要）

- **記事生成 → 内容確認 → 人間が公開を承認 → commit/push** を必ず徹底してください。このリポジトリの仕組み自体は記事を自動で本番公開しません
- 料金・サービス内容・対応エリア・作業内容など、事実に関わる情報は上記の `{{token}}` 経由で
  `src/data/pricing.ts` / `src/data/services.ts` / `src/data/siteConfig.ts` にある情報のみを使用してください。存在しない金額や対応内容を作成しないでください
- 医療・健康上の効果を断定する表現（「アレルギーが治る」等）は使用しないでください。統計・研究結果・口コミなど根拠のない情報を創作しないでください
- 検索ボリューム等の数字を推測で断定しないでください（「月間◯◯回検索」等）
- 施工事例記事は、実際に提供された「施工地域・清掃箇所・Before/After写真・汚れの状態・作業内容」のみを使用して作成してください。存在しない施工内容や顧客情報を創作しないでください
- 地域名だけを入れ替えたほぼ同一内容の記事を量産しないでください。地域記事を作る場合は、その地域固有の情報（現地の施工事例、アクセス、地域特有の悩みなど）を含め、読者にとって独自の価値がある内容にしてください（`blog:new`/`blog:check` の類似度チェックが目安を教えてくれますが、最終判断は人間が行ってください）
- 文字数を稼ぐための冗長な文章、SEOのための固定文字数ルールは設定していません。検索意図を満たす長さを優先してください
- FAQ形式の内容を含める場合でも、`FAQPage` 構造化データの追加は慎重に判断してください。Googleの現在のガイドライン上、FAQPageのリッチリザルト表示は一部のサイトに限定されており、追加したからといって検索結果での表示が保証されるものではありません
