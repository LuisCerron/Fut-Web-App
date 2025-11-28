"use client";

import { useEffect, useState } from "react";
import { Attendance, Player, AttendanceStatus, Session } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AttendanceTrackerProps {
  session: Session;
}

interface PlayerAttendance {
  player: Player;
  attendance: Partial<Attendance>;
}

export function AttendanceTracker({ session }: AttendanceTrackerProps) {
  const [playerAttendances, setPlayerAttendances] = useState<PlayerAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [session.id, session.team_id]);

  const loadData = async () => {
    if (!session.team_id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [teamPlayers, sessionAttendances] = await Promise.all([
        sportsService.getPlayers().then(p => p.filter(player => player.team_id === session.team_id)),
        sessionsService.getAttendancesForSession(session.id),
      ]);

      const initialPlayerAttendances = teamPlayers.map(player => {
        const attendance = sessionAttendances.find(att => att.player_id === player.id) || {
          session_id: session.id,
          player_id: player.id,
          status: "Presente",
        };
        return { player, attendance };
      });
      
      setPlayerAttendances(initialPlayerAttendances);

    } catch (error) {
      console.error("Error loading attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (playerId: string, status: AttendanceStatus) => {
    setPlayerAttendances(prev => prev.map(pa => 
      pa.player.id === playerId 
        ? { ...pa, attendance: { ...pa.attendance, status: status } } 
        : pa
    ));
  };
  
  const handleSaveAttendances = async () => {
    try {
      setSaving(true);
      const attendancesToSave = playerAttendances.map(pa => pa.attendance);
      await sessionsService.batchUpdateAttendances(attendancesToSave);
      // Optionally, show a success message
    } catch (error) {
      console.error("Error saving attendances:", error);
      // Optionally, show an error message
    } finally {
      setSaving(false);
    }
  };

  const notifyParent = (player: Player) => {
    // Simulation of notification
    alert(`Notificación enviada a los padres de ${player.first_name} ${player.last_name} por ausencia.`);
  };

  if (loading) {
    return <div>Cargando lista de asistencia...</div>;
  }
  
  if (!session.team_id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Control de Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Esta sesión no está asignada a un equipo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Control de Asistencia</CardTitle>
        <Button onClick={handleSaveAttendances} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Asistencias"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {playerAttendances.map(({ player, attendance }) => (
            <div key={player.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{player.first_name?.[0]}{player.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{player.first_name} {player.last_name}</p>
                  <p className="text-sm text-muted-foreground">Dorsal: {player.jersey_number || "-"}</p>
                </div>
              </div>
              <RadioGroup
                value={attendance.status}
                onValueChange={(value: string) => handleStatusChange(player.id, value as AttendanceStatus)}
                className="flex items-center gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Presente" id={`presente-${player.id}`} />
                  <Label htmlFor={`presente-${player.id}`}>Presente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ausente" id={`ausente-${player.id}`} />
                  <Label htmlFor={`ausente-${player.id}`}>Ausente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Justificado" id={`justificado-${player.id}`} />
                  <Label htmlFor={`justificado-${player.id}`}>Justificado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Tardanza" id={`tardanza-${player.id}`} />
                  <Label htmlFor={`tardanza-${player.id}`}>Tardanza</Label>
                </div>
              </RadioGroup>
              {attendance.status === "Ausente" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => notifyParent(player)}
                  className="ml-4 text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  Notificar Padres
                </Button>
              )}
            </div>
          ))}
          {playerAttendances.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay jugadores en este equipo.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
