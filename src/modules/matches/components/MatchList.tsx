"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Match, Team, Competition, Session } from "@/modules/core/types/db.types";
import { matchesService } from "@/modules/matches/services/matches.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { Badge } from "@/components/ui/badge";
import { CreateMatchDialog } from "./CreateMatchDialog";
import { 
  Trash2, Swords, Calendar, Trophy, MapPin, Clock, 
  LayoutGrid, List, ChevronRight, Target, Award, 
  TrendingUp, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { format, isToday, isPast, isFuture } from "date-fns";
import { es } from "date-fns/locale";

const statusConfig: Record<string, { color: string; bg: string; dotClass: string }> = {
  Programado: { color: "text-blue-700", bg: "bg-blue-50", dotClass: "bg-blue-500" },
  "En Juego": { color: "text-green-700", bg: "bg-green-50", dotClass: "bg-green-500 animate-pulse" },
  "Medio Tiempo": { color: "text-amber-700", bg: "bg-amber-50", dotClass: "bg-amber-500 animate-pulse" },
  Finalizado: { color: "text-gray-600", bg: "bg-gray-100", dotClass: "bg-gray-400" },
  Suspendido: { color: "text-red-700", bg: "bg-red-50", dotClass: "bg-red-500" },
  Aplazado: { color: "text-orange-700", bg: "bg-orange-50", dotClass: "bg-orange-500" },
};

type ViewMode = "scoreboard" | "list";

export function MatchList() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [competitions, setCompetitions] = useState<Record<string, Competition>>({});
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("scoreboard");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [matchesData, teamsData, competitionsData, sessionsData] = await Promise.all([
        matchesService.getMatches(),
        sportsService.getTeams(),
        matchesService.getCompetitions(),
        sessionsService.getSessions(),
      ]);

      setMatches(matchesData);
      setTeams(teamsData.reduce((acc, t) => ({ ...acc, [t.id]: t }), {}));
      setCompetitions(competitionsData.reduce((acc, c) => ({ ...acc, [c.id]: c }), {}));
      setSessions(sessionsData.reduce((acc, s) => ({ ...acc, [s.id]: s }), {}));
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleMatchCreated = (newMatch: Match) => {
    setMatches([...matches, newMatch]);
    toast.success("Partido creado exitosamente");
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await matchesService.deleteMatch(id);
      setMatches(matches.filter((m) => m.id !== id));
      toast.success("Partido eliminado");
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.error("Error al eliminar el partido");
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/matches/${id}`);
  };

  const getMatchDate = (match: Match) => {
    const session = sessions[match.session_id];
    return session ? new Date(session.start_time) : new Date();
  };

  const getMatchLocation = (match: Match) => {
    const session = sessions[match.session_id];
    return session?.location || null;
  };

  // Stats
  const stats = useMemo(() => {
    const completed = matches.filter(m => m.status === "Finalizado");
    const homeWins = completed.filter(m => (m.home_goals ?? 0) > (m.away_goals ?? 0)).length;
    const awayWins = completed.filter(m => (m.away_goals ?? 0) > (m.home_goals ?? 0)).length;
    const draws = completed.filter(m => m.home_goals === m.away_goals).length;
    const totalGoals = completed.reduce((acc, m) => acc + (m.home_goals ?? 0) + (m.away_goals ?? 0), 0);

    return {
      total: matches.length,
      completed: completed.length,
      upcoming: matches.filter(m => m.status === "Programado").length,
      homeWins,
      awayWins,
      draws,
      avgGoals: completed.length > 0 ? (totalGoals / completed.length).toFixed(1) : "0",
    };
  }, [matches]);

  // Sorted matches
  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      const dateA = getMatchDate(a);
      const dateB = getMatchDate(b);
      // Show upcoming matches first, then by date
      if (isFuture(dateA) && isPast(dateB)) return -1;
      if (isPast(dateA) && isFuture(dateB)) return 1;
      return dateB.getTime() - dateA.getTime();
    });
  }, [matches, sessions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const MatchCard = ({ match, index }: { match: Match; index: number }) => {
    const status = statusConfig[match.status] || statusConfig.Programado;
    const homeTeam = teams[match.home_team_id];
    const awayTeam = teams[match.away_team_id];
    const competition = match.competition_id ? competitions[match.competition_id] : null;
    const matchDate = getMatchDate(match);
    const location = getMatchLocation(match);
    const isLive = match.status === "En Juego" || match.status === "Medio Tiempo";
    const isFinished = match.status === "Finalizado";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card 
          className={`group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 ${isLive ? 'ring-2 ring-green-500/50' : ''}`}
          onClick={() => handleRowClick(match.id)}
        >
          <CardContent className="p-0">
            {/* Competition header */}
            <div className={`px-4 py-2 flex items-center justify-between ${status.bg}`}>
              <div className="flex items-center gap-2 text-sm">
                {competition ? (
                  <>
                    <Trophy className="h-3.5 w-3.5" />
                    <span className="font-medium">{competition.name}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Amistoso</span>
                )}
              </div>
              <Badge className={`${status.bg} ${status.color} border-0 text-xs`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dotClass}`} />
                {match.status}
              </Badge>
            </div>

            {/* Scoreboard */}
            <div className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Home team */}
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary/70" />
                  </div>
                  <p className="font-semibold truncate">{homeTeam?.name || "Local"}</p>
                  <p className="text-xs text-muted-foreground">Local</p>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isFinished ? 'bg-muted' : 'bg-primary/5'}`}>
                    <span className={`text-3xl font-bold ${isLive ? 'text-green-600' : ''}`}>
                      {match.home_goals ?? "-"}
                    </span>
                    <span className="text-xl text-muted-foreground">:</span>
                    <span className={`text-3xl font-bold ${isLive ? 'text-green-600' : ''}`}>
                      {match.away_goals ?? "-"}
                    </span>
                  </div>
                  {isLive && (
                    <span className="text-xs text-green-600 font-medium mt-1 animate-pulse">
                      EN VIVO
                    </span>
                  )}
                </div>

                {/* Away team */}
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary-foreground/70" />
                  </div>
                  <p className="font-semibold truncate">{awayTeam?.name || "Visitante"}</p>
                  <p className="text-xs text-muted-foreground">Visitante</p>
                </div>
              </div>

              {/* Match details */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-4 pt-4 border-t">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(matchDate, "dd MMM yyyy", { locale: es })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(matchDate, "HH:mm")}
                </span>
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </span>
                )}
              </div>

              {/* Actions on hover */}
              <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar partido?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={(e) => handleDelete(match.id, e)}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" size="sm">
                  Ver detalles
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Swords className="h-6 w-6 text-primary" />
            Partidos
          </h2>
          <p className="text-muted-foreground">
            Gestiona los encuentros y resultados de tu academia
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-1">
            <Button
              variant={viewMode === "scoreboard" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("scoreboard")}
              className="h-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <CreateMatchDialog onMatchCreated={handleMatchCreated} />
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <Card className="cursor-default">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Swords className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-default">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Award className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Finalizados</p>
              <p className="text-lg font-bold">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-default">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Próximos</p>
              <p className="text-lg font-bold">{stats.upcoming}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-default">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Target className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Goles/Partido</p>
              <p className="text-lg font-bold">{stats.avgGoals}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matches */}
      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/10 border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Swords className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No hay partidos registrados</h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            Comienza creando el primer partido de la temporada
          </p>
          <CreateMatchDialog onMatchCreated={handleMatchCreated} />
        </div>
      ) : (
        <AnimatePresence mode="wait">
        <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
          {viewMode === "scoreboard" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortedMatches.map((match, index) => (
                    <MatchCard key={match.id} match={match} index={index} />
                ))}
            </div>
          ) : (
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Partido</TableHead>
                            <TableHead>Resultado</TableHead>
                            <TableHead>Competición</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMatches.map(match => {
                            const homeTeam = teams[match.home_team_id];
                            const awayTeam = teams[match.away_team_id];
                            const competition = match.competition_id ? competitions[match.competition_id] : null;
                            const matchDate = getMatchDate(match);

                            return (
                                <TableRow key={match.id} onClick={() => handleRowClick(match.id)} className="cursor-pointer">
                                    <TableCell>
                                        <div className="font-medium">{homeTeam?.name || 'Local'} vs {awayTeam?.name || 'Visitante'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold">{match.home_goals ?? '-'} : {match.away_goals ?? '-'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{competition?.name || 'Amistoso'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(matchDate, "dd MMM yyyy - HH:mm", { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end">
                                        <Button variant="ghost" size="sm" onClick={(e) => {e.stopPropagation(); handleRowClick(match.id)}}>Ver detalles</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => e.stopPropagation()}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>¿Eliminar partido?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción no se puede deshacer.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    onClick={(e) => handleDelete(match.id, e)}
                                                >
                                                    Eliminar
                                                </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
          )}
        </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
