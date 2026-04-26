"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Plus, Edit2, Settings } from "lucide-react"

interface Parametre {
  id: string
  cle: string
  valeur: string
  description: string | null
}

export function SettingsPanel() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role

  const [parametres, setParametres] = useState<Parametre[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingParam, setEditingParam] = useState<Parametre | null>(null)
  
  const [formData, setFormData] = useState({
    cle: "",
    valeur: "",
    description: ""
  })

  useEffect(() => {
    fetchParametres()
  }, [])

  const fetchParametres = async () => {
    try {
      const res = await fetch("/api/parametres")
      const data = await res.json()
      if (data.parametres) {
        setParametres(data.parametres)
      }
    } catch (error) {
      console.error("Erreur chargement parametres:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (param: Parametre | null = null) => {
    if (param) {
      setEditingParam(param)
      setFormData({
        cle: param.cle,
        valeur: param.valeur,
        description: param.description || ""
      })
    } else {
      setEditingParam(null)
      setFormData({ cle: "", valeur: "", description: "" })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingParam ? `/api/parametres/${editingParam.id}` : "/api/parametres"
    const method = editingParam ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setShowModal(false)
        fetchParametres()
      } else {
        const error = await res.json()
        alert(error.error || "Une erreur est survenue")
      }
    } catch (error) {
      alert("Erreur lors de la sauvegarde")
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Paramètres Système</h2>
            <p className="text-sm text-gray-500">Configuration globale de l'application</p>
          </div>
        </div>
        {userRole === "ADMIN" && (
          <Button onClick={() => handleOpenModal()} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" /> Nouveau Paramètre
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Clé</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Description</TableHead>
              {userRole === "ADMIN" && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {parametres.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium font-mono text-xs">{p.cle}</TableCell>
                <TableCell>{p.valeur}</TableCell>
                <TableCell className="text-gray-500">{p.description}</TableCell>
                {userRole === "ADMIN" && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(p)}>
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {parametres.length === 0 && (
              <TableRow>
                <TableCell colSpan={userRole === "ADMIN" ? 4 : 3} className="text-center py-8 text-gray-500">
                  Aucun paramètre configuré
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingParam ? "Modifier le paramètre" : "Nouveau paramètre"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Clé (Identifiant unique)</Label>
              <Input 
                required 
                disabled={!!editingParam}
                value={formData.cle} 
                onChange={e => setFormData({...formData, cle: e.target.value})} 
                placeholder="ex: MAX_FILE_SIZE"
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Valeur</Label>
              <Input 
                required 
                value={formData.valeur} 
                onChange={e => setFormData({...formData, valeur: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button type="submit" className="bg-emerald-600">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
