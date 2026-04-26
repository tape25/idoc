"use client"

import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Users, 
  Settings, 
  User as UserIcon,
  LogOut
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userRole: string
  onLogout: () => void
}

export function Sidebar({ activeTab, setActiveTab, userRole, onLogout }: SidebarProps) {
  const tabs = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, roles: ["AGENT", "SERVICE_COURRIER", "SECRETARIAT_DRH", "DRH", "ADMIN"] },
    { id: "demandes", label: "Demandes", icon: FileText, roles: ["AGENT", "SERVICE_COURRIER", "SECRETARIAT_DRH", "DRH", "ADMIN"] },
    { id: "historique", label: "Historique", icon: Clock, roles: ["AGENT", "SERVICE_COURRIER", "SECRETARIAT_DRH", "DRH", "ADMIN"] },
    { id: "utilisateurs", label: "Utilisateurs", icon: Users, roles: ["ADMIN"] },
    { id: "parametres", label: "Paramètres", icon: Settings, roles: ["ADMIN", "DRH"] },
    { id: "profil", label: "Mon Profil", icon: UserIcon, roles: ["AGENT", "SERVICE_COURRIER", "SECRETARIAT_DRH", "DRH", "ADMIN"] },
  ]

  const visibleTabs = tabs.filter(tab => tab.roles.includes(userRole))

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] flex flex-col hidden md:flex">
      <div className="p-4 space-y-2 flex-1">
        {visibleTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            className={`w-full justify-start ${activeTab === tab.id ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "hover:text-emerald-700"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="h-5 w-5 mr-3" />
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
