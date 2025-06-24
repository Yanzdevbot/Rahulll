import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";

export default NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,   
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();
                const user = await User.findOne({ email: credentials.email });

                if (!user) throw new Error("Email tidak ditemukan");
                const match = await bcrypt.compare(credentials.password, user.password);
                if (!match) throw new Error("Password salah");

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export const authOptions = NextAuth;