"use client"

import { motion } from "framer-motion"
import { Building2, Users, FileText, Activity, ArrowRight, ChevronRight, GlobeLock } from "lucide-react"

export function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
      {/* Navbar Minimaliste */}
      <nav className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-white/30 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg shadow-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-slate-800 font-extrabold tracking-tight">Ministère des Sports</h2>
            <p className="text-[10px] uppercase text-emerald-700/80 font-bold tracking-widest">Rép. de Côte d'Ivoire</p>
          </div>
        </div>
        <button 
          onClick={onLoginClick}
          className="text-sm font-semibold text-emerald-800 bg-white/80 hover:bg-emerald-50 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all border border-emerald-100 flex items-center gap-2 group"
        >
          Connexion <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/50">
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-200/20 blur-[120px]" />
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-green-200/20 blur-[100px]" />
          <div className="absolute bottom-[0%] left-[20%] w-[60%] h-[40%] rounded-full bg-slate-200/50 blur-[100px]" />
          
          {/* Subtle grid pattern for technical feel */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay"></div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-6 text-center max-w-5xl z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-700 text-sm font-medium mb-8">
            <GlobeLock className="w-4 h-4" />
            <span className="tracking-wide">Système d'Information RH Sécurisé</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Portail <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500 line-clamp-none">Nouvelle Génération</span> <br className="hidden md:block" />
            <span className="text-4xl md:text-5xl font-bold text-slate-700">Direction des Ressources Humaines</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            La plateforme unifiée pour la gestion dématérialisée, le suivi des carrières et le pilotage des effectifs de la tutelle. L'innovation au service de l'administration.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-lg hover:shadow-[0_0_40px_-5px_rgba(5,150,105,0.5)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Accéder au Portail <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-semibold text-lg shadow-sm transition-all"
            >
              Documentation
            </button>
          </motion.div>
        </motion.div>

        {/* Feature Cards Showcase (Hero Bottom) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="container mx-auto px-4 mt-20 max-w-6xl z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-emerald-600" />}
              title="Cartographie des Effectifs"
              description="Visualisation dynamique et suivi en temps réel des agents, des affectations et des postes de travail."
            />
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-emerald-600" />}
              title="Dossiers Dématérialisés"
              description="Espace numérique sécurisé centralisant l'intégralité des documents et historiques administratifs."
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-emerald-600" />}
              title="Pilotage Stratégique"
              description="Tableaux de bord, statistiques et indicateurs clés pour la planification proactive des RH."
            />
          </div>
        </motion.div>
      </div>

      {/* Footer Area */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 opacity-80">
            <Building2 className="w-6 h-6 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-slate-300">Ministère des Sports</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">République de Côte d'Ivoire</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Mentions Légales</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Support & Assistance</span>
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group bg-white/70 backdrop-blur-xl border border-white/50 p-7 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_-8px_rgba(5,150,105,0.15)] transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 bg-emerald-50 group-hover:bg-emerald-100 transition-colors rounded-2xl flex items-center justify-center mb-5 border border-emerald-100/50">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm font-medium">{description}</p>
    </div>
  )
}
