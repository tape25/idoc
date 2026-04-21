"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell, Check, FileText } from "lucide-react"

interface Notification {
  id: string
  titre: string
  message: string
  lue: boolean
  createdAt: string
  demande?: {
    numeroEnregistrement: string | null
    type: string
    titre: string
  }
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [nonLues, setNonLues] = useState(0)
  const [open, setOpen] = useState(false)
  const hasFetchedRef = useRef(false)

  // Fetch notifications function
  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      setNotifications(data.notifications || [])
      setNonLues(data.nonLues || 0)
    } catch (error) {
      console.error("Erreur notifications:", error)
    }
  }

  // Initial load and interval - only run once
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true
      // Schedule the fetch for after the effect completes
      const timeoutId = setTimeout(loadNotifications, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [])

  // Set up refresh interval separately
  useEffect(() => {
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const markAsRead = async (notificationId?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          notificationId,
          toutLire: !notificationId 
        })
      })
      loadNotifications()
    } catch (error) {
      console.error("Erreur marquage notification:", error)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-600 relative">
          <Bell className="h-5 w-5" />
          {nonLues > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {nonLues > 9 ? "9+" : nonLues}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Notifications</h4>
          {nonLues > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAsRead()}
              className="text-xs text-emerald-600"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm">
            Aucune notification
          </p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg border ${notif.lue ? "bg-gray-50" : "bg-emerald-50 border-emerald-200"}`}
              >
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-emerald-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notif.titre}</p>
                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  {!notif.lue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notif.id)}
                      className="shrink-0"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
