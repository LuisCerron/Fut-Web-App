"use client";

import { useEffect, useState } from "react";
import { PlayerMatchStats, Player, Match } from "@/modules/core/types/db.types";
import { matchesService } from "@/modules/matches/services/matches.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PlayerStatsTrackerProps {
  match: Match;
}

interface PlayerStatsData {
  player: Player;
  stats: Partial<PlayerMatchStats>;
}

export function PlayerStatsTracker({ match }: PlayerStatsTrackerProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [match.id, match.home_team_id, match.away_team_id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allPlayers, matchStats] = await Promise.all([
        sportsService.getPlayers(),
        matchesService.getPlayerMatchStatsForMatch(match.id),
      ]);
      
      const teamPlayers = allPlayers.filter(p => p.team_id === match.home_team_id || p.team_id === match.away_team_id);

      const initialPlayerStats = teamPlayers.map(player => {
        const stats = matchStats.find(s => s.player_id === player.id) || {
          match_id: match.id,
          player_id: player.id,
          is_starter: false,
          goals: 0,
          assists: 0,
          yellow_cards: 0,
          red_cards: 0,
          shots: 0,
          shots_on_goal: 0,
          fouls_committed: 0,
          fouls_received: 0,
          offsides: 0,
          penalties_committed: 0,
          penalties_received: 0,
          recoveries: 0,
          completed_passes: 0,
          total_passes: 0,
        };
        return { player, stats };
      });
      
      setPlayerStats(initialPlayerStats);

    } catch (error) {
      console.error("Error loading player stats data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatChange = (playerId: string, field: keyof Partial<PlayerMatchStats>, value: any) => {
    setPlayerStats(prev => prev.map(ps => 
      ps.player.id === playerId 
        ? { ...ps, stats: { ...ps.stats, [field]: value } } 
        : ps
    ));
  };
  
  const handleSavePlayerStats = async () => {
    try {
      setSaving(true);
      const statsToSave = playerStats.map(ps => ps.stats);
      await matchesService.batchUpdatePlayerMatchStats(statsToSave);
      // Optionally, show a success message
    } catch (error) {
      console.error("Error saving player stats:", error);
      // Optionally, show an error message
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Cargando estadísticas de jugadores...</div>;
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Estadísticas de Jugadores</CardTitle>
        <Button onClick={handleSavePlayerStats} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Estadísticas"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-12 items-center gap-4 p-2 font-semibold text-sm text-muted-foreground">
            <div className="col-span-3">Jugador</div>
            <div className="col-span-1 text-center">Titular</div>
            <div className="col-span-1 text-center">MIN</div>
            <div className="col-span-1 text-center">GOL</div>
            <div className="col-span-1 text-center">AST</div>
            <div className="col-span-1 text-center">T.A.</div>
            <div className="col-span-1 text-center">T.R.</div>
            <div className="col-span-1 text-center">REM</div>
            <div className="col-span-2 text-center">Comentarios</div>
          </div>
          {playerStats.map(({ player, stats }) => (
            <div key={player.id} className="grid grid-cols-12 items-center gap-4 p-2 bg-muted/50 rounded-lg">
              <div className="col-span-3 flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{player.first_name?.[0]}{player.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <p className="font-semibold">{player.first_name} {player.last_name}</p>
              </div>
              <div className="col-span-1 text-center">
                <Checkbox
                  checked={stats.is_starter}
                  onCheckedChange={(checked) => handleStatChange(player.id, 'is_starter', checked === true)}
                />
              </div>
              <Input
                type="number"
                value={stats.minutes_played ?? ''}
                onChange={(e) => handleStatChange(player.id, 'minutes_played', e.target.value ? parseInt(e.target.value) : undefined)}
                className="col-span-1"
                placeholder="MIN"
              />
              <Input
                type="number"
                value={stats.goals ?? 0}
                onChange={(e) => handleStatChange(player.id, 'goals', parseInt(e.target.value))}
                className="col-span-1"
              />
              <Input
                type="number"
                value={stats.assists ?? 0}
                onChange={(e) => handleStatChange(player.id, 'assists', parseInt(e.target.value))}
                className="col-span-1"
              />
              <Input
                type="number"
                value={stats.yellow_cards ?? 0}
                onChange={(e) => handleStatChange(player.id, 'yellow_cards', parseInt(e.target.value))}
                className="col-span-1"
              />
              <Input
                type="number"
                value={stats.red_cards ?? 0}
                onChange={(e) => handleStatChange(player.id, 'red_cards', parseInt(e.target.value))}
                className="col-span-1"
              />
              <Input
                type="number"
                value={stats.shots ?? 0}
                onChange={(e) => handleStatChange(player.id, 'shots', parseInt(e.target.value))}
                className="col-span-1"
              />
              <Input
                type="text"
                value={stats.performance_comments ?? ''}
                onChange={(e) => handleStatChange(player.id, 'performance_comments', e.target.value)}
                placeholder="Comentarios..."
                className="col-span-2"
              />
            </div>
          ))}
          {playerStats.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay jugadores en los equipos de este partido.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
