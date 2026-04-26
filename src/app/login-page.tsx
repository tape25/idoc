"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Building2, LockKeyhole, Mail, ArrowRight } from "lucide-react"

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
        // Laissons le loading overlay actif si c'est réussi jusqu'au rafraîchissement
        setTimeout(() => setLoading(false), 2000)
      } else {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden relative">
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

      {/* Left Side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-ivory-50 relative overflow-hidden flex-col items-center justify-center p-12 border-r border-gray-200/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-ivorange-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-ivgreen-500/5 blur-[120px] pointer-events-none"></div>

        {/* Header - moved down to avoid overlap with the back button from page.tsx */}
        <div className="absolute top-24 left-12 z-10 flex items-center gap-3">
          <div className="bg-ivgreen-50 p-3 rounded-2xl border border-ivgreen-100">
            <Building2 className="h-8 w-8 text-ivgreen-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">DRH <span className="text-ivorange-500">Sports</span></h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Côte d'Ivoire</p>
          </div>
        </div>

        {/* Main Illustration Container */}
        <div className="relative z-10 mt-16 w-full max-w-lg animate-in fade-in zoom-in-95 duration-1000">
          <div className="relative aspect-square w-full">
            <Image
              src="/illustration-login.png"
              alt="HR Professional Illustration"
              fill
              className="object-contain drop-shadow-2xl mix-blend-multiply"
              priority
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-12 left-12 z-10">
          <div className="glass px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
            <LockKeyhole className="h-4 w-4 text-ivgreen-600" />
            Portail ultra-sécurisé
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gray-50/50">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 mb-8 w-full max-w-md mt-16">
          <div className="bg-ivgreen-600 p-2.5 rounded-xl">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DRH Sports</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Côte d'Ivoire</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Bienvenue</h2>
            <p className="text-gray-500 font-medium">Connectez-vous à votre espace RH</p>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Mot de passe</Label>
                <a href="#" className="text-sm font-medium text-ivorange-600 hover:text-ivorange-700 transition-colors">Oublié ?</a>
              </div>
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
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-10 text-center border-t border-gray-100 pt-8">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="w-3 h-3 rounded-full bg-ivorange-500"></span>
              <span className="w-3 h-3 rounded-full bg-gray-200"></span>
              <span className="w-3 h-3 rounded-full bg-ivgreen-500"></span>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-[0.2em]">République de Côte d'Ivoire</p>
          </div>
        </div>
      </div>
    </div>
  )
}
