"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import clsx from "clsx"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "../services/auth.service"
import { Loader2, LogIn } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [dni, setDni] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(dni, password)
      console.log("Login success:", response)
      authService.saveSession(response)
      router.push("/dashboard")
    } catch (err) {
      console.error("Login failed:", err)
      setError("Credenciales inválidas. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="w-full max-w-md"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card className="border-0 shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-2 text-center p-8">
          <CardTitle className="text-3xl font-bold">Bienvenido</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Ingresa para gestionar tu academia
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6 p-8">
            {error && (
              <motion.div
                className="flex items-center gap-2 p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                placeholder="Ingresa tu DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
                className="h-12 text-base transition-colors duration-300 focus:border-primary focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base transition-colors duration-300 focus:border-primary focus-visible:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              className={clsx(
                "w-full h-12 text-base font-bold transition-all duration-300",
                "focus-visible:ring-4 focus-visible:ring-primary/30",
                "hover:scale-[1.02] active:scale-[0.98]"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Ingresar
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        ¿Necesitas ayuda?{" "}
        <a
          href="mailto:soporte@academia.com"
          className="font-semibold text-primary hover:underline"
        >
          Contacta a soporte
        </a>
      </p>
    </motion.div>
  )
}
