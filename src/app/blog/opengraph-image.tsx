import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/siteConfig";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(text: string) {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(
    text
  )}`;

  try {
    const css = await (await fetch(url)).text();
    const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
    if (match) {
      const fontResponse = await fetch(match[1]);
      if (fontResponse.ok) {
        return await fontResponse.arrayBuffer();
      }
    }
  } catch {
    // フォント取得に失敗しても画像生成自体は継続する
  }
  return null;
}

export default async function Image() {
  const title = "お役立ち記事";
  const subtitle = siteConfig.brandName;
  const fontData = await loadGoogleFont(`${title}${subtitle}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #123c40 0%, #0a2528 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(184,146,90,0.35)",
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Noto Sans JP", data: fontData, style: "normal", weight: 700 }]
        : undefined,
    }
  );
}
