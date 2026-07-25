/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@4300/shared"],

  // Vercel-optimized output
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.lottiefiles.com" },
      { protocol: "https", hostname: "lottie.host" },
      // GitHub OAuth avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Google OAuth avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
    // Allow unoptimized local PNGs in dev
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Security headers for production
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
