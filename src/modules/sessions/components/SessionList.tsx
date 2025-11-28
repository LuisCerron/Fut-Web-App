"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Session, Team, User } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { usersService } from "@/modules/users/services/users.service";
import { Badge } from "@/components/ui/badge";
import { CreateSessionDialog } from "./CreateSessionDialog";
import { 
  Trash2, CalendarClock, Copy, Edit, User as UserIcon, FileText, 
  MapPin, Clock, Users, Calendar, ChevronRight, Dumbbell, Trophy, 
  Activity, LayoutGrid, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { format, isToday, isTomorrow, isPast, isFuture, startOfDay, endOfDay, isWithinInterval, addDays } from "date-fns";
import { es } from "date-fns/locale";

// Session type icons and colors
const sessionTypeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Entrenamiento: { 
    icon: <Dumbbell className="h-4 w-4" />, 
    color: "text-blue-600", 
    bg: "bg-blue-50 border-blue-200" 
  },
  Partido: { 
    icon: <Trophy className="h-4 w-4" />, 
    color: "text-amber-600", 
    bg: "bg-amber-50 border-amber-200" 
  },
  Evaluación: { 
    icon: <Activity className="h-4 w-4" />, 
    color: "text-purple-600", 
    bg: "bg-purple-50 border-purple-200" 
  },
  Otro: { 
    icon: <Calendar className="h-4 w-4" />, 
    color: "text-gray-600", 
    bg: "bg-gray-50 border-gray-200" 
  },
};

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  Planificada: { color: "text-blue-700", bg: "bg-blue-100", dot: "bg-blue-500" },
  "En Curso": { color: "text-green-700", bg: "bg-green-100", dot: "bg-green-500 animate-pulse" },
  Completada: { color: "text-gray-600", bg: "bg-gray-100", dot: "bg-gray-400" },
  Cancelada: { color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
};

type ViewMode = "timeline" | "grid";

