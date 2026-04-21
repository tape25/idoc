"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  LogOut, 
  FileText, 
  Clock,
  BarChart3,
  Plus,
  Users,
  Settings,
  PenTool,
  RefreshCw
} from "lucide-react"
import { DemandeForm } from "./demande-form"
import { DemandeList } from "./demande-list"
import { StatsCards } from "./stats-cards"
import { NotificationPanel } from "./notification-panel"
import { HistoriqueModal } from "./historique-modal"

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN": return <Settings className="h-5 w-5" />
      case "DRH": return <PenTool className="h-5 w-5" />
      case "SECRETARIAT_DRH": return <FileText className="h-5 w-5" />
      case "SERVICE_COURRIER": return <RefreshCw className="h-5 w-5" />
      default: return <Users className="h-5 w-5" />
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            <div>
              <h1 className="text-lg font-bold">DRH - Ministère des Sports</h1>
              <p className="text-emerald-200 text-xs">Côte d'Ivoire</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationPanel />
            
            <div className="flex items-center gap-2 bg-emerald-600 rounded-lg px-3 py-2">
              {getRoleIcon(user?.role || "")}
              <div className="text-sm">
                <p className="font-medium">{user?.prenom} {user?.nom}</p>
                <p className="text-emerald-200 text-xs">{getRoleName(user?.role || "")}</p>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white hover:bg-emerald-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} role={user?.role || ""} />

        {/* Actions selon le rôle */}
        {user?.role === "AGENT" && (
          <div className="mb-6">
            <Button 
              onClick={() => setShowNewForm(true)} 
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="demandes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="demandes">
              <FileText className="h-4 w-4 mr-2" />
              Demandes
            </TabsTrigger>
            <TabsTrigger value="historique">
              <Clock className="h-4 w-4 mr-2" />
              Historique
            </TabsTrigger>
            {user?.role === "ADMIN" && (
              <TabsTrigger value="stats">
                <BarChart3 className="h-4 w-4 mr-2" />
                Stats
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="demandes" className="mt-6">
            <DemandeList 
              demandes={demandes}
              userRole={user?.role || ""}
              onAction={handleAction}
              onViewHistorique={(d) => {
                setSelectedDemande(d)
                setShowHistorique(true)
              }}
            />
          </TabsContent>

          <TabsContent value="historique" className="mt-6">
            <HistoriqueTab demandes={demandes} />
          </TabsContent>

          {user?.role === "ADMIN" && (
            <TabsContent value="stats" className="mt-6">
              <StatsTab stats={stats} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-800 text-emerald-100 py-4 px-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Ministère des Sports - Direction des Ressources Humaines</p>
        <p className="text-emerald-300 text-xs mt-1">République de Côte d'Ivoire - Union - Discipline - Travail</p>
      </footer>

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
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4">Historique récent</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {demandes.flatMap(d => d.historique || []).slice(0, 20).map((h, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 mt-2 rounded-full ${statusColors[h.nouveauStatut] || "bg-gray-400"}`} />
            <div className="flex-1">
              <p className="font-medium text-sm">{h.action}</p>
              <p className="text-xs text-gray-500">
                Par {h.user.prenom} {h.user.nom} • {new Date(h.createdAt).toLocaleString("fr-FR")}
              </p>
              {h.details && <p className="text-xs text-gray-600 mt-1">{h.details}</p>}
            </div>
          </div>
        ))}
        {demandes.flatMap(d => d.historique || []).length === 0 && (
          <p className="text-gray-500 text-center py-8">Aucun historique disponible</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-4">Répartition par statut</h3>
        <div className="space-y-2">
          {stats.parStatut && Object.entries(stats.parStatut as Record<string, number>).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm">{statusLabels[key] || key}</span>
              <Badge>{value}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-4">Répartition par type</h3>
        <div className="space-y-2">
          {stats.parType && Object.entries(stats.parType as Record<string, number>).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm">{typeLabels[key] || key}</span>
              <Badge>{value}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
