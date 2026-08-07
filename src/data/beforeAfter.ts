import type { BeforeAfterItem } from "@/types";

/**
 * ビフォーアフター事例
 * ------------------------------------------------------------
 * 画像を差し替える場合は public/images/before-after/ に
 * jpg/png/webp を追加し、パスをここに記入してください。
 * （画像未設置の間はプレースホルダー画像が自動表示されます）
 *
 * 例:
 *   beforeImage: "/images/before-after/aircon-01-before.jpg",
 *   afterImage:  "/images/before-after/aircon-01-after.jpg",
 *
 * 表示は正方形にトリミングされます。被写体が中央からずれて見切れる
 * 場合は beforeObjectPosition / afterObjectPosition で
 * トリミング位置を調整できます（例: "30% center"）。
 * ------------------------------------------------------------
 */
export const beforeAfterItems: BeforeAfterItem[] = [
  {
    id: "case-1",
    title: "エアコン内部のカビ・ホコリ",
    service: "エアコンクリーニング",
    beforeImage: "/images/before-after/aircon-before-02.jpg",
    afterImage: "/images/before-after/aircon-after-02.jpg",
    comment: "分解洗浄で内部のカビ・ホコリを徹底除去しました。",
  },
  {
    id: "case-2",
    title: "レンジフードの油汚れ",
    service: "レンジフードクリーニング",
    beforeImage: "/images/before-after/rangehood-before-01.jpg",
    afterImage: "/images/before-after/rangehood-after-01.jpg",
    comment: "フード・フィルターを分解し、頑固な油汚れを徹底洗浄しました。",
    // 背景右端に私物が写り込むため、トリミング位置を左寄りに調整
    beforeObjectPosition: "30% center",
  },
  {
    id: "case-3",
    title: "浴室の水垢・蛇口まわり",
    service: "浴室クリーニング",
    beforeImage: "/images/before-after/bathroom-before-01.jpg",
    afterImage: "/images/before-after/bathroom-after-01.jpg",
    comment: "蛇口・水栓についた頑固な水垢をぴかぴかに磨き上げました。",
  },
];
