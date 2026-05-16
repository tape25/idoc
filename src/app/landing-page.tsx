"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CheckSquare,
  FileText,
  LockKeyhole,
  ShieldCheck,
  TimerReset,
  User,
  Workflow,
} from "lucide-react"

export function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  const guideSteps = [
    {
      icon: LockKeyhole,
      title: "Connexion sécurisée",
      text: "Utilisez votre adresse email professionnelle et votre mot de passe pour accéder à votre espace.",
    },
    {
      icon: FileText,
      title: "Soumission d'une demande",
      text: "Créez un dossier RH, renseignez les informations nécessaires et joignez les pièces justificatives.",
    },
    {
      icon: Bell,
      title: "Suivi et notifications",
      text: "Consultez l'avancement de votre dossier et recevez les alertes importantes.",
    },
    {
      icon: CheckSquare,
      title: "Décision finale",
      text: "Téléchargez vos documents dès validation ou retrait disponible.",
    },
  ]

  const capabilities = [
    {
      icon: Workflow,
      title: "Circuit maîtrisé",
      text: "Chaque dossier suit un parcours clair entre courrier, secrétariat, DRH et agent.",
    },
    {
      icon: TimerReset,
      title: "Traitement plus rapide",
      text: "Les demandes prioritaires restent visibles et les statuts importants remontent immédiatement.",
    },
    {
      icon: ShieldCheck,
      title: "Données protégées",
      text: "Un espace réservé aux utilisateurs habilités, pensé pour les usages administratifs.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-gray-950 selection:bg-ivorange-500 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm">
              <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={34} height={34} className="rounded-md" />
              <Image src="/images/logo-ministere-sports.png" alt="Ministère des Sports" width={34} height={34} className="rounded-md" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-gray-950">Portail DSI RH</p>
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 sm:block">
                Ministère des Sports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="hidden rounded-lg font-semibold text-gray-600 hover:bg-gray-100 md:inline-flex">
                  Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto rounded-lg border-gray-200 bg-white p-6 shadow-2xl sm:max-w-[620px] sm:p-8">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-gray-950">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ivgreen-50 text-ivgreen-700">
                      <FileText className="h-5 w-5" />
                    </span>
                    Guide d'utilisation
                  </DialogTitle>
                  <DialogDescription className="pt-2 text-base leading-6 text-gray-500">
                    Les principales étapes pour utiliser le portail DRH Sports.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 grid gap-4">
                  {guideSteps.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <div key={step.title} className="flex gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-ivorange-600 shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Étape {index + 1}</p>
                          <h4 className="mt-1 font-bold text-gray-950">{step.title}</h4>
                          <p className="mt-1 text-sm leading-6 text-gray-600">{step.text}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={onLoginClick}
              className="rounded-lg bg-ivgreen-700 px-4 font-bold text-white shadow-sm hover:bg-ivgreen-800"
            >
              <User className="h-4 w-4" />
              Connexion
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden border-b border-gray-200 bg-white">
          <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
            <Image
              src="/illustration-login.png"
              alt="Interface RH numérique"
              fill
              priority
              className="object-contain object-right-bottom opacity-90"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_42%,rgba(255,255,255,0.88)_58%,rgba(255,255,255,0.18)_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-ivgreen-200 bg-ivgreen-50 px-3 py-2 text-sm font-bold text-ivgreen-800">
                <CheckCircle2 className="h-4 w-4" />
                Plateforme officielle DSI
              </div>
              <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
                Portail DSI RH
              </h1>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-gray-600">
                Une interface unique pour déposer, suivre et traiter les démarches administratives des agents du Ministère des Sports.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={onLoginClick}
                  size="lg"
                  className="h-12 rounded-lg bg-ivorange-500 px-6 text-base font-bold text-white shadow-lg shadow-ivorange-900/10 hover:bg-ivorange-600"
                >
                  Accéder à mon espace
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 rounded-lg border-gray-300 bg-white px-6 text-base font-bold text-gray-800 hover:bg-gray-50"
                    >
                      Voir le guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] w-[95vw] overflow-y-auto rounded-lg border-gray-200 bg-white p-6 shadow-2xl sm:max-w-[620px] sm:p-8">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-extrabold text-gray-950">Guide d'utilisation</DialogTitle>
                      <DialogDescription className="pt-2 text-base leading-6 text-gray-500">
                        Un parcours simple, du dépôt à la décision finale.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 grid gap-4">
                      {guideSteps.map((step, index) => {
                        const Icon = step.icon
                        return (
                          <div key={step.title} className="flex gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-ivgreen-700 shadow-sm">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Étape {index + 1}</p>
                              <h4 className="mt-1 font-bold text-gray-950">{step.title}</h4>
                              <p className="mt-1 text-sm leading-6 text-gray-600">{step.text}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-gray-200 border-y border-gray-200 py-5">
                <div className="pr-5">
                  <p className="text-2xl font-extrabold text-gray-950">100%</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Numérique</p>
                </div>
                <div className="px-5">
                  <p className="text-2xl font-extrabold text-gray-950">24/7</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Accès</p>
                </div>
                <div className="pl-5">
                  <p className="text-2xl font-extrabold text-gray-950">Multi</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Rôles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8f5] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ivorange-600">Conçu pour l'administration</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                Une expérience plus claire pour chaque rôle.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {capabilities.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-extrabold text-gray-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 bg-gray-950 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white p-1.5">
              <Image src="/images/logo-dsi-header.png" alt="Logo DSI" width={30} height={30} className="rounded-md" />
              <Image src="/images/logo-ministere-sports.png" alt="Ministère des Sports" width={30} height={30} className="rounded-md" />
            </div>
            <div>
              <p className="font-bold">DSI - Ministère des Sports</p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Côte d'Ivoire</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
