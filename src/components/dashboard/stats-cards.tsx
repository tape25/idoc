"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Send,
  PenTool,
  Bell
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
          { label: "Total demandes", value: stats.total || 0, icon: FileText, color: "text-blue-600 bg-blue-100" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, color: "text-orange-600 bg-orange-100" },
          { label: "Signées", value: stats.signes || 0, icon: CheckCircle, color: "text-green-600 bg-green-100" },
          { label: "Disponibles", value: stats.disponibles || 0, icon: Bell, color: "text-purple-600 bg-purple-100" }
        ]
      case "SERVICE_COURRIER":
        return [
          { label: "À vérifier", value: stats.aVerifier || 0, icon: AlertCircle, color: "text-red-600 bg-red-100" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, color: "text-orange-600 bg-orange-100" },
          { label: "Validés", value: stats.valides || 0, icon: CheckCircle, color: "text-green-600 bg-green-100" },
          { label: "À notifier", value: stats.aNotifier || 0, icon: Bell, color: "text-purple-600 bg-purple-100" }
        ]
      case "SECRETARIAT_DRH":
        return [
          { label: "À traiter", value: stats.aTraiter || 0, icon: FileText, color: "text-blue-600 bg-blue-100" },
          { label: "En cours", value: stats.enCours || 0, icon: Clock, color: "text-orange-600 bg-orange-100" },
          { label: "En attente signature", value: stats.enAttenteSignature || 0, icon: PenTool, color: "text-purple-600 bg-purple-100" },
          { label: "Signés", value: stats.signes || 0, icon: CheckCircle, color: "text-green-600 bg-green-100" }
        ]
      case "DRH":
        return [
          { label: "À signer", value: stats.aSigner || 0, icon: PenTool, color: "text-red-600 bg-red-100" },
          { label: "Signés", value: stats.signes || 0, icon: CheckCircle, color: "text-green-600 bg-green-100" },
          { label: "Retours", value: stats.retours || 0, icon: Send, color: "text-orange-600 bg-orange-100" }
        ]
      case "ADMIN":
        return [
          { label: "Total demandes", value: stats.totalDemandes || 0, icon: FileText, color: "text-blue-600 bg-blue-100" },
          { label: "Total utilisateurs", value: stats.totalUsers || 0, icon: CheckCircle, color: "text-green-600 bg-green-100" },
          { label: "En cours", value: (stats.parStatut as Record<string, number>)?.enCours || 0, icon: Clock, color: "text-orange-600 bg-orange-100" },
          { label: "Signés", value: (stats.parStatut as Record<string, number>)?.signes || 0, icon: CheckCircle, color: "text-emerald-600 bg-emerald-100" }
        ]
      default:
        return []
    }
  }

  const statsData = getStatsForRole()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
