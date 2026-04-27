"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { 
  LogOut,
  Plus,
  Menu,
  X,
  Clock,
  Sparkles
} from "lucide-react"

import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null)
  const [showHistorique, setShowHistorique] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-ivory-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ivorange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-ivorange-500 to-ivgreen-500 rounded-full blur animate-spin opacity-50"></div>
            <div className="bg-white p-3 rounded-full relative z-10 shadow-xl border border-white/50">
              <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={48} height={48} className="rounded-lg" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Chargement de l'espace</h2>
          <p className="text-gray-500 mt-2 font-medium">Veuillez patienter quelques instants...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 relative">
      {/* Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-ivorange-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-ivgreen-500/5 blur-[120px] pointer-events-none" />

      {/* Header Premium */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-full mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="md:hidden text-gray-600 hover:text-ivorange-600 hover:bg-ivorange-50 p-2 -ml-2 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            
            <div className="hidden sm:flex items-center justify-center bg-gradient-to-br from-ivgreen-500 to-ivgreen-700 p-1.5 rounded-xl shadow-lg shadow-ivgreen-500/20 border border-ivgreen-400/30">
              <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={36} height={36} className="rounded-md" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">DRH <span className="text-ivorange-500">Sports</span></h1>
              <p className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">Côte d'Ivoire</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <NotificationPanel />
            
            <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">{user?.prenom} {user?.nom}</p>
                <p className="text-ivorange-600 text-xs font-semibold tracking-wide uppercase">{getRoleName(user?.role || "")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-ivorange-100 to-ivgreen-100 border border-white flex items-center justify-center shadow-inner">
                <span className="font-bold text-gray-700 text-lg">{user?.prenom?.[0]}{user?.nom?.[0]}</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowLogoutConfirm(true)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 sm:hidden rounded-xl"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => setShowLogoutConfirm(true)}
              className="hidden sm:flex text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium px-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Quitter
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full relative z-10">
        
        {/* Sidebar Desktop */}
        <div className="sticky top-20 h-[calc(100vh-80px)]">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab)
              setIsMobileMenuOpen(false)
            }} 
            userRole={user?.role || ""} 
            onLogout={() => setShowLogoutConfirm(true)}
          />
        </div>

        {/* Sidebar Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm md:hidden animate-in fade-in" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left" onClick={e => e.stopPropagation()}>
              <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/50">
                <span className="font-bold text-gray-900">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab)
                  setIsMobileMenuOpen(false)
                }} 
                userRole={user?.role || ""} 
                onLogout={() => setShowLogoutConfirm(true)}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 w-full overflow-x-hidden min-h-[calc(100vh-80px)]">
          <div className="max-w-6xl mx-auto">
            {/* Dashboard Principal (Stats) */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                      Vue d'ensemble <Sparkles className="h-6 w-6 text-ivorange-500" />
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm sm:text-base">Gérez l'activité RH avec clarté et efficacité.</p>
                  </div>
                  {user?.role === "AGENT" && (
                    <Button 
                      onClick={() => setShowNewForm(true)} 
                      className="bg-gradient-to-r from-ivorange-500 to-ivorange-600 hover:from-ivorange-600 hover:to-ivorange-700 text-white rounded-full px-6 shadow-lg shadow-ivorange-500/25 transition-all hover:scale-105 h-12"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nouvelle demande
                    </Button>
                  )}
                </div>
                
                <StatsCards stats={stats} role={user?.role || ""} />
                
                {user?.role === "ADMIN" && (
                  <div className="mt-12 animate-in fade-in duration-700 delay-150 fill-mode-both">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      Analytique Système
                      <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-gray-100 to-transparent rounded-full"></div>
                    </h3>
                    <StatsTab stats={stats} />
                  </div>
                )}
              </div>
            )}

            {/* Autres Onglets... */}
            {activeTab === "demandes" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dossiers RH</h2>
                    <p className="text-gray-500 mt-1 font-medium">Traitement et suivi des actes administratifs.</p>
                  </div>
                  {user?.role === "AGENT" && (
                    <Button 
                      onClick={() => setShowNewForm(true)} 
                      className="bg-gradient-to-r from-ivorange-500 to-ivorange-600 hover:from-ivorange-600 hover:to-ivorange-700 text-white rounded-full px-6 shadow-lg shadow-ivorange-500/25 h-12 transition-all hover:scale-105"
                    >
                      <Plus className="h-5 w-5 sm:mr-2" />
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

            {activeTab === "historique" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Registre des Actions</h2>
                <HistoriqueTab demandes={demandes} />
              </div>
            )}

            {activeTab === "utilisateurs" && user?.role === "ADMIN" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UsersManagement />
              </div>
            )}

            {activeTab === "parametres" && (user?.role === "ADMIN" || user?.role === "DRH") && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SettingsPanel />
              </div>
            )}

            {activeTab === "profil" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Espace Personnel</h2>
                <ProfilePanel />
              </div>
            )}
          </div>
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

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="bg-white rounded-3xl border-gray-100 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">Confirmation de déconnexion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-base">
              Êtes-vous sûr de vouloir vous déconnecter de votre espace DRH Sports ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-11">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 h-11"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Composant Historique Tab - Version Premium
