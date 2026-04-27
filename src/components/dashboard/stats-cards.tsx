"use client"

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
          { label: "Total demandes", value: stats.total || 0, icon: FileText, bgClass: "bg-blue-50", iconBg: "bg-blue-500", textColor: "text-blue-600" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, bgClass: "bg-ivorange-50", iconBg: "bg-ivorange-500", textColor: "text-ivorange-600" },
          { label: "Signées", value: stats.signes || 0, icon: CheckCircle, bgClass: "bg-ivgreen-50", iconBg: "bg-ivgreen-500", textColor: "text-ivgreen-600" },
          { label: "Disponibles", value: stats.disponibles || 0, icon: Bell, bgClass: "bg-purple-50", iconBg: "bg-purple-500", textColor: "text-purple-600" }
        ]
      case "SERVICE_COURRIER":
        return [
          { label: "À vérifier", value: stats.aVerifier || 0, icon: AlertCircle, bgClass: "bg-red-50", iconBg: "bg-red-500", textColor: "text-red-600" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, bgClass: "bg-ivorange-50", iconBg: "bg-ivorange-500", textColor: "text-ivorange-600" },
          { label: "Validés", value: stats.valides || 0, icon: CheckCircle, bgClass: "bg-ivgreen-50", iconBg: "bg-ivgreen-500", textColor: "text-ivgreen-600" },
          { label: "À notifier", value: stats.aNotifier || 0, icon: Bell, bgClass: "bg-purple-50", iconBg: "bg-purple-500", textColor: "text-purple-600" }
        ]
      case "SECRETARIAT_DRH":
        return [
          { label: "À traiter", value: stats.aTraiter || 0, icon: FileText, bgClass: "bg-blue-50", iconBg: "bg-blue-500", textColor: "text-blue-600" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, bgClass: "bg-ivorange-50", iconBg: "bg-ivorange-500", textColor: "text-ivorange-600" },
          { label: "En attente signature", value: stats.enAttenteSignature || 0, icon: PenTool, bgClass: "bg-purple-50", iconBg: "bg-purple-500", textColor: "text-purple-600" },
          { label: "Signés", value: stats.signes || 0, icon: CheckCircle, bgClass: "bg-ivgreen-50", iconBg: "bg-ivgreen-500", textColor: "text-ivgreen-600" }
        ]
      case "DRH":
        return [
          { label: "À signer", value: stats.aSigner || 0, icon: PenTool, bgClass: "bg-red-50", iconBg: "bg-red-500", textColor: "text-red-600" },
          { label: "Signés", value: stats.signes || 0, icon: CheckCircle, bgClass: "bg-ivgreen-50", iconBg: "bg-ivgreen-500", textColor: "text-ivgreen-600" },
          { label: "Retours", value: stats.retours || 0, icon: Send, bgClass: "bg-ivorange-50", iconBg: "bg-ivorange-500", textColor: "text-ivorange-600" }
        ]
      case "ADMIN":
        return [
          { label: "Total demandes", value: stats.totalDemandes || 0, icon: FileText, bgClass: "bg-blue-50", iconBg: "bg-blue-500", textColor: "text-blue-600" },
          { label: "Total utilisateurs", value: stats.totalUsers || 0, icon: Users, bgClass: "bg-purple-50", iconBg: "bg-purple-500", textColor: "text-purple-600" },
          { label: "En cours", value: (stats.parStatut as Record<string, number>)?.enCours || 0, icon: Clock, bgClass: "bg-ivorange-50", iconBg: "bg-ivorange-500", textColor: "text-ivorange-600" },
          { label: "Signés", value: (stats.parStatut as Record<string, number>)?.signes || 0, icon: CheckCircle, bgClass: "bg-ivgreen-50", iconBg: "bg-ivgreen-500", textColor: "text-ivgreen-600" }
        ]
      default:
        return []
    }
  }

  const statsData = getStatsForRole()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div 
            key={index} 
            className={`${stat.bgClass} rounded-2xl p-5 border border-gray-100/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-0.5">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value as number}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
