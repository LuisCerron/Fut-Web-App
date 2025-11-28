"use client";

import { useState, useEffect } from "react";
import { Match, Team, Competition, MatchCompetitionType, MatchStatus } from "@/modules/core/types/db.types";
import { matchesService } from "@/modules/matches/services/matches.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SELECT_NONE_VALUE,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

interface CreateMatchDialogProps {
  onMatchCreated: (match: Match) => void;
}

export function CreateMatchDialog({ onMatchCreated }: CreateMatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [roundNumber, setRoundNumber] = useState("");
  const [competitionType, setCompetitionType] = useState<MatchCompetitionType>("Liga");
  const [status, setStatus] = useState<MatchStatus>("Programado");
  const [sessionId, setSessionId] = useState("");

  // Data for selects
  const [teams, setTeams] = useState<Team[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    if (open) {
      loadDependencies();
    }
  }, [open]);

  const loadDependencies = async () => {
    try {
      const [teamsData, competitionsData] = await Promise.all([
        sportsService.getTeams(),
        matchesService.getCompetitions(),
      ]);
      setTeams(teamsData);
      setCompetitions(competitionsData);
    } catch (error) {
      console.error("Error loading dependencies:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newMatch = await matchesService.createMatch({
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        competition_id: competitionId,
        round_number: parseInt(roundNumber),
        competition_type: competitionType,
        status,
        session_id: sessionId,
      });
      onMatchCreated(newMatch);
      setOpen(false);
      // Reset form
      setHomeTeamId("");
      setAwayTeamId("");
      setCompetitionId("");
      setRoundNumber("");
      setCompetitionType("Liga");
      setStatus("Programado");
      setSessionId("");
    } catch (error) {
      console.error("Error creating match:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Partido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Programar Partido</DialogTitle>
          <DialogDescription>
            Registra un nuevo partido en el calendario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeam">Equipo Local</Label>
                <Select value={homeTeamId} onValueChange={setHomeTeamId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayTeam">Equipo Visitante</Label>
                <Select value={awayTeamId} onValueChange={setAwayTeamId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="competition">Competición</Label>
              <Select
                value={competitionId}
                onValueChange={(v) => setCompetitionId(v === SELECT_NONE_VALUE ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar competición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_NONE_VALUE}>Amistoso</SelectItem>
                  {competitions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roundNumber">Jornada</Label>
              <Input
                id="roundNumber"
                type="number"
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
                placeholder="Ej: 1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Partido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
