import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Missing credentials.");
        }

        const { email, password } = credentials;

        await dbConnect();
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
          throw new Error("Invalid email or email not registered.");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password.");
        }
        if (email.toLowerCase() === "admin@gmail.com") {
          user.isAdmin = true;
          await user.save(); 
        }

        // Check if the user is an admin
        return { id: user._id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.isAdmin = user.isAdmin; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        fullName: token.fullName,
        isAdmin: token.isAdmin,
      };
      return session;
    },
  },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
