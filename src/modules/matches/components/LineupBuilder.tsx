"use client";

import { useState, useEffect } from "react";
import { Match, Lineup, Player } from "@/modules/core/types/db.types";
import { matchesService } from "@/modules/matches/services/matches.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LineupBuilderProps {
  match: Match;
}

export function LineupBuilder({ match }: LineupBuilderProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<Lineup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [match.id]);

  const loadData = async () => {
    setLoading(true);
    const [lineupData, playersData] = await Promise.all([
      matchesService.getMatchLineup(match.id),
      sportsService.getPlayers(),
    ]);
    setLineup(lineupData);
    setPlayers(playersData);
    setLoading(false);
  };

  const handleDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData("playerId", playerId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData("playerId");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    updateLineup(playerId, x, y);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateLineup = (playerId: string, x: number, y: number) => {
    setLineup(prev => {
      const existing = prev.find(l => l.player_id === playerId);
      if (existing) {
        return prev.map(l => l.player_id === playerId ? { ...l, position_x: x, position_y: y, role: "Titular" } : l);
      } else {
        return [...prev, {
          id: `temp-${Date.now()}`,
          match_id: match.id,
          player_id: playerId,
          role: "Titular",
          position_x: x,
          position_y: y,
          is_captain: false
        }];
      }
    });
  };

  const handleSave = async () => {
    await matchesService.saveMatchLineup(match.id, lineup);
    alert("Alineación guardada");
  };

  const getPlayer = (id: string) => players.find(p => p.id === id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Campo de Juego (Arrastrar y Soltar)</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="relative w-full aspect-[2/3] bg-green-600 rounded-lg border-2 border-white overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="absolute top-0 left-1/4 w-1/2 h-1/6 border-2 border-white border-t-0"></div>
            <div className="absolute bottom-0 left-1/4 w-1/2 h-1/6 border-2 border-white border-b-0"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/50"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

            {lineup.map((l) => {
              const player = getPlayer(l.player_id);
              if (!player || l.position_x === undefined || l.position_y === undefined) return null;
              return (
                <div
                  key={l.player_id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-move"
                  style={{ left: `${l.position_x}%`, top: `${l.position_y}%` }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, l.player_id)}
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-xs border-2 border-black">
                    {player.jersey_number || "?"}
                  </div>
                  <span className="text-xs text-white font-bold bg-black/50 px-1 rounded mt-1 whitespace-nowrap">
                    {player.last_name}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave}>Guardar Alineación</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jugadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {players.map((player) => (
              <div 
                key={player.id} 
                className="flex items-center gap-2 p-2 border rounded cursor-grab active:cursor-grabbing hover:bg-accent"
                draggable
                onDragStart={(e) => handleDragStart(e, player.id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.photo_url} />
                  <AvatarFallback>{player.first_name?.[0]}{player.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{player.first_name} {player.last_name}</p>
                  <p className="text-xs text-muted-foreground">#{player.jersey_number} - {player.position_primary_id ? "Pos" : "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
