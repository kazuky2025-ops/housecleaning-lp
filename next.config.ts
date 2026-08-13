import type { NextConfig } from "next";

/**
 * 旧Vercelドメイン。独自ドメイン移行前にGoogleへインデックスされてしまったため、
 * このホストへのアクセスは全パス・全クエリを維持したまま独自ドメインへ308リダイレクトする。
 * ホスト名の完全一致判定のため、Vercel Preview Deployment（別ホスト名）やlocalhostには影響しない。
 * 独自ドメインの値は src/data/siteConfig.ts の siteUrl と一致させること。
 */
const LEGACY_VERCEL_HOST = "housecleaning-lp.vercel.app";
const CANONICAL_ORIGIN = "https://www.ouchimigaki.jp";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: LEGACY_VERCEL_HOST }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
