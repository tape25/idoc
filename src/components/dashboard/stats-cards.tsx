"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Send,
  PenTool,
  Bell,
  Users
} from "lucide-react"

interface Stats {
  [key: string]: number | Record<string, number>
}

interface StatsCardsProps {
  stats: Stats
  role: string
}

export function StatsCards({ stats, role }: StatsCardsProps) {
  const getStatsForRole = () => {
    switch (role) {
      case "AGENT":
        return [
          { label: "Total demandes", value: stats.total || 0, icon: FileText, color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/20" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, color: "from-ivorange-400 to-ivorange-600", shadow: "shadow-ivorange-500/20" },
          { label: "Signées", value: stats.signes || 0, icon: CheckCircle, color: "from-ivgreen-400 to-ivgreen-600", shadow: "shadow-ivgreen-500/20" },
          { label: "Disponibles", value: stats.disponibles || 0, icon: Bell, color: "from-purple-400 to-purple-600", shadow: "shadow-purple-500/20" }
        ]
      case "SERVICE_COURRIER":
        return [
          { label: "À vérifier", value: stats.aVerifier || 0, icon: AlertCircle, color: "from-red-400 to-red-600", shadow: "shadow-red-500/20" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, color: "from-ivorange-400 to-ivorange-600", shadow: "shadow-ivorange-500/20" },
          { label: "Validés", value: stats.valides || 0, icon: CheckCircle, color: "from-ivgreen-400 to-ivgreen-600", shadow: "shadow-ivgreen-500/20" },
          { label: "À notifier", value: stats.aNotifier || 0, icon: Bell, color: "from-purple-400 to-purple-600", shadow: "shadow-purple-500/20" }
        ]
      case "SECRETARIAT_DRH":
        return [
          { label: "À traiter", value: stats.aTraiter || 0, icon: FileText, color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/20" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, color: "from-ivorange-400 to-ivorange-600", shadow: "shadow-ivorange-500/20" },
          { label: "En attente signature", value: stats.enAttenteSignature || 0, icon: PenTool, color: "from-purple-400 to-purple-600", shadow: "shadow-purple-500/20" },
          { label: "Signés", value: stats.signes || 0, icon: CheckCircle, color: "from-ivgreen-400 to-ivgreen-600", shadow: "shadow-ivgreen-500/20" }
        ]
      case "DRH":
        return [
          { label: "À signer", value: stats.aSigner || 0, icon: PenTool, color: "from-red-400 to-red-600", shadow: "shadow-red-500/20" },
          { label: "Signés", value: stats.signes || 0, icon: CheckCircle, color: "from-ivgreen-400 to-ivgreen-600", shadow: "shadow-ivgreen-500/20" },
          { label: "Retours", value: stats.retours || 0, icon: Send, color: "from-ivorange-400 to-ivorange-600", shadow: "shadow-ivorange-500/20" }
        ]
      case "ADMIN":
        return [
          { label: "Total demandes", value: stats.totalDemandes || 0, icon: FileText, color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/20" },
          { label: "Total utilisateurs", value: stats.totalUsers || 0, icon: Users, color: "from-purple-400 to-purple-600", shadow: "shadow-purple-500/20" },
          { label: "En cours", value: (stats.parStatut as Record<string, number>)?.enCours || 0, icon: Clock, color: "from-ivorange-400 to-ivorange-600", shadow: "shadow-ivorange-500/20" },
          { label: "Signés", value: (stats.parStatut as Record<string, number>)?.signes || 0, icon: CheckCircle, color: "from-ivgreen-400 to-ivgreen-600", shadow: "shadow-ivgreen-500/20" }
        ]
      default:
        return []
    }
  }

  const statsData = getStatsForRole()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="relative group rounded-3xl overflow-hidden bg-white hover:bg-gray-50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl border border-gray-100/80 p-[1px]">
            {/* Animated Gradient Border effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className="bg-white/90 backdrop-blur-sm h-full rounded-[23px] p-6 relative z-10 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow} text-white group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="w-12 h-12 absolute -top-4 -right-4 bg-gradient-to-br from-gray-100 to-white rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value as number}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
