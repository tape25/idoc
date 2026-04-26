"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Briefcase, Hash, ShieldCheck, Loader2 } from "lucide-react"

export function ProfilePanel() {
  const { data: session } = useSession()
  const user = session?.user as any

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, password: newPassword })
      })

      if (res.ok) {
        alert("Mot de passe modifié avec succès")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const error = await res.json()
        alert(error.error || "Erreur lors de la modification")
      }
    } catch (error) {
      alert("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Informations Personnelles */}
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader className="bg-emerald-50/50 pb-4 border-b">
          <CardTitle className="text-emerald-800 flex items-center">
            <User className="mr-2 h-5 w-5" /> Informations Personnelles
          </CardTitle>
          <CardDescription>Vos informations telles qu'elles apparaissent dans le système</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-3 border-b pb-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Nom complet</p>
              <p className="text-base text-gray-900">{user.prenom} {user.nom}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-b pb-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b pb-3">
            <ShieldCheck className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Rôle d'accès</p>
              <p className="text-base text-gray-900">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b pb-3">
            <Briefcase className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Service</p>
              <p className="text-base text-gray-900">{user.service || "Non renseigné"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Matricule</p>
              <p className="text-base text-gray-900">{user.matricule || "Non renseigné"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changer de mot de passe */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="bg-gray-50 pb-4 border-b">
          <CardTitle className="text-gray-800">Changer de mot de passe</CardTitle>
          <CardDescription>Assurez-vous d'utiliser un mot de passe sécurisé</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <Input 
                type="password" 
                required 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input 
                type="password" 
                required 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Confirmer le nouveau mot de passe</Label>
              <Input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Mettre à jour le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