export function SessionList() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsData, teamsData, usersData] = await Promise.all([
        sessionsService.getSessions(),
        sportsService.getTeams(),
        usersService.getUsers(),
      ]);

      setSessions(sessionsData);
      setTeams(teamsData.reduce((acc, t) => ({ ...acc, [t.id]: t }), {}));
      setUsers(usersData.reduce((acc, u) => ({ ...acc, [u.id]: u }), {}));
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar las sesiones");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionCreated = (newSession: Session) => {
    setSessions([...sessions, newSession]);
    toast.success("Sesión creada exitosamente");
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const originalSession = await sessionsService.getSessionById(id);
      if (!originalSession) throw new Error("Sesión no encontrada");

      const newSessionData = {
        ...originalSession,
        id: undefined,
        start_time: new Date(new Date(originalSession.start_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(new Date(originalSession.end_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Planificada",
      };

      const newSession = await sessionsService.createSession(newSessionData as Partial<Session>);
      setSessions([...sessions, newSession]);
      toast.success("Sesión duplicada exitosamente");
    } catch (error) {
      console.error("Error duplicating session:", error);
      toast.error("Error al duplicar la sesión");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await sessionsService.deleteSession(id);
      setSessions(sessions.filter((s) => s.id !== id));
      toast.success("Sesión eliminada");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Error al eliminar la sesión");
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/sessions/${id}`);
  };

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const sorted = [...sessions].sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    const groups: { label: string; sessions: Session[]; isUpcoming: boolean }[] = [];
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const thisWeek = addDays(today, 7);

    // Group: Hoy
    const todaySessions = sorted.filter(s => isToday(new Date(s.start_time)));
    if (todaySessions.length > 0) {
      groups.push({ label: "Hoy", sessions: todaySessions, isUpcoming: true });
    }

    // Group: Mañana
    const tomorrowSessions = sorted.filter(s => isTomorrow(new Date(s.start_time)));
    if (tomorrowSessions.length > 0) {
      groups.push({ label: "Mañana", sessions: tomorrowSessions, isUpcoming: true });
    }

    // Group: Esta semana
    const thisWeekSessions = sorted.filter(s => {
      const date = new Date(s.start_time);
      return !isToday(date) && !isTomorrow(date) && 
             isWithinInterval(date, { start: addDays(today, 2), end: thisWeek });
    });
    if (thisWeekSessions.length > 0) {
      groups.push({ label: "Esta semana", sessions: thisWeekSessions, isUpcoming: true });
    }

    // Group: Próximamente
    const futureSessions = sorted.filter(s => {
      const date = new Date(s.start_time);
      return isFuture(date) && !isWithinInterval(date, { start: today, end: thisWeek });
    });
    if (futureSessions.length > 0) {
      groups.push({ label: "Próximamente", sessions: futureSessions, isUpcoming: true });
    }

    // Group: Pasadas
    const pastSessions = sorted.filter(s => isPast(new Date(s.start_time)) && !isToday(new Date(s.start_time)));
    if (pastSessions.length > 0) {
      groups.push({ label: "Pasadas", sessions: pastSessions.reverse(), isUpcoming: false });
    }

    return groups;
  }, [sessions]);

  // Stats
  const stats = useMemo(() => ({
    total: sessions.length,
    today: sessions.filter(s => isToday(new Date(s.start_time))).length,
    planned: sessions.filter(s => s.status === "Planificada").length,
    inProgress: sessions.filter(s => s.status === "En Curso").length,
  }), [sessions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const SessionCard = ({ session, index }: { session: Session; index: number }) => {
    const typeConfig = sessionTypeConfig[session.session_type] || sessionTypeConfig.Otro;
    const status = statusConfig[session.status] || statusConfig.Planificada;
    const team = session.team_id ? teams[session.team_id] : null;
    const responsible = session.responsible_user_id ? users[session.responsible_user_id] : null;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card 
          className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
          onClick={() => handleRowClick(session.id)}
        >
          <CardContent className="p-0">
            <div className="flex">
              {/* Time column */}
              <div className={`w-24 shrink-0 p-4 flex flex-col items-center justify-center border-r ${typeConfig.bg}`}>
                <span className={`text-2xl font-bold ${typeConfig.color}`}>
                  {format(new Date(session.start_time), "HH:mm")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(session.end_time), "HH:mm")}
                </span>
              </div>

              {/* Main content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${typeConfig.color}`}>{typeConfig.icon}</span>
                      <h3 className="font-semibold truncate">{session.session_type}</h3>
                      <Badge className={`${status.bg} ${status.color} border-0 text-xs`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
                        {session.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                      {team && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {team.name}
                        </span>
                      )}
                      {session.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {session.location}
                        </span>
                      )}
                      {responsible && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3.5 w-3.5" />
                          {responsible.full_name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => handleDuplicate(session.id, e)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar sesión?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDelete(session.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
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
            <CalendarClock className="h-6 w-6 text-primary" />
            Sesiones
          </h2>
          <p className="text-muted-foreground">
            Planifica y gestiona entrenamientos, partidos y actividades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-1">
            <Button
              variant={viewMode === "timeline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <CreateSessionDialog onSessionCreated={handleSessionCreated} />
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <Card className="cursor-default">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-default">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hoy</p>
              <p className="text-lg font-bold">{stats.today}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-default">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">En Curso</p>
              <p className="text-lg font-bold">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions */}
      {viewMode === "timeline" ? (
        <div className="space-y-8">
          {groupedSessions.map(group => (
            <div key={group.label}>
              <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${group.isUpcoming ? 'text-foreground' : 'text-muted-foreground'}`}>
                <span className={`w-2 h-2 rounded-full ${group.isUpcoming ? 'bg-primary' : 'bg-muted-foreground'}`} />
                {group.label}
                <span className="text-xs text-muted-foreground">({group.sessions.length})</span>
              </h3>
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                {group.sessions.map((session, index) => (
                  <SessionCard key={session.id} session={session} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session, index) => (
            <SessionCard key={session.id} session={session} index={index} />
          ))}
        </div>
      )}

      {sessions.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <CalendarClock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay sesiones planificadas</p>
          <p className="text-sm">Crea tu primera sesión para comenzar</p>
        </div>
      )}
    </motion.div>
  );
}
