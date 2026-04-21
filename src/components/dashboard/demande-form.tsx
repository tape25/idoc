"use client"

import { useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Loader2 } from "lucide-react"

interface DemandeFormProps {
  onClose: () => void
  onSuccess: () => void
}

const typesDemande = [
  { value: "CONGE_MATERNITE", label: "Congé de maternité" },
  { value: "ARRET_MALADIE", label: "Arrêt maladie" },
  { value: "PERMISSION", label: "Permission" },
  { value: "ATTESTATION", label: "Attestation" },
  { value: "CERTIFICAT", label: "Certificat" },
  { value: "AUTRE", label: "Autre" }
]

export function DemandeForm({ onClose, onSuccess }: DemandeFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    titre: "",
    motif: "",
    dateDebut: "",
    dateFin: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erreur création demande:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Nouvelle demande</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de demande *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  {typesDemande.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titre">Titre / Objet *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Demande d'attestation de travail"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motif">Motif / Description</Label>
              <Textarea
                id="motif"
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                placeholder="Décrivez le motif de votre demande..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebut">Date de début</Label>
                <Input
                  id="dateDebut"
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFin">Date de fin</Label>
                <Input
                  id="dateFin"
                  type="date"
                  value={formData.dateFin}
                  onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={loading || !formData.type || !formData.titre}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Soumission...
                  </>
                ) : (
                  "Soumettre"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
