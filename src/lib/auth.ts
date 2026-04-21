import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      nom: string
      prenom: string
      role: string
      matricule?: string | null
      service?: string | null
    }
  }
  interface User {
    id: string
    email: string
    nom: string
    prenom: string
    role: string
    matricule?: string | null
    service?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    nom: string
    prenom: string
    role: string
    matricule?: string | null
    service?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.actif) {
          return null
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          matricule: user.matricule,
          service: user.service,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.nom = user.nom
        token.prenom = user.prenom
        token.role = user.role
        token.matricule = user.matricule
        token.service = user.service
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.nom = token.nom
        session.user.prenom = token.prenom
        session.user.role = token.role
        session.user.matricule = token.matricule
        session.user.service = token.service
      }
      return session
    }
  }
}
