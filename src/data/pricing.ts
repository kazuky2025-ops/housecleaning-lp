import type { PricingPlan, TravelFeeTier } from "@/types";

/**
 * エアコンクリーニングの料金プラン
 * ------------------------------------------------------------
 * エアコンクリーニングはメインサービスのため、料金表セクションで
 * 大きく分かりやすく表示します。price は税込想定の数値（円）です。
 * ------------------------------------------------------------
 */
export const airconPricing: PricingPlan[] = [
  {
    id: "aircon-normal",
    name: "通常壁掛けエアコン",
    price: 8000,
    unit: "1台あたり（税込）",
    description: "壁掛けタイプ・標準的なサイズのエアコンが対象です。",
    isPopular: true,
  },
  {
    id: "aircon-auto",
    name: "お掃除機能付きエアコン",
    price: 12000,
    unit: "1台あたり（税込）",
    description: "自動お掃除機能付きエアコンは分解工程が増えるため別料金です。",
  },
];

/** エアコンクリーニングのオプション */
export const airconOption: PricingPlan = {
  id: "outdoor-unit",
  name: "室外機洗浄",
  price: 2000,
  unit: "追加（税込）",
  description: "室外機まわりの汚れもまとめて洗浄します。",
};

/**
 * セット割引
 * ------------------------------------------------------------
 * 「水回り3点セット」は src/data/services.ts の同名サービスと同額（39,800円）です。
 * 金額を変更する場合は両方をあわせて更新してください。
 * ------------------------------------------------------------
 */
export const setDiscounts: PricingPlan[] = [
  {
    id: "set-aircon-bathroom",
    name: "エアコンクリーニング + 浴室クリーニング",
    price: 22000,
    priceNote: "通常合計 23,000円",
    unit: "セット価格（税込）",
    description: "エアコン1台＋浴室クリーニングのお得なセットです。",
    badge: "1,000円お得",
  },
  {
    id: "set-aircon-range-hood",
    name: "エアコンクリーニング + レンジフードクリーニング",
    price: 22000,
    priceNote: "通常合計 23,000円",
    unit: "セット価格（税込）",
    description: "エアコン1台＋レンジフードクリーニングのお得なセットです。",
    badge: "1,000円お得",
  },
  {
    id: "set-mizumawari",
    name: "水回り3点セット",
    price: 39800,
    priceNote: "通常合計 45,000円",
    unit: "セット価格（税込）",
    description: "浴室・レンジフード・トイレの3箇所をまとめてお得に。",
    badge: "5,200円お得",
  },
];

/** 対応エリアの交通費（距離帯別） */
export const travelFees: TravelFeeTier[] = [
  { range: "15km以内", price: 0 },
  { range: "15〜30km", price: 500 },
  { range: "30〜50km", price: 1000 },
  { range: "50km以上", price: 2000 },
];

/** 交通費の算出基準に関する注記 */
export const travelFeeNote = "Googleマップの走行距離を基準に算出します。";

/** 駐車料金に関する説明 */
export const parkingNote =
  "駐車スペースがない場合は、近隣コインパーキング料金を実費でご負担いただきます。";

/** 安心ポイント */
export const trustPoints: string[] = [
  "お見積り無料",
  "追加料金なし（作業内容変更時を除く）",
  "損害保険加入済み",
  "インボイス対応",
  "LINEで24時間受付",
];

/** 料金表の注記（表示価格の前提条件など） */
export const pricingNotes: string[] = [
  "表示価格はすべて税込です。",
  "特殊な機種や特殊作業が必要な場合は、事前にご説明いたします。",
];
