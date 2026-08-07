export type ServiceItem = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: IconName;
  /** true はエアコンクリーニング（メインサービス）のみ */
  isMain: boolean;
  /** メイン以外のサービスで使用。料金アコーディオンに表示 */
  price?: number;
  /** メイン以外のサービスで使用。作業内容の箇条書き */
  workContent?: string[];
  /** メイン以外のサービスで使用。作業時間の目安 */
  duration?: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  priceNote?: string;
  unit: string;
  description?: string;
  isPopular?: boolean;
  /** セット割等で「◯◯円お得」のように見せたい場合の訴求バッジ */
  badge?: string;
  /** 注意書き（description よりさらに小さく・控えめに表示） */
  caveat?: string;
};

/** 距離帯ごとの交通費 */
export type TravelFeeTier = {
  range: string;
  price: number;
};

export type Reason = {
  title: string;
  description: string;
  icon: IconName;
  /** true の場合、ナチュラルカラーで特別な項目として強調表示します */
  highlight?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  attribute: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  service: string;
  date: string;
};

export type BeforeAfterItem = {
  id: string;
  title: string;
  service: string;
  beforeImage: string;
  afterImage: string;
  comment?: string;
  /** 正方形トリミング時に被写体の見切れを防ぎたい場合の位置指定（例: "30% center"） */
  beforeObjectPosition?: string;
  afterObjectPosition?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type IconName =
  | "sparkles"
  | "shield"
  | "clock"
  | "yen"
  | "leaf"
  | "wind"
  | "droplet"
  | "home"
  | "toilet"
  | "bath"
  | "line"
  | "helper"
  | "check"
  | "calendar"
  | "map"
  | "star"
  | "search"
  | "clipboard"
  | "spray"
  | "chat"
  | "car"
  | "chevronDown";
