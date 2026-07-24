/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@4300/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.lottiefiles.com" },
      { protocol: "https", hostname: "lottie.host" },
      // GitHub OAuth avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Google OAuth avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ]
  }
};

export default nextConfig;
