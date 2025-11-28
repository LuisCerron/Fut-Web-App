"use client";

import { useEffect, useState } from "react";
import { PlayerLoad, Player, Session } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlayerLoadTrackerProps {
  session: Session;
}

interface PlayerLoadData {
  player: Player;
  load: Partial<PlayerLoad>;
}

export function PlayerLoadTracker({ session }: PlayerLoadTrackerProps) {
  const [playerLoads, setPlayerLoads] = useState<PlayerLoadData[]>([]);
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
      const [teamPlayers, sessionLoads] = await Promise.all([
        sportsService.getPlayers().then(p => p.filter(player => player.team_id === session.team_id)),
        sessionsService.getPlayerLoadsForSession(session.id),
      ]);

      const initialPlayerLoads = teamPlayers.map(player => {
        const load = sessionLoads.find(pl => pl.player_id === player.id) || {
          session_id: session.id,
          player_id: player.id,
          rpe: 5, // Default RPE
        };
        return { player, load };
      });
      
      setPlayerLoads(initialPlayerLoads);

    } catch (error) {
      console.error("Error loading player load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadChange = (playerId: string, field: keyof Partial<PlayerLoad>, value: any) => {
    setPlayerLoads(prev => prev.map(pl => 
      pl.player.id === playerId 
        ? { ...pl, load: { ...pl.load, [field]: value } } 
        : pl
    ));
  };
  
  const handleSavePlayerLoads = async () => {
    try {
      setSaving(true);
      const loadsToSave = playerLoads.map(pl => pl.load);
      await sessionsService.batchUpdatePlayerLoads(loadsToSave);
      // Optionally, show a success message
    } catch (error) {
      console.error("Error saving player loads:", error);
      // Optionally, show an error message
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Cargando Carga de Jugadores...</div>;
  }
  
  if (!session.team_id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registro de Carga de Jugadores</CardTitle>
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
        <CardTitle>Registro de Carga de Jugadores</CardTitle>
        <Button onClick={handleSavePlayerLoads} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cargas"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {playerLoads.map(({ player, load }) => (
            <div key={player.id} className="grid grid-cols-6 items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="col-span-2 flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{player.first_name?.[0]}{player.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{player.first_name} {player.last_name}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`duration-${player.id}`}>Duración (min)</Label>
                <Input
                  id={`duration-${player.id}`}
                  type="number"
                  value={load.real_duration_min ?? ''}
                  onChange={(e) => handleLoadChange(player.id, 'real_duration_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="min"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`rpe-${player.id}`}>RPE (1-10)</Label>
                <Input
                  id={`rpe-${player.id}`}
                  type="number"
                  value={load.rpe ?? 5}
                  onChange={(e) => handleLoadChange(player.id, 'rpe', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`distance-${player.id}`}>Distancia (km)</Label>
                <Input
                  id={`distance-${player.id}`}
                  type="number"
                  value={load.total_distance_km ?? ''}
                  onChange={(e) => handleLoadChange(player.id, 'total_distance_km', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="km"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`hr-${player.id}`}>FC Media</Label>
                <Input
                  id={`hr-${player.id}`}
                  type="number"
                  value={load.avg_heart_rate ?? ''}
                  onChange={(e) => handleLoadChange(player.id, 'avg_heart_rate', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="lpm"
                />
              </div>
            </div>
          ))}
          {playerLoads.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay jugadores en este equipo.</p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Gráfico de Carga (Duración x RPE)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={playerLoads.map(pl => ({
                name: `${pl.player.first_name} ${pl.player.last_name?.[0]}.`,
                load: (pl.load.real_duration_min || 0) * (pl.load.rpe || 0),
                rpe: pl.load.rpe || 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="load" fill="#8884d8" name="Carga Calculada" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
