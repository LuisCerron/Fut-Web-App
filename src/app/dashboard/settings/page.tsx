"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Mail,
  Smartphone,
  Lock,
  UserCog,
  Building2,
  Construction
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Administra la configuración de la academia y tu cuenta
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Construction className="h-3 w-3" />
          En desarrollo
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apariencia
              </CardTitle>
              <CardDescription>
                Personaliza la apariencia de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema de la aplicación</Label>
                  <p className="text-sm text-muted-foreground">
                    Alterna entre modo claro y oscuro
                  </p>
                </div>
                <ModeToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animaciones</Label>
                  <p className="text-sm text-muted-foreground">
                    Activar transiciones y animaciones
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Configura cómo recibir alertas y notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Notificaciones por email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibir actualizaciones por correo
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Notificaciones push</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas en tiempo real
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Recordatorios de pago</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas de pagos pendientes
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Configuraciones de seguridad de la cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Autenticación de dos factores</Label>
                    <p className="text-sm text-muted-foreground">
                      Añade una capa extra de seguridad
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Configurar
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cambiar contraseña</Label>
                  <p className="text-sm text-muted-foreground">
                    Actualiza tu contraseña de acceso
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Cambiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Academy Settings (Admin only) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Configuración de la Academia
                <Badge variant="outline" className="ml-2">Admin</Badge>
              </CardTitle>
              <CardDescription>
                Configuraciones generales de la academia (solo administradores)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Información de la academia</Label>
                    <p className="text-sm text-muted-foreground">
                      Nombre, logo y datos de contacto
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Editar
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Roles y permisos</Label>
                    <p className="text-sm text-muted-foreground">
                      Gestionar permisos de usuarios
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Gestionar
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Exportar datos</Label>
                    <p className="text-sm text-muted-foreground">
                      Descargar backup de la información
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado del sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Versión</span>
                <Badge variant="secondary">v1.0.0-beta</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Entorno</span>
                <Badge variant="outline">Desarrollo</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API</span>
                <Badge className="bg-yellow-500">Mock Data</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">Próximamente</CardTitle>
              <CardDescription>
                Funciones en desarrollo para futuras versiones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Integración con API real
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Sistema de facturación
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Calendario de entrenamientos
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Módulo de comunicaciones
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Reportes y estadísticas
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
