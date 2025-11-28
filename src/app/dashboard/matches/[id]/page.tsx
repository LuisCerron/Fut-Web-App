"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Match, Team, Competition } from "@/modules/core/types/db.types";
import { matchesService } from "@/modules/matches/services/matches.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { PlayerStatsTracker } from "@/modules/matches/components/PlayerStatsTracker";
import { MatchEventsLog } from "@/modules/matches/components/MatchEventsLog";
import { LineupBuilder } from "@/modules/matches/components/LineupBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [match, setMatch] = useState<Match | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id !== "string") return;
    
    const loadMatchDetails = async () => {
      try {
        setLoading(true);
        const matchData = await matchesService.getMatchById(id);

        if (!matchData) {
          setError("Partido no encontrado");
          return;
        }
        setMatch(matchData);

        const [teamsData, competitionsData] = await Promise.all([
          sportsService.getTeams(),
          matchesService.getCompetitions(),
        ]);
        
        setHomeTeam(teamsData.find(t => t.id === matchData.home_team_id) || null);
        setAwayTeam(teamsData.find(t => t.id === matchData.away_team_id) || null);
        
        if (matchData.competition_id) {
          setCompetition(competitionsData.find(c => c.id === matchData.competition_id) || null);
        }

      } catch (err) {
        console.error("Error loading match details:", err);
        setError("Error al cargar los detalles del partido.");
      } finally {
        setLoading(false);
      }
    };

    loadMatchDetails();
  }, [id]);

  if (loading) {
    return <div>Cargando detalles del partido...</div>;
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

  if (!match) {
    return null; // or a 'not found' component
  }

  const getStatusBadgeVariant = (status: Match["status"]) => {
    switch (status) {
      case "Programado": return "secondary";
      case "En Juego": case "Medio Tiempo": return "default";
      case "Finalizado": return "outline";
      case "Suspendido": case "Aplazado": return "destructive";
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
            {homeTeam?.name || "N/A"} vs {awayTeam?.name || "N/A"}
          </h1>
          <p className="text-muted-foreground">
            {competition?.name || "Amistoso"} - Jornada {match.round_number || "-"}
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="lineup">Alineación</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Partido</CardTitle>
              <CardDescription>Detalles del partido programado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold">Resultado</span>
                  <span className="text-2xl font-bold text-primary">{match.home_goals} - {match.away_goals}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Estado</span>
                  <Badge variant={getStatusBadgeVariant(match.status)}>{match.status}</Badge>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Árbitro</span>
                  <span className="text-muted-foreground">{match.main_referee || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <PlayerStatsTracker match={match} />
        </TabsContent>

        <TabsContent value="lineup">
          <LineupBuilder match={match} />
        </TabsContent>

        <TabsContent value="events">
          <MatchEventsLog match={match} />
        </TabsContent>
      </Tabs>

    </div>
  );
}
