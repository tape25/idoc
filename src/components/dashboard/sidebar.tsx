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
    <aside className="w-64 bg-white/60 backdrop-blur-xl border-r border-gray-100 min-h-[calc(100vh-72px)] flex flex-col hidden md:flex relative">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-ivory-50 to-transparent opacity-50 pointer-events-none"></div>
      
      <div className="p-4 space-y-2 flex-1 relative z-10 mt-4">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`w-full justify-start h-12 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                isActive 
                  ? "bg-white shadow-[0_4px_20px_-4px_rgba(247,127,0,0.15)] text-ivorange-600 border border-ivorange-100" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/80"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-ivorange-400 to-ivorange-600 rounded-r-md"></div>
              )}
              <div className={`mr-3 p-2 rounded-lg transition-colors ${isActive ? 'bg-ivorange-50 text-ivorange-500' : 'bg-gray-50 text-gray-400 group-hover:text-ivorange-400 group-hover:bg-ivorange-50/50'}`}>
                <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`font-medium ${isActive ? 'font-semibold tracking-wide' : ''}`}>{tab.label}</span>
            </Button>
          )
        })}
      </div>

      <div className="p-4 border-t border-gray-100/50 relative z-10 bg-white/40">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50 h-12 rounded-xl group transition-all"
          onClick={onLogout}
        >
          <div className="mr-3 p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="font-medium">Déconnexion</span>
        </Button>
      </div>
    </aside>
  )
}
