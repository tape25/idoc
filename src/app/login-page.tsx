"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { AlertCircle, Loader2, LockKeyhole, Mail, ArrowRight } from "lucide-react"

export function LoginPage({ seedError }: { seedError?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      } else {
        router.refresh()
      }
    } catch {
      setError("Une erreur s'est produite")
    } finally {
      if (!error) {
        setTimeout(() => setLoading(false), 2000)
      } else {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative p-4">
      {/* Loading Overlay */}
      {loading && !error && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ivgreen-900/90 backdrop-blur-md text-white animate-in fade-in duration-300">
          <div className="relative">
            <div className="absolute -inset-4 bg-ivorange-500/30 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="h-16 w-16 animate-spin text-ivorange-500 relative z-10" />
          </div>
          <h2 className="text-3xl font-bold mt-8 mb-2 tracking-tight">Authentification...</h2>
          <p className="text-ivgreen-200 font-medium">Préparation de votre espace de travail sécurisé</p>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-ivorange-500/5 blur-[120px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-ivgreen-500/5 blur-[120px] pointer-events-none animate-float-delayed"></div>

      {/* Form Container */}
      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="bg-gradient-to-br from-ivgreen-500 to-ivgreen-700 p-2 rounded-2xl shadow-lg shadow-ivgreen-500/20">
            <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={48} height={48} className="rounded-xl" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">DRH <span className="text-ivorange-500">Sports</span></h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Côte d'Ivoire</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Bon retour parmi nous</h2>
            <p className="text-gray-500 text-sm font-medium">Connectez-vous pour accéder à votre espace RH</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {seedError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800 rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Erreur base de données : {seedError}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800 animate-in shake rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@sports.gouv.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 h-14 rounded-xl border-gray-200 focus:border-ivorange-500 focus:ring-ivorange-500/20 transition-all bg-gray-50/50 hover:bg-white text-base"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Mot de passe</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 h-14 rounded-xl border-gray-200 focus:border-ivorange-500 focus:ring-ivorange-500/20 transition-all bg-gray-50/50 hover:bg-white text-base"
                />
              </div>
              <div className="flex justify-end pt-1">
                <a href="#" className="text-sm font-medium text-ivorange-600 hover:text-ivorange-700 transition-colors">Mot de passe oublié ?</a>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 mt-4 rounded-xl bg-gradient-to-r from-ivgreen-600 to-ivgreen-700 hover:from-ivgreen-700 hover:to-ivgreen-800 text-white font-semibold text-lg shadow-lg shadow-ivgreen-600/25 transition-all hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Connexion sécurisée
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
