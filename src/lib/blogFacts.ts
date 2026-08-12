import {
  airconPricing,
  airconOption,
  detergentOption,
  travelFeeNote,
  parkingNote,
} from "@/data/pricing";
import { services } from "@/data/services";
import { siteConfig } from "@/data/siteConfig";

function yen(amount: number): string {
  return `${amount.toLocaleString()}円`;
}

function priceOf(slug: string): number {
  const service = services.find((item) => item.slug === slug);
  if (!service || service.price === undefined) {
    throw new Error(`src/data/services.ts に slug="${slug}" の price が見つかりません`);
  }
  return service.price;
}

/**
 * ブログ本文の `{{token}}` から参照できる自社データの一覧。
 * すべて src/data/pricing.ts・src/data/services.ts・src/data/siteConfig.ts から
 * 導出しているため、料金や対応エリアを変更してもここを直す必要はなく、
 * 記事側の表示も自動的に最新の値になります。
 *
 * 新しいトークンを追加した場合は content/blog/README.md の一覧にも追記してください。
 */
export const blogFacts: Record<string, string> = {
  "pricing.aircon.normal": yen(airconPricing[0].price),
  "pricing.aircon.autoClean": yen(airconPricing[1].price),
  "pricing.aircon.outdoorUnit": yen(airconOption.price),
  "pricing.bathroom": yen(priceOf("bathroom")),
  "pricing.rangeHood": yen(priceOf("range-hood")),
  "pricing.toilet": yen(priceOf("toilet")),
  "pricing.mizumawariSet": yen(priceOf("mizumawari-set")),
  "pricing.detergentOption": yen(detergentOption.price),
  "pricing.travelFeeNote": travelFeeNote,
  "pricing.parkingNote": parkingNote,
  "area.coverage": siteConfig.areaCoverage,
  "area.note": siteConfig.areaNote,
  "area.servedCities": siteConfig.servedAreas.join("・"),
  "contact.replyHours": siteConfig.replyHours,
  "contact.holiday": siteConfig.holiday,
  "brand.name": siteConfig.brandName,
};

const TOKEN_PATTERN = /\{\{([a-zA-Z0-9_.]+)\}\}/g;

/** 本文中に存在するが blogFacts に定義されていないトークン名を返します（空なら問題なし） */
export function findUnknownTokens(markdown: string): string[] {
  const unknown = new Set<string>();
  for (const match of markdown.matchAll(TOKEN_PATTERN)) {
    const token = match[1];
    if (!(token in blogFacts)) unknown.add(token);
  }
  return [...unknown];
}

/**
 * 本文中の `{{token}}` を実データに置換します。
 * 未定義のトークンが残っている場合は、誤字に気づかず本番公開されることを
 * 防ぐため例外を投げます（ビルドが失敗する形で検知されます）。
 */
export function applyBlogFacts(markdown: string): string {
  const unknown = findUnknownTokens(markdown);
  if (unknown.length > 0) {
    throw new Error(
      `未定義のトークンが使われています: ${unknown.map((t) => `{{${t}}}`).join(", ")}（src/lib/blogFacts.ts の blogFacts を確認してください）`
    );
  }
  return markdown.replace(TOKEN_PATTERN, (_, token: string) => blogFacts[token]);
}
