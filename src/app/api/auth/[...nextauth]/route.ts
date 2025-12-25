import NextAuth, { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser } from "@/app/example/_lib/biodb";

export const runtime = "nodejs";
const authOptions: AuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { username, password } = credentials;


        // Verify user using the existing biodb utility
        const user = await verifyUser(username, password);
        if (user) {
          return { id: user.id.toString(), name: user.username }; // Convert id to string
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const, // Explicitly set the type to 'jwt'
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      if (user) {
        token.id = user.id;
        token.name = user.name; // Added name field
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = { id: token.id, name: token.name }; // Removed email field
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };