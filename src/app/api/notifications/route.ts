import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Récupérer les notifications de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      include: {
        demande: {
          select: {
            numeroEnregistrement: true,
            type: true,
            titre: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    })

    const nonLues = await db.notification.count({
      where: { userId: session.user.id, lue: false }
    })

    return NextResponse.json({ notifications, nonLues })
  } catch (error) {
    console.error("Erreur récupération notifications:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notifications" },
      { status: 500 }
    )
  }
}

// PUT - Marquer une notification comme lue
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, toutLire } = body

    if (toutLire) {
      await db.notification.updateMany({
        where: { userId: session.user.id, lue: false },
        data: { lue: true }
      })
      return NextResponse.json({ message: "Toutes les notifications marquées comme lues" })
    }

    if (notificationId) {
      await db.notification.update({
        where: { id: notificationId },
        data: { lue: true }
      })
      return NextResponse.json({ message: "Notification marquée comme lue" })
    }

    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 })
  } catch (error) {
    console.error("Erreur mise à jour notification:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la notification" },
      { status: 500 }
    )
  }
}
