"use client";

import { useState, useEffect } from "react";
import { Match, MatchEvent, Player } from "@/modules/core/types/db.types";
import { matchesService } from "@/modules/matches/services/matches.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

interface MatchEventsLogProps {
  match: Match;
}

export function MatchEventsLog({ match }: MatchEventsLogProps) {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState<Partial<MatchEvent>>({
    minute: 0,
    event_type: "Gol",
    team: "Local",
    is_decisive: false,
  });

  useEffect(() => {
    loadData();
  }, [match.id]);

  const loadData = async () => {
    setLoading(true);
    const [eventsData, playersData] = await Promise.all([
      matchesService.getMatchEvents(match.id),
      sportsService.getPlayers(),
    ]);
    setEvents(eventsData.sort((a, b) => b.minute - a.minute));
    setPlayers(playersData);
    setLoading(false);
  };

  const handleAddEvent = async () => {
    if (!newEvent.minute || !newEvent.event_type) return;
    
    await matchesService.createMatchEvent({
      ...newEvent,
      match_id: match.id,
    });
    
    setNewEvent({
      minute: 0,
      event_type: "Gol",
      team: "Local",
      is_decisive: false,
      description: "",
    });
    loadData();
  };

  const handleDeleteEvent = async (id: string) => {
    await matchesService.deleteMatchEvent(id);
    loadData();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eventos del Partido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border p-4 rounded-md">
          <div className="space-y-1">
            <Label>Minuto</Label>
            <Input 
              type="number" 
              value={newEvent.minute} 
              onChange={(e) => setNewEvent({...newEvent, minute: parseInt(e.target.value)})} 
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label>Tipo</Label>
            <Select 
              value={newEvent.event_type} 
              onValueChange={(val: any) => setNewEvent({...newEvent, event_type: val})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gol">Gol</SelectItem>
                <SelectItem value="Tarjeta_Amarilla">Tarjeta Amarilla</SelectItem>
                <SelectItem value="Tarjeta_Roja">Tarjeta Roja</SelectItem>
                <SelectItem value="Cambio">Cambio</SelectItem>
                <SelectItem value="Falta">Falta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label>Descripción</Label>
            <Input 
              value={newEvent.description || ""} 
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
              placeholder="Detalles..."
            />
          </div>
          <Button onClick={handleAddEvent}><Plus className="h-4 w-4" /></Button>
        </div>

        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-2 border rounded hover:bg-accent">
              <div className="flex items-center gap-4">
                <span className="font-bold w-8 text-center">{event.minute}'</span>
                <span className="font-semibold w-32">{event.event_type.replace("_", " ")}</span>
                <span className="text-sm text-muted-foreground">{event.description}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {events.length === 0 && <p className="text-center text-muted-foreground py-4">No hay eventos registrados.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
