"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react"

export function LoginPage({ seedError }: { seedError?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
        setLoading(false)
      } else {
        router.refresh()
      }
    } catch {
      setError("Une erreur s'est produite")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f4] surface-grid px-4 py-6 sm:px-6 lg:px-8">
      {loading && !error && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ivgreen-900/95 text-white animate-in fade-in duration-300">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
            <Loader2 className="h-9 w-9 animate-spin text-ivorange-300" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Authentification...</h2>
          <p className="mt-2 text-center text-sm font-medium text-ivgreen-100">Préparation de votre espace sécurisé</p>
        </div>
      )}

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-ivgreen-900 p-10 text-white lg:flex">
            <Image
              src="/illustration-login.png"
              alt="Portail RH numérique"
              fill
              className="object-cover opacity-35 mix-blend-screen"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,43,25,0.98)_0%,rgba(0,74,44,0.92)_45%,rgba(247,127,0,0.45)_100%)]" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-lg">
                <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={38} height={38} className="rounded-md" />
                <Image src="/images/logo-ministere-sports.png" alt="Ministère des Sports" width={38} height={38} className="rounded-md" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-ivorange-200">DSI</p>
                <p className="text-xs font-medium text-white/75">Ministère des Sports</p>
              </div>
            </div>

            <div className="relative z-10 max-w-lg">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/90">
                <ShieldCheck className="h-4 w-4 text-ivorange-200" />
                Accès professionnel sécurisé
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
                Un espace clair pour piloter vos démarches RH.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/78">
                Suivi des demandes, validations et notifications réunis dans une interface conçue pour l'administration.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3">
              {[
                ["24/7", "Disponible"],
                ["100%", "Numérique"],
                ["DSI", "Sécurisé"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={34} height={34} className="rounded-md" />
                <Image src="/images/logo-ministere-sports.png" alt="Ministère des Sports" width={34} height={34} className="rounded-md" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-950">Portail DSI RH</p>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Ministère des Sports</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ivorange-600">Connexion</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">Bon retour parmi nous</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
                Connectez-vous pour accéder à votre espace de travail DSI.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {seedError && (
                <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="break-words">Erreur base de données : {seedError}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50 text-red-800 animate-in shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-gray-800">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="agent@sports.gouv.ci"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-[52px] rounded-lg border-gray-200 bg-gray-50 pl-12 text-base shadow-inner shadow-gray-100/60 transition-all hover:bg-white focus:border-ivgreen-600 focus:bg-white focus:ring-ivgreen-600/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold text-gray-800">Mot de passe</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-[52px] rounded-lg border-gray-200 bg-gray-50 pl-12 pr-12 text-base shadow-inner shadow-gray-100/60 transition-all hover:bg-white focus:border-ivgreen-600 focus:bg-white focus:ring-ivgreen-600/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-sm font-semibold text-ivorange-600 transition-colors hover:text-ivorange-700">Mot de passe oublié ?</a>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-3 h-[52px] w-full rounded-lg bg-ivgreen-700 text-base font-bold text-white shadow-lg shadow-ivgreen-900/15 transition-all hover:-translate-y-0.5 hover:bg-ivgreen-800"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Connexion sécurisée
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 border-t border-gray-100 pt-5 text-xs font-medium leading-5 text-gray-500">
              Accès réservé aux agents habilités du Ministère des Sports.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
