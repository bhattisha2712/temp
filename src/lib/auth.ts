import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");
        const isValid = await compare(credentials?.password || "", user.password);
        if (!isValid) throw new Error("Invalid password");
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");
        
        // For OAuth accounts
        if (account?.provider !== "credentials") {
          const existing = await users.findOne({ email: user.email });
          if (existing && !existing.oauthProvider) {
            // Optional: update user record to indicate OAuth linkage
            await users.updateOne(
              { _id: existing._id },
              { $set: { oauthProvider: account?.provider } }
            );
            user.id = existing._id.toString();
            return true;
          }
          if (!existing) {
            // Create new record for OAuth user
            await users.insertOne({
              email: user.email,
              name: user.name,
              oauthProvider: account?.provider,
              role: "user",
              createdAt: new Date(),
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Database error during sign in:", error);
        // Allow sign in to continue even if database is unavailable
        // This prevents the app from completely breaking
        console.warn("Continuing sign in without database connection");
        return true;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Refresh session every 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  // Production Security Configuration
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: true,
  //     },
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET,
};
