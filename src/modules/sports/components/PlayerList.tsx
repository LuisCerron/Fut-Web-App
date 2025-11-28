"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Player, Team, Position } from "@/modules/core/types/db.types";
import { sportsService } from "@/modules/sports/services/sports.service";
import { PlayerCardMini } from "./PlayerCardMini";
import { CreatePlayerDialog } from "./CreatePlayerDialog";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Filter, TrendingUp, LayoutGrid, List, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";

type ViewMode = "cards" | "compact" | "horizontal" | "list";

export function PlayerList() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsMap, setTeamsMap] = useState<Record<string, Team>>({});
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionsMap, setPositionsMap] = useState<Record<string, Position>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState<string>("all");
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [filterActive, setFilterActive] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [playersData, teamsData, positionsData] = await Promise.all([
        sportsService.getPlayers(),
        sportsService.getTeams(),
        sportsService.getPositions(),
      ]);
      
      setPlayers(playersData);
      setTeams(teamsData);
      setPositions(positionsData);
      
      const tMap = teamsData.reduce((acc, t) => ({ ...acc, [t.id]: t }), {} as Record<string, Team>);
      setTeamsMap(tMap);
      
      const pMap = positionsData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {} as Record<string, Position>);
      setPositionsMap(pMap);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar jugadores");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerCreated = (newPlayer: Player) => {
    setPlayers([...players, newPlayer]);
    toast.success("Jugador registrado exitosamente");
  };

  const handleDelete = async (id: string) => {
    try {
      await sportsService.deletePlayer(id);
      setPlayers(players.filter(p => p.id !== id));
      toast.success("Jugador eliminado");
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("Error al eliminar jugador");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterTeam("all");
    setFilterPosition("all");
    setFilterPayment("all");
    setFilterActive("all");
  };

  const filteredPlayers = useMemo(() => players.filter(p => {
    const matchesSearch = 
      p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dni?.includes(searchTerm);
    
    const matchesTeam = filterTeam === "all" || p.team_id === filterTeam;
    const matchesPosition = filterPosition === "all" || 
      p.position_primary_id === filterPosition || 
      p.position_secondary_id === filterPosition;
    const matchesPayment = filterPayment === "all" || p.payment_status === filterPayment;
    const matchesActive = filterActive === "all" || 
      (filterActive === "active" && p.is_active) ||
      (filterActive === "inactive" && !p.is_active);

    return matchesSearch && matchesTeam && matchesPosition && matchesPayment && matchesActive;
  }), [players, searchTerm, filterTeam, filterPosition, filterPayment, filterActive]);

  const activeFiltersCount = [
    filterTeam !== "all",
    filterPosition !== "all",
    filterPayment !== "all",
    filterActive !== "all"
  ].filter(Boolean).length;

  // Stats
  const stats = useMemo(() => ({
    total: players.length,
    active: players.filter(p => p.is_active).length,
    pendingPayment: players.filter(p => p.payment_status === "PENDIENTE").length,
  }), [players]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-12 w-36 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

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
            <Users className="h-6 w-6 text-primary" />
            Jugadores
          </h2>
          <p className="text-muted-foreground">
            Directorio de jugadores y fichas técnicas
          </p>
        </div>
        <CreatePlayerDialog onPlayerCreated={handlePlayerCreated} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Jugadores</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Filter className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pago Pendiente</p>
              <p className="text-2xl font-bold">{stats.pendingPayment}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filters & View Toggle */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Filters */}
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="w-[160px] h-11">
                <SelectValue placeholder="Equipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {teams.filter(t => t.is_own_team).map((team) => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-[160px] h-11">
                <SelectValue placeholder="Posición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {positions.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id}>{pos.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-[130px] h-11">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex rounded-lg border bg-muted/50 p-1">
              <Button
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-9 px-3"
                title="Vista tarjetas grandes"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "compact" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("compact")}
                className="h-9 px-3"
                title="Vista compacta"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "horizontal" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("horizontal")}
                className="h-9 px-3"
                title="Vista horizontal"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters & Results */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <>
                <Badge variant="secondary">{activeFiltersCount} filtro(s)</Badge>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                  Limpiar
                </Button>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredPlayers.length} de {players.length} jugadores
          </p>
        </div>
      </div>

      {/* Players Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div
            className={
              viewMode === "cards" 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                : viewMode === "compact"
                ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            }
          >
            {filteredPlayers.map((player, index) => (
              <motion.div 
                key={player.id} 
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <PlayerCardMini
                  player={player}
                  teamName={player.team_id ? teamsMap[player.team_id]?.name : undefined}
                  positionName={player.position_primary_id ? positionsMap[player.position_primary_id]?.name || "JUG" : "JUG"}
                  variant={viewMode === "cards" ? "default" : viewMode === "compact" ? "compact" : "horizontal"}
                  showTeamBadge={viewMode === "cards"}
                  onClick={() => router.push(`/dashboard/players/${player.id}`)}
                />
                
                <div className={`absolute ${viewMode === "cards" ? "top-2 right-2" : viewMode === "compact" ? "top-1 right-1" : "top-1/2 -translate-y-1/2 right-2"} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30`}>
                  <Button variant="secondary" size="icon" className={viewMode === "compact" ? "h-6 w-6" : "h-8 w-8"} onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/players/${player.id}/evolution`); }} title="Ver evolución">
                    <TrendingUp className={viewMode === "compact" ? "h-3 w-3" : "h-4 w-4"} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" className={`${viewMode === "compact" ? "h-6 w-6" : "h-8 w-8"} shadow-lg`} onClick={(e) => e.stopPropagation()} title="Eliminar">
                        <Trash2 className={viewMode === "compact" ? "h-3 w-3" : "h-4 w-4"} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar jugador?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará permanentemente a {player.first_name} {player.last_name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(player.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                {player.payment_status && player.payment_status !== "AL_DIA" && viewMode === "cards" && (
                  <Badge variant={player.payment_status === "PENDIENTE" ? "secondary" : "destructive"} className="absolute bottom-2 left-2 text-xs z-30">
                    {player.payment_status === "PENDIENTE" ? "Atrasado" : "Inactivo"}
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No se encontraron jugadores</p>
          <p className="text-sm">Intenta ajustar los filtros o crear un nuevo jugador</p>
        </div>
      )}
    </motion.div>
  );
}
