import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/siteConfig";
import { getPostBySlug } from "@/lib/blog";

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

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? siteConfig.brandName;
  const subtitle = post?.category ?? "お役立ち記事";
  const fontData = await loadGoogleFont(`${title}${subtitle}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #123c40 0%, #0a2528 100%)",
          padding: "80px",
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
            fontSize: 26,
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.08em",
            marginBottom: 24,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.35,
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 28,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {siteConfig.brandName}
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
