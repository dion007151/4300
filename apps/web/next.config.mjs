/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@4300/shared"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.lottiefiles.com" },
      { protocol: "https", hostname: "lottie.host" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