function HistoriqueTab({ demandes }: { demandes: Demande[] }) {
  const statusColors: Record<string, string> = {
    SOUMIS: "bg-blue-500 shadow-blue-500/40",
    EN_VERIFICATION: "bg-yellow-500 shadow-yellow-500/40",
    REJETE_COURRIER: "bg-red-500 shadow-red-500/40",
    VALIDEE_COURRIER: "bg-green-500 shadow-green-500/40",
    EN_COURS_TRAITEMENT: "bg-ivorange-500 shadow-ivorange-500/40",
    EN_ATTENTE_SIGNATURE: "bg-purple-500 shadow-purple-500/40",
    SIGNE: "bg-ivgreen-600 shadow-ivgreen-600/40",
    RETOUR_SECRETARIAT: "bg-amber-500 shadow-amber-500/40",
    TRANSMIS_COURRIER: "bg-teal-500 shadow-teal-500/40",
    DISPONIBLE: "bg-green-600 shadow-green-600/40",
    RETIRE: "bg-gray-500 shadow-gray-500/40"
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {demandes.flatMap(d => (d.historique || []).map(h => ({ ...h, demandeRef: d.numeroEnregistrement || "Non enregistré" })))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 50)
          .map((h, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline dot */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${statusColors[h.nouveauStatut] || "bg-gray-400"}`}>
            </div>
            
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-1 mb-2">
                <time className="text-xs font-semibold tracking-wide uppercase text-ivorange-500">{new Date(h.createdAt).toLocaleString("fr-FR")}</time>
                <h4 className="text-base font-bold text-gray-900">{h.action}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Dossier <span className="font-mono text-gray-900 bg-gray-100 px-1 py-0.5 rounded">{h.demandeRef}</span>
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-700">
                  {h.user.prenom[0]}
                </div>
                <span>{h.user.prenom} {h.user.nom} ({h.user.role})</span>
              </div>
              {h.details && (
                <div className="mt-4 p-3 bg-gray-50/80 rounded-xl text-sm text-gray-700 border border-gray-100/50">
                  {h.details}
                </div>
              )}
            </div>
          </div>
        ))}
        {demandes.flatMap(d => d.historique || []).length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 relative z-10 bg-white/50 rounded-2xl">
            <Clock className="h-16 w-16 mb-4 text-gray-200" />
            <p className="font-medium text-lg text-gray-500">Aucune activité enregistrée</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant Stats Tab (Admin) - Version Premium avec Recharts
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

  // Formatage des données pour Recharts
  const statusData = stats.parStatut 
    ? Object.entries(stats.parStatut as Record<string, number>)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({
          name: statusLabels[name] || name,
          value
        }))
    : []

  const actData = stats.parType
    ? Object.entries(stats.parType as Record<string, number>)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({
          name: typeLabels[name] || name,
          value
        }))
    : []

  // Palette de couleurs inspirée du thème de l'application
  const COLORS = ['#F77F00', '#009E60', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Donut Chart - Statuts */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden group min-h-[400px] flex flex-col border border-white/60">
        <div className="absolute top-0 right-0 w-40 h-40 bg-ivorange-500/5 rounded-full blur-3xl group-hover:bg-ivorange-500/10 transition-colors"></div>
        <h3 className="font-bold text-xl mb-2 text-gray-900 relative z-10">Répartition par Statut</h3>
        <p className="text-sm text-gray-500 mb-6 relative z-10">Vue globale de l'avancement des dossiers</p>
        
        <div className="flex-1 relative z-10 w-full min-h-[250px]">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#111827' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              Aucune donnée de statut disponible
            </div>
          )}
        </div>
        
        {/* Légende personnalisée pour le Donut */}
        {statusData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 relative z-10">
            {statusData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-gray-600 truncate">{entry.name}</span>
                <span className="font-bold text-gray-900 ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bar Chart - Actes */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden group min-h-[400px] flex flex-col border border-white/60">
        <div className="absolute top-0 right-0 w-40 h-40 bg-ivgreen-500/5 rounded-full blur-3xl group-hover:bg-ivgreen-500/10 transition-colors"></div>
        <h3 className="font-bold text-xl mb-2 text-gray-900 relative z-10">Répartition par Type d'Acte</h3>
        <p className="text-sm text-gray-500 mb-6 relative z-10">Volume des demandes par catégorie</p>
        
        <div className="flex-1 relative z-10 w-full min-h-[250px]">
          {actData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#6b7280' }} 
                  axisLine={false} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }} 
                  axisLine={false} 
                  tickLine={false} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 158, 96, 0.05)' }}
                  contentStyle={{ borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#009E60', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#009E60" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                  animationDuration={1500}
                >
                  {actData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#009E60' : '#F77F00'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              Aucune donnée d'acte disponible
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

