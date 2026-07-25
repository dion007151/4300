import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-google-client-secret",
  }),
  Credentials({
    id: "credentials",
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      name: { label: "Name", type: "text" },
      image: { label: "Image", type: "text" },
    },
    async authorize(credentials) {
      const email = (credentials?.email as string) || "user@4300.to";
      const name = (credentials?.name as string) || "4300 User";
      const image = (credentials?.image as string) || null;
      return {
        id: email,
        email,
        name,
        image,
      };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/", error: "/" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET ?? "4300-dev-secret",
});
