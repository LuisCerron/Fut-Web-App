"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Session, Team, User } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { usersService } from "@/modules/users/services/users.service";
import { SessionTaskList } from "@/modules/sessions/components/SessionTaskList";
import { AttendanceTracker } from "@/modules/sessions/components/AttendanceTracker";
import { PlayerLoadTracker } from "@/modules/sessions/components/PlayerLoadTracker";
import { DelegateSessionDialog } from "@/modules/sessions/components/DelegateSessionDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [session, setSession] = useState<Session | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [responsibleUser, setResponsibleUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id !== "string") return;
    
    const loadSessionDetails = async () => {
      try {
        setLoading(true);
        const sessionData = await sessionsService.getSessionById(id);

        if (!sessionData) {
          setError("Sesión no encontrada");
          return;
        }
        setSession(sessionData);

        if (sessionData.team_id) {
          const teamData = await sportsService.getTeams().then(teams => teams.find(t => t.id === sessionData.team_id));
          setTeam(teamData || null);
        }

        if (sessionData.responsible_user_id) {
          const userData = await usersService.getUserById(sessionData.responsible_user_id);
          setResponsibleUser(userData || null);
        }

      } catch (err) {
        console.error("Error loading session details:", err);
        setError("Error al cargar los detalles de la sesión.");
      } finally {
        setLoading(false);
      }
    };

    loadSessionDetails();
  }, [id]);

  if (loading) {
    return <div>Cargando detalles de la sesión...</div>;
  }

  if (error) {
    return (
      <div>
        <p className="text-destructive">{error}</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>
    );
  }

  if (!session) {
    return null; // or a 'not found' component
  }

  const getStatusBadgeVariant = (status: Session["status"]) => {
    switch (status) {
      case "Planificada": return "secondary";
      case "En Curso": return "default";
      case "Completada": return "outline";
      case "Cancelada": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {session.session_type}: {new Date(session.start_time).toLocaleDateString()}
          </h1>
          <p className="text-muted-foreground">
            Gestiona los detalles y tareas de la sesión.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Detalles de la sesión planificada.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="font-semibold">Equipo</span>
              <span className="text-muted-foreground">{team?.name || "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Lugar</span>
              <span className="text-muted-foreground">{session.location || "-"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Responsable</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{responsibleUser?.full_name || "N/A"}</span>
                <DelegateSessionDialog 
                  session={session} 
                  onSessionUpdated={(updatedSession) => {
                    setSession(updatedSession);
                    // Refresh responsible user name if needed, or just rely on the updated session ID to trigger a refetch if we were using SWR/React Query. 
                    // Since we are using local state for responsibleUser, we might need to reload the user details.
                    // For simplicity, we'll just reload the page or re-fetch details.
                    window.location.reload(); 
                  }} 
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Inicio</span>
              <span className="text-muted-foreground">{new Date(session.start_time).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Fin</span>
              <span className="text-muted-foreground">{new Date(session.end_time).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Estado</span>
              <Badge variant={getStatusBadgeVariant(session.status)}>{session.status}</Badge>
            </div>
          </div>
          {session.description && (
            <div className="flex flex-col">
              <span className="font-semibold">Descripción</span>
              <p className="text-muted-foreground">{session.description}</p>
            </div>
          )}
          {session.objectives && (
            <div className="flex flex-col">
              <span className="font-semibold">Objetivos</span>
              <p className="text-muted-foreground">{session.objectives}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <SessionTaskList sessionId={session.id} />
      
      <AttendanceTracker session={session} />
      
      <PlayerLoadTracker session={session} />

    </div>
  );
}
