"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Eye, 
  Check, 
  X, 
  Send, 
  PenTool,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Printer,
  FileArchive,
  User
} from "lucide-react"

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

interface DemandeListProps {
  demandes: Demande[]
  userRole: string
  onAction: (id: string, action: string, commentaire?: string) => void
  onViewHistorique: (demande: Demande) => void
}

const statusLabels: Record<string, string> = {
  SOUMIS: "Soumis",
  EN_VERIFICATION: "En vérification",
  REJETE_COURRIER: "Rejeté",
  VALIDEE_COURRIER: "Validé (Courrier)",
  EN_COURS_TRAITEMENT: "En cours de traitement",
  EN_ATTENTE_SIGNATURE: "En attente de signature",
  SIGNE: "Signé",
  RETOUR_SECRETARIAT: "Retour secrétariat",
  TRANSMIS_COURRIER: "Transmis au courrier",
  DISPONIBLE: "Disponible",
  RETIRE: "Retiré"
}

const statusStyles: Record<string, string> = {
  SOUMIS: "bg-blue-50 text-blue-700 border-blue-200",
  EN_VERIFICATION: "bg-yellow-50 text-yellow-700 border-yellow-200",
  REJETE_COURRIER: "bg-red-50 text-red-700 border-red-200",
  VALIDEE_COURRIER: "bg-green-50 text-green-700 border-green-200",
  EN_COURS_TRAITEMENT: "bg-ivorange-50 text-ivorange-700 border-ivorange-200",
  EN_ATTENTE_SIGNATURE: "bg-purple-50 text-purple-700 border-purple-200",
  SIGNE: "bg-ivgreen-50 text-ivgreen-700 border-ivgreen-200",
  RETOUR_SECRETARIAT: "bg-amber-50 text-amber-700 border-amber-200",
  TRANSMIS_COURRIER: "bg-teal-50 text-teal-700 border-teal-200",
  DISPONIBLE: "bg-green-50 text-green-800 border-green-300 font-bold",
  RETIRE: "bg-gray-100 text-gray-700 border-gray-300"
}

const typeLabels: Record<string, string> = {
  CONGE_MATERNITE: "Congé de maternité",
  ARRET_MALADIE: "Arrêt maladie",
  PERMISSION: "Permission",
  ATTESTATION: "Attestation",
  CERTIFICAT: "Certificat",
  AUTRE: "Autre"
}

