"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, ShieldAlert, Loader2, Search } from "lucide-react"

interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: string
  matricule: string | null
  service: string | null
  actif: boolean
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    role: "AGENT",
    matricule: "",
    service: "",
    actif: true
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        email: user.email,
        password: "", // on ne charge pas le mdp
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        matricule: user.matricule || "",
        service: user.service || "",
        actif: user.actif
      })
    } else {
      setEditingUser(null)
      setFormData({
        email: "",
        password: "",
        nom: "",
        prenom: "",
        role: "AGENT",
        matricule: "",
        service: "",
        actif: true
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
    const method = editingUser ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setShowModal(false)
        fetchUsers()
      } else {
        const error = await res.json()
        alert(error.error || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("Erreur sauvegarde utilisateur:", error)
      alert("Erreur lors de la sauvegarde")
    }
  }

  const filteredUsers = users.filter(u => 
    u.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
          <p className="text-sm text-gray-500">Ajoutez ou modifiez les comptes du personnel</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Nouvel Utilisateur
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4 max-w-sm">
          <Search className="h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Rechercher par nom ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Nom & Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Service / Matricule</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nom} {u.prenom}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{u.service || "-"}</div>
                    <div className="text-xs text-gray-500">{u.matricule || "-"}</div>
                  </TableCell>
                  <TableCell>
                    {u.actif ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Actif</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Inactif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(u)}>
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input required value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input required type="email" disabled={!!editingUser} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>{editingUser ? "Nouveau Mot de passe (laisser vide si inchangé)" : "Mot de passe"}</Label>
              <Input type="password" required={!editingUser} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AGENT">Agent</SelectItem>
                    <SelectItem value="SERVICE_COURRIER">Service Courrier</SelectItem>
                    <SelectItem value="SECRETARIAT_DRH">Secrétariat DRH</SelectItem>
                    <SelectItem value="DRH">DRH</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={formData.actif ? "true" : "false"} onValueChange={(v) => setFormData({...formData, actif: v === "true"})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Actif</SelectItem>
                    <SelectItem value="false">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service</Label>
                <Input value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Matricule</Label>
                <Input value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} />
              </div>
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
