"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  LogOut,
  Plus,
  Menu,
  X,
  Clock
} from "lucide-react"

import { Sidebar } from "./sidebar"
import { DemandeForm } from "./demande-form"
import { DemandeList } from "./demande-list"
import { StatsCards } from "./stats-cards"
import { NotificationPanel } from "./notification-panel"
import { HistoriqueModal } from "./historique-modal"
import { UsersManagement } from "./users-management"
import { SettingsPanel } from "./settings-panel"
import { ProfilePanel } from "./profile-panel"

interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: string
  matricule?: string | null
  service?: string | null
}

interface Demande {
  id: string
  numeroEnregistrement: string | null
  type: string
  titre: string
  motif: string | null
  statut: string
  dateSoumission: string
  dateDebut: string | null
  dateFin: string | null
  agent?: {
    nom: string
    prenom: string
    matricule: string | null
    email: string
    service: string | null
  }
  piecesJointes?: { nom: string; chemin: string }[]
  historique?: {
    action: string
    details: string | null
    ancienStatut: string | null
    nouveauStatut: string
    createdAt: string
    user: { nom: string; prenom: string; role: string }
  }[]
}

interface Stats {
  [key: string]: number | Record<string, number>
}

export function MainDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<Stats>({})
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [loading, setLoading] = useState(true)
  
  // Nouveaux états de layout
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null)
  const [showHistorique, setShowHistorique] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)

  const user = session?.user as User | undefined

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      const data = await response.json()
      setStats(data.stats || {})
      setDemandes(data.demandes || [])
    } catch (error) {
      console.error("Erreur chargement dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (demandeId: string, action: string, commentaire?: string) => {
    try {
      const response = await fetch(`/api/demandes/${demandeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, commentaire })
      })

      if (response.ok) {
        fetchDashboardData()
        setSelectedDemande(null)
      }
    } catch (error) {
      console.error("Erreur action:", error)
    }
  }

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      AGENT: "Agent",
      SERVICE_COURRIER: "Service Courrier",
      SECRETARIAT_DRH: "Secrétariat DRH",
      DRH: "Directeur RH",
      ADMIN: "Administrateur"
    }
    return roles[role] || role
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-emerald-800 font-medium animate-pulse">Chargement de votre espace de travail...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Bouton Menu Mobile */}
            <Button 
              variant="ghost" 
              className="md:hidden text-white hover:bg-emerald-600 p-1 mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            
            <Building2 className="h-8 w-8 hidden sm:block" />
            <div>
              <h1 className="text-sm sm:text-lg font-bold line-clamp-1">DRH - Ministère des Sports</h1>
              <p className="text-emerald-200 text-xs hidden sm:block">Côte d'Ivoire</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationPanel />
            
            <div className="hidden sm:flex items-center gap-2 bg-emerald-600 rounded-lg px-3 py-2">
              <div className="text-sm text-right">
                <p className="font-medium">{user?.prenom} {user?.nom}</p>
                <p className="text-emerald-200 text-xs">{getRoleName(user?.role || "")}</p>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white hover:bg-emerald-600 sm:hidden"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white hover:bg-emerald-600 hidden sm:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab)
            setIsMobileMenuOpen(false)
          }} 
          userRole={user?.role || ""} 
          onLogout={() => signOut({ callbackUrl: "/" })}
        />

        {/* Sidebar Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Le contenu est géré en clonant la Sidebar mais visible sur mobile */}
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab)
                  setIsMobileMenuOpen(false)
                }} 
                userRole={user?.role || ""} 
                onLogout={() => signOut({ callbackUrl: "/" })}
              />
            </div>
          </div>
        )}

        {/* Contenu Principal */}
        <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl overflow-x-hidden">
          
          {/* Dashboard Principal (Stats) */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h2>
                  <p className="text-gray-500 text-sm">Bienvenue dans votre espace de travail</p>
                </div>
                {user?.role === "AGENT" && (
                  <Button 
                    onClick={() => setShowNewForm(true)} 
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle demande
                  </Button>
                )}
              </div>
              <StatsCards stats={stats} role={user?.role || ""} />
              
              {user?.role === "ADMIN" && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Analytique avancée</h3>
                  <StatsTab stats={stats} />
                </div>
              )}
            </div>
          )}

          {/* Onglet Demandes */}
          {activeTab === "demandes" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestion des Demandes</h2>
                  <p className="text-gray-500 text-sm">Consultez et traitez les actes administratifs</p>
                </div>
                {user?.role === "AGENT" && (
                  <Button 
                    onClick={() => setShowNewForm(true)} 
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Nouvelle demande</span>
                  </Button>
                )}
              </div>
              <DemandeList 
                demandes={demandes}
                userRole={user?.role || ""}
                onAction={handleAction}
                onViewHistorique={(d) => {
                  setSelectedDemande(d)
                  setShowHistorique(true)
                }}
              />
            </div>
          )}

          {/* Onglet Historique Global */}
          {activeTab === "historique" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Historique Global</h2>
              <HistoriqueTab demandes={demandes} />
            </div>
          )}

          {/* Onglet Utilisateurs */}
          {activeTab === "utilisateurs" && user?.role === "ADMIN" && (
            <div className="animate-in fade-in duration-300">
              <UsersManagement />
            </div>
          )}

          {/* Onglet Paramètres */}
          {activeTab === "parametres" && (user?.role === "ADMIN" || user?.role === "DRH") && (
            <div className="animate-in fade-in duration-300">
              <SettingsPanel />
            </div>
          )}

          {/* Onglet Profil */}
          {activeTab === "profil" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Mon Profil</h2>
              <ProfilePanel />
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      {showNewForm && (
        <DemandeForm 
          onClose={() => setShowNewForm(false)} 
          onSuccess={() => {
            setShowNewForm(false)
            fetchDashboardData()
          }}
        />
      )}

      {showHistorique && selectedDemande && (
        <HistoriqueModal 
          demande={selectedDemande}
          onClose={() => {
            setShowHistorique(false)
            setSelectedDemande(null)
          }}
        />
      )}
    </div>
  )
}

// Composant Historique Tab
function HistoriqueTab({ demandes }: { demandes: Demande[] }) {
  const statusColors: Record<string, string> = {
    SOUMIS: "bg-blue-500",
    EN_VERIFICATION: "bg-yellow-500",
    REJETE_COURRIER: "bg-red-500",
    VALIDEE_COURRIER: "bg-green-500",
    EN_COURS_TRAITEMENT: "bg-orange-500",
    EN_ATTENTE_SIGNATURE: "bg-purple-500",
    SIGNE: "bg-emerald-600",
    RETOUR_SECRETARIAT: "bg-amber-500",
    TRANSMIS_COURRIER: "bg-teal-500",
    DISPONIBLE: "bg-green-600",
    RETIRE: "bg-gray-500"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="space-y-4">
        {demandes.flatMap(d => (d.historique || []).map(h => ({ ...h, demandeRef: d.numeroEnregistrement || "Non enregistré" })))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 50)
          .map((h, i) => (
          <div key={i} className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b last:border-0">
            <div className={`w-3 h-3 mt-1.5 rounded-full shadow-sm flex-shrink-0 ${statusColors[h.nouveauStatut] || "bg-gray-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <p className="font-semibold text-gray-900 text-sm">{h.action}</p>
                <p className="text-xs text-gray-500 font-mono whitespace-nowrap">{new Date(h.createdAt).toLocaleString("fr-FR")}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Demande: <span className="font-mono text-emerald-600">{h.demandeRef}</span> • 
                Modifié par: <span className="font-medium text-gray-700">{h.user.prenom} {h.user.nom}</span> ({h.user.role})
              </p>
              {h.details && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 border border-gray-100">
                  {h.details}
                </div>
              )}
            </div>
          </div>
        ))}
        {demandes.flatMap(d => d.historique || []).length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <Clock className="h-12 w-12 text-gray-300 mb-3" />
            <p>Aucun historique disponible dans le système.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant Stats Tab (Admin)
function StatsTab({ stats }: { stats: Stats }) {
  const statusLabels: Record<string, string> = {
    soumis: "Soumis",
    enCours: "En cours",
    signes: "Signés",
    disponibles: "Disponibles",
    rejetes: "Rejetés"
  }

  const typeLabels: Record<string, string> = {
    congeMaternite: "Congé maternité",
    arretMaladie: "Arrêt maladie",
    permission: "Permission",
    attestation: "Attestation",
    certificat: "Certificat"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Répartition par statut</h3>
        <div className="space-y-3">
          {stats.parStatut && Object.entries(stats.parStatut as Record<string, number>).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center group">
              <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition-colors">{statusLabels[key] || key}</span>
              <Badge variant="secondary" className="bg-gray-100">{value}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Répartition par type</h3>
        <div className="space-y-3">
          {stats.parType && Object.entries(stats.parType as Record<string, number>).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center group">
              <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition-colors">{typeLabels[key] || key}</span>
              <Badge variant="outline" className="text-emerald-700 border-emerald-200">{value}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
