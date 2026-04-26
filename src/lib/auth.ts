import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
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
  // PAS de PrismaAdapter avec CredentialsProvider + JWT
  // L'adapter est conçu pour OAuth, pas pour les credentials
  // On gère directement l'auth dans authorize()
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
          console.log("Auth: email ou mot de passe manquant")
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.log("Auth: utilisateur non trouvé -", credentials.email)
            return null
          }

          if (!user.actif) {
            console.log("Auth: utilisateur inactif -", credentials.email)
            return null
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordMatch) {
            console.log("Auth: mot de passe incorrect -", credentials.email)
            return null
          }

          console.log("Auth: connexion réussie -", credentials.email, "rôle:", user.role)

          return {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            role: user.role,
            matricule: user.matricule,
            service: user.service,
          }
        } catch (error) {
          console.error("Auth: erreur base de données -", error)
          return null
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
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.nom = token.nom as string
        session.user.prenom = token.prenom as string
        session.user.role = token.role as string
        session.user.matricule = token.matricule as string | null
        session.user.service = token.service as string | null
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === "development",
}
