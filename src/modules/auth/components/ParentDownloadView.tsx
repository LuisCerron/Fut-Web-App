"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "../context/AuthContext"
import { Smartphone, Download, Trophy, TrendingUp, Calendar, Bell, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ParentDownloadView() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  const features = [
    {
      icon: TrendingUp,
      title: "Progreso de tu hijo",
      description: "Visualiza estadísticas, evolución y rendimiento en tiempo real"
    },
    {
      icon: Calendar,
      title: "Calendario de eventos",
      description: "Mantente al día con entrenamientos, partidos y eventos especiales"
    },
    {
      icon: Bell,
      title: "Notificaciones",
      description: "Recibe alertas sobre asistencia, logros y comunicados importantes"
    },
    {
      icon: Trophy,
      title: "Logros y reconocimientos",
      description: "Celebra junto a tu hijo cada meta alcanzada y reconocimiento obtenido"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">FA</span>
            </div>
            <span className="font-semibold text-lg">Fútbol Academia</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hola, {user?.full_name || "Padre/Madre"}
            </span>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Smartphone className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              ¡Descarga nuestra App!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desbloquea todos los beneficios de tu academia y visualiza el progreso de tu hijo desde cualquier lugar
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Download Section */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Disponible para iOS y Android
              </h2>
              <p className="mb-8 opacity-90">
                Descarga la aplicación oficial de Fútbol Academia y mantente conectado con el desarrollo deportivo de tu hijo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="text-base"
                  onClick={() => window.open("https://apps.apple.com", "_blank")}
                >
                  <Download className="mr-2 h-5 w-5" />
                  App Store
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="text-base"
                  onClick={() => window.open("https://play.google.com", "_blank")}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Google Play
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="text-center mt-12 text-muted-foreground">
            <p>
              ¿Tienes preguntas? Contacta a la academia en{" "}
              <a href="mailto:soporte@academia.com" className="text-primary hover:underline">
                soporte@academia.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
