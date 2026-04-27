"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ShieldCheck, FileText, ArrowRight, Zap, Globe, CheckCircle2, Clock, Users, LockKeyhole, Bell, CheckSquare } from "lucide-react"

export function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  const marqueeItems = [
    "✦ 100% Dématérialisé",
    "✦ Sécurité Maximale",
    "✦ Validation Hiérarchique",
    "✦ Suivi en Temps Réel",
    "✦ Signature Électronique",
    "✦ Portail Disponible 24/7",
    "✦ Zéro Papier"
  ]

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 overflow-hidden relative selection:bg-ivorange-500 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-ivorange-400/20 to-transparent blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-ivgreen-400/20 to-transparent blur-[120px] animate-float-delayed pointer-events-none" />
      
      {/* Header */}
      <header className="glass sticky top-0 z-50 w-full border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-ivgreen-500 to-ivgreen-700 p-1.5 rounded-xl shadow-lg shadow-ivgreen-500/30">
              <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={36} height={36} className="rounded-md" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">DRH <span className="text-ivorange-500">Sports</span></h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Côte d'Ivoire</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onLoginClick} className="hidden sm:flex text-gray-600 hover:text-ivorange-600 hover:bg-ivorange-50 rounded-full px-6 font-semibold">
              Espace Agent
            </Button>
            <Button onClick={onLoginClick} className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 shadow-lg shadow-gray-900/20 transition-all hover:-translate-y-0.5">
              Se connecter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Infinite Marquee Section - News Ticker Style */}
      <div className="bg-ivgreen-900/95 backdrop-blur-md border-b border-ivgreen-800 overflow-hidden relative py-2 z-40">
        <div className="flex w-fit animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={index} className="flex items-center px-6 text-ivgreen-50 whitespace-nowrap font-medium text-xs tracking-wider uppercase">
              <span className={item.includes("✦") ? "text-ivorange-400 mr-1" : ""}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1">
        {/* Asymmetrical Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-ivorange-200 text-ivorange-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-ivorange-500 animate-pulse"></span>
                Portail Administratif Nouvelle Génération
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                L'excellence RH, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-ivorange-500 via-ivorange-400 to-ivgreen-500">à portée de clic.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both font-medium">
                Accélérez vos démarches administratives. Une plateforme unifiée et sécurisée dédiée aux agents du Ministère des Sports de Côte d'Ivoire.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
                <Button onClick={onLoginClick} size="lg" className="w-full sm:w-auto bg-ivorange-500 hover:bg-ivorange-600 text-white rounded-full px-8 h-14 text-lg font-semibold shadow-xl shadow-ivorange-500/30 transition-all hover:-translate-y-1">
                  Accéder à mon espace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-lg font-semibold border-gray-200 text-gray-700 hover:bg-white hover:border-ivgreen-200 hover:text-ivgreen-700 glass transition-all">
                      Guide d'utilisation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[85vh] overflow-y-auto bg-white border-ivgreen-100 shadow-2xl p-6 sm:p-8 rounded-[2rem] custom-scrollbar">
                    <DialogHeader className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-4 border-b border-gray-100/50 mb-2">
                      <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="bg-ivorange-100 p-2 rounded-xl shrink-0">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-ivorange-600" />
                        </div>
                        Guide d'utilisation
                      </DialogTitle>
                      <DialogDescription className="text-gray-500 mt-2 text-sm sm:text-base">
                        Naviguez et utilisez le portail DRH Sports en 4 étapes simples.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-8 py-6">
                      <div className="flex gap-4">
                        <div className="bg-gray-50 p-3 rounded-full h-fit border border-gray-100">
                          <LockKeyhole className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">1. Connexion Sécurisée</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">Utilisez votre adresse email professionnelle <span className="font-semibold">(ex: agent@sports.gouv.ci)</span> et votre mot de passe pour accéder à votre espace personnel de manière totalement sécurisée.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="bg-ivgreen-50 p-3 rounded-full h-fit border border-ivgreen-100">
                          <FileText className="h-5 w-5 text-ivgreen-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">2. Soumission d'une Demande</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">Depuis votre tableau de bord, cliquez sur <span className="font-semibold text-ivgreen-700">"Nouvelle Demande"</span>. Remplissez le formulaire numérique et joignez les pièces justificatives requises. C'est 100% sans papier.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="bg-ivorange-50 p-3 rounded-full h-fit border border-ivorange-100">
                          <Bell className="h-5 w-5 text-ivorange-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">3. Suivi et Notifications</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">Suivez l'avancement de votre dossier en temps réel. Vous recevrez des alertes à chaque étape de validation par la hiérarchie.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="bg-blue-50 p-3 rounded-full h-fit border border-blue-100">
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">4. Décision Finale</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">Une fois votre demande approuvée, vous pourrez télécharger directement vos actes administratifs (attestations, décisions) depuis la plateforme.</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Right Abstract Mockup */}
            <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
              <div className="absolute inset-0 bg-gradient-to-tr from-ivorange-500/20 to-ivgreen-500/20 rounded-[3rem] blur-3xl transform rotate-3 scale-105"></div>
              
              <div className="relative glass-card rounded-[2rem] border border-white/60 shadow-2xl p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                {/* Mockup Header */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="h-4 w-32 bg-gray-100 rounded-full"></div>
                </div>
                
                {/* Mockup Content Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 mb-3"></div>
                    <div className="h-2 w-16 bg-blue-200 rounded-full mb-2"></div>
                    <div className="h-4 w-12 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="bg-ivorange-50/50 rounded-2xl p-4 border border-ivorange-100/50">
                    <div className="w-8 h-8 rounded-full bg-ivorange-100 mb-3"></div>
                    <div className="h-2 w-16 bg-ivorange-200 rounded-full mb-2"></div>
                    <div className="h-4 w-12 bg-ivorange-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-3 w-24 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-16 bg-ivgreen-100 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
                
                {/* Floating Abstract Element */}
                <div className="absolute -right-8 -bottom-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-float-delayed flex items-center gap-3">
                  <div className="bg-ivgreen-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-ivgreen-600" />
                  </div>
                  <div>
                    <div className="h-2 w-16 bg-gray-200 rounded-full mb-1"></div>
                    <div className="h-3 w-20 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Smart Bento Grid Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Conçu pour l'efficacité absolue</h2>
            <p className="text-gray-500 text-lg">Chaque fonctionnalité a été pensée pour réduire les délais administratifs et simplifier le quotidien des agents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
            {/* Bento Card 1 - Large */}
            <div className="glass-card rounded-[2rem] p-8 md:col-span-2 md:row-span-2 group relative overflow-hidden flex flex-col justify-end border-white/60">
              <div className="absolute top-0 right-0 w-64 h-64 bg-ivorange-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="absolute top-8 right-8 bg-ivorange-100/50 p-4 rounded-2xl backdrop-blur-md border border-white/50">
                <Zap className="h-10 w-10 text-ivorange-600" />
              </div>
              <div className="relative z-10">
                <Badge className="bg-ivorange-100 text-ivorange-700 hover:bg-ivorange-200 border-none mb-4 px-3 py-1">Circuit Ultra-Rapide</Badge>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Traitement Accéléré</h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                  Vos demandes de congés, permissions et attestations sont transmises instantanément à la hiérarchie. Finis les dossiers égarés.
                </p>
              </div>
            </div>

            {/* Bento Card 2 - Standard */}
            <div className="glass-card rounded-[2rem] p-8 group relative overflow-hidden border-white/60">
              <div className="bg-ivgreen-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="h-6 w-6 text-ivgreen-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sécurité Défense</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Cryptage de bout en bout et authentification stricte pour protéger vos données sensibles.
              </p>
            </div>

            {/* Bento Card 3 - Standard */}
            <div className="glass-card rounded-[2rem] p-8 group relative overflow-hidden border-white/60">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accès Nomade</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Consultez vos dossiers depuis votre téléphone, tablette ou ordinateur de bureau, partout, tout le temps.
              </p>
            </div>

            {/* Bento Card 4 - Wide */}
            <div className="glass-card rounded-[2rem] p-8 md:col-span-2 group relative overflow-hidden flex items-center gap-8 border-white/60">
              <div className="absolute inset-0 bg-gradient-to-r from-ivgreen-500/5 to-transparent"></div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0 relative z-10 group-hover:-translate-y-1 transition-transform duration-500">
                <FileText className="h-8 w-8 text-gray-700" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparence Totale</h3>
                <p className="text-gray-500 leading-relaxed">
                  Historique détaillé de chaque action. Vous savez exactement à quel bureau se trouve votre demande à tout instant.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="border-t border-gray-200/60 bg-white/40 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200/60">
              <div className="text-center px-4">
                <p className="text-4xl font-extrabold text-gray-900 mb-2">100<span className="text-ivorange-500">%</span></p>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Dématérialisé</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-extrabold text-gray-900 mb-2">24<span className="text-ivgreen-500">/7</span></p>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Disponibilité</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-extrabold text-gray-900 mb-2"><Clock className="inline h-8 w-8 text-blue-500 mb-1"/></p>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Temps Réel</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-extrabold text-gray-900 mb-2"><Users className="inline h-8 w-8 text-purple-500 mb-1"/></p>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Multi-Rôles</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-4 border-ivorange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={36} height={36} className="rounded-md" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">DRH Sports</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Côte d'Ivoire</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <span className="w-1 h-1 rounded-full bg-gray-700"></span>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <span className="w-1 h-1 rounded-full bg-gray-700"></span>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Ministère des Sports. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-4 h-3 bg-ivorange-500 rounded-sm"></span>
              <span className="w-4 h-3 bg-white rounded-sm"></span>
              <span className="w-4 h-3 bg-ivgreen-500 rounded-sm"></span>
              <span className="ml-2 font-medium tracking-widest uppercase">RCI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
