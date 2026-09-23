const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "/NITI-AI";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? repoName : "",
  assetPrefix: isGithubPages ? `${repoName}/` : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: isGithubPages,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  ...(isGithubPages
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Frame-Options", value: "DENY" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(self), geolocation=(self)",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
