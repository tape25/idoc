"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden relative">
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

      {/* Left Side - Brand & Graphics */}
      <div className="hidden md:flex md:w-1/2 bg-ivgreen-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-ivorange-500/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-ivgreen-500/40 blur-[120px]" />
        
        {/* Subtle Flag Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(to right, #F77F00 33%, #FFFFFF 33%, #FFFFFF 66%, #009E60 66%)' }}>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
            <Building2 className="h-8 w-8 text-ivorange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DRH Sports</h1>
            <p className="text-sm text-ivgreen-200 uppercase tracking-widest font-semibold">Côte d'Ivoire</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Portail <br/><span className="text-ivorange-400">Agent</span>
          </h2>
          <p className="text-lg text-ivgreen-100 leading-relaxed font-medium">
            Accédez à vos services RH en ligne. Déposez, suivez et gérez vos actes administratifs en toute sécurité.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-sm font-medium text-ivgreen-200/80">
          <LockKeyhole className="h-4 w-4" />
          Accès restreint au personnel autorisé
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 mb-12">
          <div className="bg-ivgreen-600 p-2.5 rounded-xl">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DRH Sports</h1>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Bienvenue</h2>
            <p className="text-gray-500 font-medium">Veuillez vous identifier pour continuer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {seedError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Erreur base de données : {seedError}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800 animate-in shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@sports.gouv.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-ivorange-500 focus:ring-ivorange-500/20 transition-all bg-gray-50/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Mot de passe</Label>
                <a href="#" className="text-sm font-medium text-ivorange-600 hover:text-ivorange-700">Oublié ?</a>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-ivorange-500 focus:ring-ivorange-500/20 transition-all bg-gray-50/50"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-ivgreen-600 hover:bg-ivgreen-700 text-white font-semibold text-lg shadow-lg shadow-ivgreen-600/20 transition-all hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="w-3 h-3 rounded-full bg-ivorange-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-gray-200"></span>
              <span className="w-3 h-3 rounded-full bg-ivgreen-500/80"></span>
            </div>
            <p className="text-xs text-gray-500 mt-4 font-medium uppercase tracking-widest">République de Côte d'Ivoire</p>
          </div>
        </div>
      </div>
    </div>
  )
}