export function DemandeList({ demandes, userRole, onAction, onViewHistorique }: DemandeListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState("TOUS")
  const [filterType, setFilterType] = useState("TOUS")

  const handleAction = async (id: string, action: string) => {
    setProcessing(id)
    await onAction(id, action)
    setProcessing(null)
  }

  const handlePrint = (demande: Demande) => {
    window.print()
  }

  const getActionsForRole = (demande: Demande) => {
    const actions: { action: string; label: string; icon: React.ReactNode; variant: "default" | "destructive" | "outline" | "secondary" }[] = []

    switch (userRole) {
      case "SERVICE_COURRIER":
        if (demande.statut === "SOUMIS") {
          actions.push({ action: "VALIDER_COURRIER", label: "Valider", icon: <Check className="h-4 w-4" />, variant: "default" })
          actions.push({ action: "REJETER_COURRIER", label: "Rejeter", icon: <X className="h-4 w-4" />, variant: "destructive" })
        }
        if (demande.statut === "VALIDEE_COURRIER") {
          actions.push({ action: "TRANSMETTRE_SECRETARIAT", label: "Transmettre au secrétariat", icon: <Send className="h-4 w-4" />, variant: "default" })
        }
        if (demande.statut === "TRANSMIS_COURRIER") {
          actions.push({ action: "NOTIFIER", label: "Notifier l'agent", icon: <Send className="h-4 w-4" />, variant: "default" })
        }
        break

      case "SECRETARIAT_DRH":
        if (demande.statut === "VALIDEE_COURRIER" || demande.statut === "EN_COURS_TRAITEMENT") {
          actions.push({ action: "TRAITER", label: "Transmettre pour signature", icon: <Send className="h-4 w-4" />, variant: "default" })
        }
        if (demande.statut === "SIGNE") {
          actions.push({ action: "TRANSMETTRE_COURRIER", label: "Transmettre au courrier", icon: <Send className="h-4 w-4" />, variant: "default" })
        }
        if (demande.statut === "RETOUR_SECRETARIAT") {
          actions.push({ action: "TRAITER", label: "Retraiter", icon: <FileText className="h-4 w-4" />, variant: "outline" })
        }
        break

      case "DRH":
        if (demande.statut === "EN_ATTENTE_SIGNATURE") {
          actions.push({ action: "SIGNER", label: "Signer", icon: <PenTool className="h-4 w-4" />, variant: "default" })
        }
        if (demande.statut === "SIGNE") {
          actions.push({ action: "RETOURNER_SECRETARIAT", label: "Retourner au secrétariat", icon: <Send className="h-4 w-4" />, variant: "outline" })
        }
        break

      case "AGENT":
        if (demande.statut === "DISPONIBLE") {
          actions.push({ action: "RETIRER", label: "Confirmer le retrait", icon: <Check className="h-4 w-4" />, variant: "default" })
        }
        break
    }

    return actions
  }

  const filteredDemandes = demandes.filter((d) => {
    const matchesSearch = 
      d.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (d.numeroEnregistrement?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (d.agent?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (d.agent?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    
    const matchesStatut = filterStatut === "TOUS" || d.statut === filterStatut
    const matchesType = filterType === "TOUS" || d.type === filterType

    return matchesSearch && matchesStatut && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Barre de Recherche et Filtres */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-2/5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Rechercher par nom, titre ou numéro..." 
            className="pl-12 h-12 rounded-xl bg-gray-50/50 border-transparent focus:border-ivorange-500 focus:bg-white transition-all text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-[180px] h-12 rounded-xl bg-white border-gray-200">
              <Filter className="mr-2 h-4 w-4 text-ivorange-500" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="TOUS" className="font-medium">Tous les statuts</SelectItem>
              {Object.keys(statusLabels).map(key => (
                <SelectItem key={key} value={key}>{statusLabels[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] h-12 rounded-xl bg-white border-gray-200">
              <FileArchive className="mr-2 h-4 w-4 text-ivgreen-600" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="TOUS" className="font-medium">Tous les types</SelectItem>
              {Object.keys(typeLabels).map(key => (
                <SelectItem key={key} value={key}>{typeLabels[key]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredDemandes.length === 0 ? (
        <div className="glass-card rounded-3xl py-16 flex flex-col items-center justify-center text-gray-500">
          <div className="bg-gray-50 p-6 rounded-full mb-6">
            <FileText className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun dossier trouvé</h3>
          <p className="text-gray-500 max-w-sm text-center">Modifiez vos critères de recherche ou ajoutez une nouvelle demande pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDemandes.map((demande) => {
            const isExpanded = expandedId === demande.id
            const actions = getActionsForRole(demande)
            const isProcessing = processing === demande.id

            return (
              <div key={demande.id} className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'shadow-xl border-gray-200' : 'shadow-sm hover:shadow-md border-gray-100'}`}>
                <div 
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : demande.id)}
                >
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
                    {/* Icon Status Indicator */}
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline" className={`px-2.5 py-0.5 rounded-md font-medium text-xs border ${statusStyles[demande.statut]}`}>
                          {statusLabels[demande.statut]}
                        </Badge>
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                          {demande.numeroEnregistrement || "NON ENREGISTRÉ"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center ml-auto sm:ml-0">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(demande.dateSoumission).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{demande.titre}</h3>
                      <p className="text-sm text-gray-500 truncate">{typeLabels[demande.type] || demande.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-gray-50 hover:bg-gray-100"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/30 print:block">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                      
                      {/* Section Demandeur */}
                      {demande.agent && (
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-4 w-4 text-ivorange-500" /> 
                            Informations Demandeur
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Nom complet</span>
                              <span className="text-sm font-semibold text-gray-900">{demande.agent.prenom} {demande.agent.nom}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Matricule</span>
                              <span className="text-sm font-mono text-gray-900 bg-gray-100 px-1.5 rounded">{demande.agent.matricule || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Service</span>
                              <span className="text-sm text-gray-900">{demande.agent.service || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Email</span>
                              <span className="text-sm text-gray-900">{demande.agent.email}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Détails demande */}
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-ivgreen-600" /> 
                          Détails du Dossier
                        </h4>
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Motif de la demande</span>
                            <span className="text-sm text-gray-900 font-medium bg-gray-50 p-2 rounded-lg">{demande.motif || "-"}</span>
                          </div>
                          {(demande.dateDebut || demande.dateFin) && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {demande.dateDebut && (
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                  <span className="block text-xs text-gray-500 mb-1">Date de début</span>
                                  <span className="text-sm font-semibold text-gray-900">{new Date(demande.dateDebut).toLocaleDateString("fr-FR")}</span>
                                </div>
                              )}
                              {demande.dateFin && (
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                  <span className="block text-xs text-gray-500 mb-1">Date de fin</span>
                                  <span className="text-sm font-semibold text-gray-900">{new Date(demande.dateFin).toLocaleDateString("fr-FR")}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pièces jointes */}
                      {demande.piecesJointes && demande.piecesJointes.length > 0 && (
                        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                            <FileArchive className="h-4 w-4 text-gray-400" />
                            Pièces jointes fournies
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {demande.piecesJointes.map((pj, i) => (
                              <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                <FileText className="h-4 w-4 text-gray-500" /> 
                                <span className="text-sm font-medium text-gray-700">{pj.nom}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions de Traitement */}
                    <div className="flex flex-wrap items-center gap-3 pt-6 mt-2 border-t border-gray-200 print:hidden">
                      <div className="flex-1 flex flex-wrap gap-2">
                        {actions.map((action, i) => {
                          const isPrimaryAction = action.variant === 'default'
                          return (
                            <Button
                              key={i}
                              variant={action.variant}
                              className={isPrimaryAction ? "bg-ivgreen-600 hover:bg-ivgreen-700 text-white rounded-xl shadow-md h-10" : "rounded-xl h-10"}
                              onClick={(e) => { e.stopPropagation(); handleAction(demande.id, action.action); }}
                              disabled={isProcessing}
                            >
                              {action.icon}
                              <span className="ml-2 font-medium">{action.label}</span>
                            </Button>
                          )
                        })}
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="secondary"
                          className="rounded-xl h-10 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
                          onClick={(e) => { e.stopPropagation(); onViewHistorique(demande); }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Historique
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl h-10 border-gray-200 text-gray-600"
                          onClick={(e) => { e.stopPropagation(); handlePrint(demande); }}
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
