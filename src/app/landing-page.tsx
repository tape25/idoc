"use client"

import { Button } from "@/components/ui/button"
import { Building2, ShieldCheck, FileText, ArrowRight, Zap, Globe } from "lucide-react"

export function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-ivoire overflow-hidden relative">
      {/* Background Orbs (Glassmorphism effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-ivorange-400/20 blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-ivgreen-400/20 blur-[120px] animate-float-delayed" />
      
      {/* Header */}
      <header className="glass sticky top-0 z-50 w-full border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-ivgreen-500 to-ivgreen-700 p-2.5 rounded-xl shadow-lg shadow-ivgreen-500/30">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">DRH <span className="text-ivorange-500">Sports</span></h1>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Côte d'Ivoire</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onLoginClick} className="hidden sm:flex text-gray-600 hover:text-ivgreen-600 hover:bg-ivgreen-50 rounded-full px-6">
              Espace Agent
            </Button>
            <Button onClick={onLoginClick} className="bg-ivgreen-600 hover:bg-ivgreen-700 text-white rounded-full px-6 shadow-lg shadow-ivgreen-600/30 transition-all hover:scale-105">
              Connexion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-ivorange-200 text-ivorange-700 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-ivorange-500 animate-pulse"></span>
          Modernisation de l'Administration Ivoirienne
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-tight mb-6">
          Gérez vos actes administratifs en toute <span className="text-gradient">sérénité</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          La plateforme officielle de la Direction des Ressources Humaines du Ministère des Sports. 
          Un espace unifié, sécurisé et rapide pour tous les agents.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button onClick={onLoginClick} size="lg" className="w-full sm:w-auto bg-ivorange-500 hover:bg-ivorange-600 text-white rounded-full px-8 h-14 text-lg shadow-xl shadow-ivorange-500/30 transition-all hover:scale-105">
            Accéder au Portail
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-lg border-gray-200 text-gray-700 hover:bg-gray-50 glass">
            Découvrir le guide
          </Button>
        </div>

        {/* Feature Cards Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full text-left">
          <div className="glass-card p-8 rounded-3xl group">
            <div className="bg-ivgreen-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="h-7 w-7 text-ivgreen-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Traitement Rapide</h3>
            <p className="text-gray-600 leading-relaxed">
              Vos demandes de congés, permissions et attestations sont traitées dans des délais records grâce au circuit dématérialisé.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ivorange-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="bg-ivorange-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <ShieldCheck className="h-7 w-7 text-ivorange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Haute Sécurité</h3>
            <p className="text-gray-600 leading-relaxed relative z-10">
              Vos données personnelles et documents officiels sont protégés par des protocoles de cryptage de pointe.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl group">
            <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Accès Permanent</h3>
            <p className="text-gray-600 leading-relaxed">
              Consultez l'historique de vos requêtes et suivez l'avancement de vos dossiers 24/7 depuis n'importe quel appareil.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} Ministère des Sports - DRH. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-3 h-3 rounded-full bg-ivorange-500"></span>
            <span className="w-3 h-3 rounded-full bg-white border border-gray-200"></span>
            <span className="w-3 h-3 rounded-full bg-ivgreen-500"></span>
            <span className="ml-2 font-medium tracking-wide">RÉPUBLIQUE DE CÔTE D'IVOIRE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
