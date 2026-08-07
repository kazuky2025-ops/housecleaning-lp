import type { ServiceItem } from "@/types";

/**
 * サービス一覧
 * ------------------------------------------------------------
 * エアコンクリーニング（isMain: true）は③セクションで料金を大きく表示します。
 * それ以外のサービス（ハウスクリーニング）は⑤セクションのアコーディオンに
 * price・workContent・duration が表示されます。新しいサービスを追加する場合は
 * 配列に1件追加するだけでOKです。
 *
 * 「水回り3点セット」の料金は、③セクションの「セット割」表示
 * （src/data/pricing.ts の setDiscounts）にも同額で登場します。
 * 金額を変更する場合は両方をあわせて更新してください。
 * ------------------------------------------------------------
 */
export const services: ServiceItem[] = [
  {
    slug: "aircon",
    name: "エアコンクリーニング",
    shortDescription: "内部の徹底洗浄でカビ・ホコリ・ニオイをすっきり",
    description:
      "分解・高圧洗浄でエアコン内部の汚れを徹底除去。カビやホコリによるニオイ・アレルギーが気になる方、冷暖房効率を取り戻したい方におすすめです。",
    icon: "wind",
    isMain: true,
  },
  {
    slug: "bathroom",
    name: "浴室クリーニング",
    shortDescription: "カビ・水垢・皮脂汚れを隅々まで",
    description:
      "浴槽・床・壁・排水口まで、カビや水垢、皮脂汚れを専用洗剤と道具で徹底洗浄します。",
    icon: "bath",
    isMain: false,
    price: 15000,
    workContent: [
      "浴槽・床・壁のカビ・水垢除去",
      "排水口・鏡・蛇口まわりの洗浄",
      "仕上げの拭き上げ",
    ],
    duration: "約1〜1.5時間",
  },
  {
    slug: "range-hood",
    name: "レンジフードクリーニング",
    shortDescription: "頑固な油汚れをすっきり分解洗浄",
    description:
      "自分では落としきれないレンジフード・換気扇の油汚れを、分解洗浄で新品のようにきれいにします。",
    icon: "home",
    isMain: false,
    price: 15000,
    workContent: [
      "フード・ファン・フィルターの分解洗浄",
      "頑固な油汚れの徹底除去",
      "動作確認のうえ組み立て",
    ],
    duration: "約1.5〜2時間",
  },
  {
    slug: "toilet",
    name: "トイレクリーニング",
    shortDescription: "見えない部分まで除菌・洗浄",
    description:
      "便器の裏側や床との境目など、見えにくい部分まで除菌・洗浄し、清潔な空間に仕上げます。",
    icon: "toilet",
    isMain: false,
    price: 15000,
    workContent: [
      "便器・タンク内外の洗浄・除菌",
      "床・壁・換気扇の清掃",
      "仕上げの拭き上げ",
    ],
    duration: "約30分〜1時間",
  },
  {
    slug: "mizumawari-set",
    name: "水回り3点セット",
    shortDescription: "浴室・レンジフード・トイレをまとめてお得に",
    description:
      "浴室・レンジフード・トイレの3箇所をまとめてご依頼いただけるお得なセットです。個別にご依頼いただくより経済的にご利用いただけます。",
    icon: "droplet",
    isMain: false,
    price: 39800,
    workContent: [
      "浴室：浴槽・床・壁のカビ・水垢除去",
      "レンジフード：フード・ファン・フィルターの分解洗浄",
      "トイレ：便器・タンク内外の洗浄・除菌",
    ],
    duration: "約3.5〜4.5時間",
  },
];
