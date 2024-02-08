import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import { checkPassword } from "@/server/password";

const SignInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["USER", "CANTEEN", "ADMIN"]),
});

export const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        const { email, password, role } = SignInSchema.parse(credentials);
        const userWithPassword = await prisma.user.findFirst({
          where: {
            email,
            role,
          },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
          },
        });
        if (userWithPassword) {
          const match = await checkPassword(
            password,
            userWithPassword.password
          );
          if (!match) {
            throw new Error("Invalid Credentials");
          }
          const user = {
            id: userWithPassword.id,
            name: userWithPassword.name,
            email: userWithPassword.email,
            role: userWithPassword.role,
          };
          return user as User;
        } else {
          throw new Error("Invalid Credentials");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.role = token.role;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin",
  },
};
