"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Loader2 } from "lucide-react"

interface Demande {
  id: string
  type: string
  titre: string
  motif: string | null
  dateDebut: string | null
  dateFin: string | null
}

interface DemandeFormProps {
  onClose: () => void
  onSuccess: () => void
  editDemande?: Demande | null
}

const typesDemande = [
  { value: "CONGE_MATERNITE", label: "Congé de maternité" },
  { value: "ARRET_MALADIE", label: "Arrêt maladie" },
  { value: "PERMISSION", label: "Permission" },
  { value: "ATTESTATION", label: "Attestation" },
  { value: "CERTIFICAT", label: "Certificat" },
  { value: "AUTRE", label: "Autre" }
]

export function DemandeForm({ onClose, onSuccess, editDemande }: DemandeFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    titre: "",
    motif: "",
    dateDebut: "",
    dateFin: ""
  })

  const isEditing = !!editDemande

  useEffect(() => {
    if (editDemande) {
      setFormData({
        type: editDemande.type,
        titre: editDemande.titre,
        motif: editDemande.motif || "",
        dateDebut: editDemande.dateDebut ? new Date(editDemande.dateDebut).toISOString().split('T')[0] : "",
        dateFin: editDemande.dateFin ? new Date(editDemande.dateFin).toISOString().split('T')[0] : ""
      })
    }
  }, [editDemande])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing && editDemande) {
        // Update existing demande
        const response = await fetch(`/api/demandes/${editDemande.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "MODIFIER",
            type: formData.type,
            titre: formData.titre,
            motif: formData.motif,
            dateDebut: formData.dateDebut || null,
            dateFin: formData.dateFin || null
          })
        })

        if (response.ok) {
          onSuccess()
        } else {
          const data = await response.json()
          console.error("Erreur modification:", data.error)
        }
      } else {
        // Create new demande
        const response = await fetch("/api/demandes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })

        if (response.ok) {
          onSuccess()
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-3xl border-gray-100 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {isEditing ? "Modifier la demande" : "Nouvelle demande"}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-semibold text-gray-700">Type de demande *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-ivorange-500">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {typesDemande.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titre" className="text-sm font-semibold text-gray-700">Titre / Objet *</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              placeholder="Ex: Demande d'attestation de travail"
              required
              className="h-12 rounded-xl border-gray-200 focus:border-ivorange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motif" className="text-sm font-semibold text-gray-700">Motif / Description</Label>
            <Textarea
              id="motif"
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              placeholder="Décrivez le motif de votre demande..."
              rows={3}
              className="rounded-xl border-gray-200 focus:border-ivorange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut" className="text-sm font-semibold text-gray-700">Date de début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="h-12 rounded-xl border-gray-200 focus:border-ivorange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFin" className="text-sm font-semibold text-gray-700">Date de fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="h-12 rounded-xl border-gray-200 focus:border-ivorange-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12 rounded-xl bg-ivorange-500 hover:bg-ivorange-600 text-white shadow-lg shadow-ivorange-500/25"
              disabled={loading || !formData.type || !formData.titre}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Modification..." : "Soumission..."}
                </>
              ) : (
                isEditing ? "Enregistrer" : "Soumettre"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
