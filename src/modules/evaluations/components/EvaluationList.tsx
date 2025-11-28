"use client";

import { useEffect, useState } from "react";
import { Evaluation, Player, User } from "@/modules/core/types/db.types";
import { evaluationsService } from "@/modules/evaluations/services/evaluations.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { usersService } from "@/modules/users/services/users.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateEvaluationDialog } from "./CreateEvaluationDialog";
import { Trash2, FileText, User as UserIcon, ClipboardCheck, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MotionList, MotionItem, MotionWrapper } from "@/components/ui/motion-wrapper";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function EvaluationList() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [evaluators, setEvaluators] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [evaluationsData, playersData, usersData] = await Promise.all([
        evaluationsService.getEvaluations(),
        sportsService.getPlayers(),
        usersService.getUsers(),
      ]);

      setEvaluations(evaluationsData);

      const playersMap = playersData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
      setPlayers(playersMap);

      const evaluatorsMap = usersData.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
      setEvaluators(evaluatorsMap);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar las evaluaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluationCreated = (newEvaluation: Evaluation) => {
    setEvaluations([...evaluations, newEvaluation]);
    toast.success("Evaluación creada exitosamente");
  };

  const handleDelete = async (id: string) => {
    try {
      await evaluationsService.deleteEvaluation(id);
      setEvaluations(evaluations.filter((e) => e.id !== id));
      toast.success("Evaluación eliminada");
    } catch (error) {
      console.error("Error deleting evaluation:", error);
      toast.error("Error al eliminar la evaluación");
    }
  };

  const getPlayerName = (playerId: string) => {
    const player = players[playerId];
    return player ? `${player.first_name} ${player.last_name}` : "Desconocido";
  };

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const playerName = getPlayerName(evaluation.player_id || "").toLowerCase();
    const evaluatorName = (evaluators[evaluation.evaluator_user_id || ""]?.full_name || "").toLowerCase();
    return (
      playerName.includes(searchTerm.toLowerCase()) ||
      evaluatorName.includes(searchTerm.toLowerCase()) ||
      evaluation.evaluation_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-11 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <MotionWrapper className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Evaluaciones de Jugadores</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Registro y seguimiento del rendimiento de los jugadores.
          </p>
        </div>
        <CreateEvaluationDialog onEvaluationCreated={handleEvaluationCreated} />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por jugador, evaluador o tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 md:h-12"
        />
      </div>

      {filteredEvaluations.length === 0 ? (
        <MotionItem className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <ClipboardCheck className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">
            {searchTerm ? "No se encontraron resultados" : "No hay evaluaciones registradas"}
          </h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza creando la primera evaluación para tus jugadores."}
          </p>
          {!searchTerm && <CreateEvaluationDialog onEvaluationCreated={handleEvaluationCreated} />}
        </MotionItem>
      ) : (
        <MotionList className="grid gap-4">
          {/* Mobile/Tablet Card View */}
          <div className="grid gap-4 lg:hidden">
            {filteredEvaluations.map((evaluation) => (
              <MotionItem key={evaluation.id}>
                <Card className="overflow-hidden hover:shadow-md active:scale-[0.99] transition-all duration-200">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-base md:text-lg">
                            {getPlayerName(evaluation.player_id || "")}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(evaluation.evaluation_date), "dd MMM yyyy", { locale: es })}
                          </div>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 md:h-10 md:w-10 text-muted-foreground hover:text-destructive -mr-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar evaluación?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminarán todos los datos de esta evaluación.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="h-11">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(evaluation.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Badge variant="secondary" className="text-xs md:text-sm">
                        {evaluation.evaluation_type}
                      </Badge>
                      <Badge variant={evaluation.status === "Completada" ? "default" : "outline"} className="text-xs md:text-sm">
                        {evaluation.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Evaluador: {evaluators[evaluation.evaluator_user_id || ""]?.full_name || "Desconocido"}</span>
                    </div>
                  </CardContent>
                </Card>
              </MotionItem>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block border rounded-lg overflow-hidden bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Jugador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Evaluador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.map((evaluation) => (
                  <TableRow
                    key={evaluation.id}
                    className="h-[60px] hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                        {getPlayerName(evaluation.player_id || "")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{evaluation.evaluation_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(evaluation.evaluation_date), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      {evaluators[evaluation.evaluator_user_id || ""]?.full_name || "Desconocido"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={evaluation.status === "Completada" ? "default" : "outline"}>
                        {evaluation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar evaluación?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminarán todos los datos de esta evaluación.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(evaluation.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </MotionList>
      )}
    </MotionWrapper>
  );
}
