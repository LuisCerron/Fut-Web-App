"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Player, Team, Position, User } from "@/modules/core/types/db.types"
import { sportsService } from "@/modules/sports/services/sports.service"
import { usersService } from "@/modules/users/services/users.service"
import { PlayerCard } from "@/components/ui/PlayerCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  User as UserIcon,
  Users,
  Shield,
  Shirt,
  Heart,
  AlertTriangle,
  CreditCard,
  Activity,
  Edit,
  TrendingUp,
  CheckCircle,
  XCircle,
  Ruler,
  Weight
} from "lucide-react"

interface PlayerDetailPageProps {
  playerId: string
}

export function PlayerDetailPage({ playerId }: PlayerDetailPageProps) {
  const router = useRouter()
  const [player, setPlayer] = React.useState<Player | null>(null)
  const [team, setTeam] = React.useState<Team | null>(null)
  const [primaryPosition, setPrimaryPosition] = React.useState<Position | null>(null)
  const [secondaryPosition, setSecondaryPosition] = React.useState<Position | null>(null)
  const [parent, setParent] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    loadPlayerData()
  }, [playerId])

  const loadPlayerData = async () => {
    setIsLoading(true)
    try {
      // Load player (sync)
      const playerData = sportsService.getPlayerById(playerId)
      if (!playerData) {
        router.push("/dashboard/players")
        return
      }
      setPlayer(playerData)

      // Load team
      if (playerData.team_id) {
        const teamData = sportsService.getTeamById(playerData.team_id)
        setTeam(teamData || null)
      }

      // Load positions
      if (playerData.position_primary_id) {
        const pos = sportsService.getPositionById(playerData.position_primary_id)
        setPrimaryPosition(pos || null)
      }
      if (playerData.position_secondary_id) {
        const pos = sportsService.getPositionById(playerData.position_secondary_id)
        setSecondaryPosition(pos || null)
      }

      // Load parent
      if (playerData.parent_user_id) {
        const parentData = await usersService.getUserById(playerData.parent_user_id)
        setParent(parentData || null)
      }
    } catch (error) {
      console.error("Error loading player data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificada"
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const getAge = (dateString?: string) => {
    if (!dateString) return "N/A"
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'AL_DIA': return 'bg-green-500/10 text-green-500'
      case 'PENDIENTE': return 'bg-yellow-500/10 text-yellow-500'
      case 'DESACTIVADO_POR_CUOTA': return 'bg-red-500/10 text-red-500'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getPaymentStatusLabel = (status?: string) => {
    switch (status) {
      case 'AL_DIA': return 'Al día'
      case 'PENDIENTE': return 'Pendiente'
      case 'DESACTIVADO_POR_CUOTA': return 'Desactivado'
      default: return 'No especificado'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="text-lg text-muted-foreground">Jugador no encontrado</p>
        <Button onClick={() => router.push("/dashboard/players")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a jugadores
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {player.first_name} {player.last_name}
            </h1>
            <p className="text-muted-foreground">
              Ficha completa del jugador
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/players/${playerId}/evolution`)}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Ver Evolución
          </Button>
          <Button onClick={() => router.push(`/dashboard/players/${playerId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Player Card */}
        <div className="flex justify-center lg:justify-start">
          <PlayerCard 
            player={player}
            positionName={primaryPosition?.name || "Jugador"}
            teamName={team?.name || "Sin equipo"}
          />
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center">
                <div className={`p-2 rounded-full ${player.is_active ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  {player.is_active ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <span className="text-sm font-medium mt-2">
                  {player.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center">
                <div className={`p-2 rounded-full ${getPaymentStatusColor(player.payment_status)}`}>
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium mt-2">
                  {getPaymentStatusLabel(player.payment_status)}
                </span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium mt-2">{getAge(player.birth_date)} años</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center">
                <div className="p-2 rounded-full bg-primary/10">
                  <Shirt className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium mt-2">#{player.jersey_number || 'N/A'}</span>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different info sections */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="sports">Deportivo</TabsTrigger>
              <TabsTrigger value="physical">Físico</TabsTrigger>
              <TabsTrigger value="contact">Contacto</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Nombre completo</label>
                      <p className="font-medium">{player.first_name} {player.last_name}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">DNI</label>
                      <p className="font-medium">{player.dni || "No especificado"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Fecha de nacimiento</label>
                      <p className="font-medium">{formatDate(player.birth_date)}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Edad</label>
                      <p className="font-medium">{getAge(player.birth_date)} años</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Categoría</label>
                      <Badge variant="outline">
                        {player.is_senior ? 'Senior' : 'Juvenil'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Fecha de registro</label>
                      <p className="font-medium">{formatDate(player.date_registered)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parent Info */}
              {parent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Padre/Tutor Asociado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Nombre</label>
                        <p className="font-medium">{parent.full_name || "No especificado"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Email</label>
                        <p className="font-medium">{parent.email}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Teléfono</label>
                        <p className="font-medium">{parent.phone || "No especificado"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">DNI</label>
                        <p className="font-medium">{parent.dni}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Sports Info Tab */}
            <TabsContent value="sports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Información Deportiva
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Equipo</label>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <p className="font-medium">{team?.name || "Sin equipo asignado"}</p>
                      </div>
                      {team && (
                        <p className="text-sm text-muted-foreground">{team.category}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Número de camiseta</label>
                      <p className="font-medium text-2xl text-primary">
                        #{player.jersey_number || "No asignado"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Pie dominante</label>
                      <p className="font-medium">
                        {player.dominant_foot === 'RIGHT' ? '🦶 Derecho' : 
                         player.dominant_foot === 'LEFT' ? '🦶 Izquierdo' : '🦶🦶 Ambidiestro'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Estado de pago</label>
                      <Badge 
                        variant={player.payment_status === 'AL_DIA' ? 'default' : 
                                 player.payment_status === 'PENDIENTE' ? 'secondary' : 'destructive'}
                      >
                        {getPaymentStatusLabel(player.payment_status)}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Posiciones</label>
                    <div className="flex flex-wrap gap-2">
                      {primaryPosition && (
                        <Badge variant="default" className="px-3 py-1">
                          {primaryPosition.abbreviation} - {primaryPosition.name} (Principal)
                        </Badge>
                      )}
                      {secondaryPosition && (
                        <Badge variant="outline" className="px-3 py-1">
                          {secondaryPosition.abbreviation} - {secondaryPosition.name} (Secundaria)
                        </Badge>
                      )}
                      {!primaryPosition && !secondaryPosition && (
                        <p className="text-muted-foreground italic">Sin posiciones asignadas</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Physical Info Tab */}
            <TabsContent value="physical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Información Física
                  </CardTitle>
                  <CardDescription>
                    Datos físicos y medidas del jugador
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Ruler className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Altura</p>
                        <p className="text-2xl font-bold">
                          {player.height_cm ? `${player.height_cm} cm` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Weight className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Peso</p>
                        <p className="text-2xl font-bold">
                          {player.weight_kg ? `${player.weight_kg} kg` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {player.height_cm && player.weight_kg && (
                    <>
                      <Separator />
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Índice de Masa Corporal (IMC)</p>
                        <p className="text-xl font-bold text-primary">
                          {(player.weight_kg / Math.pow(player.height_cm / 100, 2)).toFixed(1)}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Info Tab */}
            <TabsContent value="contact" className="space-y-4">
              {/* Emergency Contact */}
              <Card className="border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                    Contacto de Emergencia
                  </CardTitle>
                  <CardDescription>
                    Persona a contactar en caso de emergencia
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <p className="font-medium">{player.emergency_contact || "No especificado"}</p>
                  </div>
                  {player.emergency_contact && (
                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        En caso de emergencia durante entrenamientos o partidos, 
                        contactar inmediatamente a la persona indicada.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parent Contact */}
              {parent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contacto del Tutor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Email</label>
                        <p className="font-medium">{parent.email}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Teléfono</label>
                        <p className="font-medium">{parent.phone || "No especificado"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
