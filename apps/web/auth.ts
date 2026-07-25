import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

// In-memory OTP store (dev only — in production use Redis/DB)
// Exported so the API route can write to it
export const otpStore = new Map<string, { code: string; expires: number; name?: string }>();

// Only register OAuth providers when credentials are present in env
const oauthProviders = [
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })]
    : []),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? [GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...oauthProviders,
    // Email OTP — always available, no credentials required
    Credentials({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code:  { label: "Code",  type: "text"  },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const code  = credentials?.code  as string;
        if (!email || !code) return null;

        const record = otpStore.get(email.toLowerCase());
        if (!record) return null;
        if (Date.now() > record.expires) { otpStore.delete(email.toLowerCase()); return null; }
        if (record.code !== code.trim()) return null;

        otpStore.delete(email.toLowerCase()); // one-time use
        return {
          id: email,
          email,
          name: record.name ?? email.split("@")[0],
          image: null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/", error: "/" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email   = user.email;
        token.name    = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name  = token.name  as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET ?? "4300-dev-secret",
});
