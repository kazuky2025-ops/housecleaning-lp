import { readFile } from "node:fs/promises";
import path from "node:path";
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

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

/** 記事にアイキャッチ画像が設定されている場合のみ、public配下から読み込んでdata URIにします */
async function loadArticlePhoto(imagePath: string | undefined): Promise<string | null> {
  if (!imagePath) return null;
  const ext = path.extname(imagePath).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) return null;

  try {
    const filePath = path.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
    const bytes = await readFile(filePath);
    return `data:${mime};base64,${bytes.toString("base64")}`;
  } catch {
    // 画像が読めない場合は失敗させず、従来のグラデーション生成にフォールバックする
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? siteConfig.brandName;
  const subtitle = post?.category ?? "お役立ち記事";
  const fontData = await loadGoogleFont(`${title}${subtitle}${siteConfig.brandName}`);
  const photoDataUri = await loadArticlePhoto(post?.image);

  // アイキャッチ画像が設定されている記事は、その写真を背景に使ったOGP画像を生成する
  if (photoDataUri) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoDataUri}
            width={size.width}
            height={size.height}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(0deg, rgba(10,37,40,0.88) 0%, rgba(10,37,40,0.25) 55%, rgba(10,37,40,0.15) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              bottom: 60,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "0.06em",
                marginBottom: 16,
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 48,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.35,
              }}
            >
              {title}
            </div>
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

  // アイキャッチ画像が未設定の記事は、従来どおりブランドカラーのグラデーション生成
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
