import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // these are fn's that fire out during diff parts of the auth timeline that next-auth performs when a user is signing in and the callbacks are dependant on the type of auth we are doing in our app

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    // session callback is called whenever a session is checked
    // whenever a user signs in using next-auth
    async session({ session, token, user }) {
      // the user object above is the user object that next-auth is going to pull form the db
      // here we're returning the session and we're also returning a blend of the user from the db (user) and the user from the next-auth login (session.user)
      const sessionUser = { ...session.user, ...user };

      return Promise.resolve({
        ...session,
        user: sessionUser,
      });
    },
  },
});
