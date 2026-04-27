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
    <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-100 min-h-[calc(100vh-80px)] flex flex-col hidden md:flex">
      <div className="p-3 space-y-1 flex-1 mt-2">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`w-full justify-start h-11 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-ivorange-50 text-ivorange-600 hover:bg-ivorange-100" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={`mr-3 p-1.5 rounded-lg ${isActive ? 'bg-ivorange-100 text-ivorange-500' : 'text-gray-400'}`}>
                <tab.icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
            </Button>
          )
        })}
      </div>

      <div className="p-3 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50 h-11 rounded-xl transition-all"
          onClick={onLogout}
        >
          <div className="mr-3 p-1.5 rounded-lg text-gray-400">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Déconnexion</span>
        </Button>
      </div>
    </aside>
  )
}
