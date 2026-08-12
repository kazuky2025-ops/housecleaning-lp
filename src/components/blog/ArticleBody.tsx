/**
 * Markdownを変換したHTMLを、ブランドのトーン（余白・フォント・色）に
 * 合わせて表示するための記事本文コンポーネント。
 * Tailwindのプラグインを追加せず、子要素セレクタで最小限のスタイルを当てています。
 */
export default function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className={[
        "text-ink-soft leading-relaxed",
        "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink sm:[&_h2]:text-2xl",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink",
        "[&_p]:mt-4 [&_p]:text-sm sm:[&_p]:text-base",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-sm sm:[&_ul]:text-base",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:text-sm sm:[&_ol]:text-base",
        "[&_li]:leading-relaxed",
        "[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-dark",
        "[&_strong]:text-ink [&_strong]:font-bold",
        "[&_blockquote]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-brand/30 [&_blockquote]:pl-4 [&_blockquote]:text-ink-soft/90 [&_blockquote]:italic",
        "[&_hr]:my-8 [&_hr]:border-border",
        "[&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border [&_th]:border-border [&_th]:bg-mist [&_th]:px-3 [&_th]:py-2 [&_th]:text-left",
        "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
        "[&_code]:rounded [&_code]:bg-mist [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]",
        "first:[&>*]:mt-0",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
