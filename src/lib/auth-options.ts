import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

const secret = process.env.NEXTAUTH_SECRET;
if (!secret?.trim()) {
  throw new Error(
    "NEXTAUTH_SECRET is not set. Add it to .env (e.g. run: openssl rand -base64 32)",
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });
        if (!user || !user.passwordHash) return null;
        // bcrypt hash must be 60 chars, format $2a$10$ or $2b$10$ then salt+hash
        const hash = user.passwordHash.trim();
        if (hash.length !== 60 || !/^\$2[ab]\$10\$/.test(hash)) return null;
        let passwordMatches: boolean;
        try {
          passwordMatches = await compare(credentials.password, hash);
        } catch {
          return null; // malformed hash
        }
        if (!passwordMatches) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = (token.email as string) ?? "";
        session.user.name = (token.name as string) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret,
  useSecureCookies: process.env.NODE_ENV === "production",
};
