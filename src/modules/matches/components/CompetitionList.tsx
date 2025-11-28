"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Competition } from "@/modules/core/types/db.types";
import { matchesService } from "@/modules/matches/services/matches.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateCompetitionDialog } from "./CreateCompetitionDialog";
import { Trash2, Trophy, Edit, MoreHorizontal, CalendarCheck, CalendarDays, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export function CompetitionList() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      const data = await matchesService.getCompetitions();
      setCompetitions(data);
    } catch (error) {
      console.error("Error loading competitions:", error);
      toast.error("Error al cargar las competiciones");
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitionCreated = (newCompetition: Competition) => {
    setCompetitions([...competitions, newCompetition]);
    toast.success("Competición creada exitosamente");
  };

  const handleDelete = async (id: string) => {
    try {
      await matchesService.deleteCompetition(id);
      setCompetitions(competitions.filter((c) => c.id !== id));
      toast.success("Competición eliminada");
    } catch (error) {
      console.error("Error deleting competition:", error);
      toast.error("Error al eliminar la competición");
    }
  };

  const getStatusBadgeVariant = (status: Competition["status"]) => {
    switch (status) {
      case "Planificada":
        return "secondary";
      case "En Curso":
        return "default";
      case "Finalizada":
        return "outline";
      case "Cancelada":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-28 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MotionWrapper className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight">Competencias</h2>
          <p className="text-muted-foreground">
            Gestiona ligas, torneos y copas.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreateCompetitionDialog onCompetitionCreated={handleCompetitionCreated} />
        </motion.div>
      </div>

      {competitions.length === 0 ? (
        <MotionItem className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No hay competiciones registradas</h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            Comienza creando la primera competición para organizar tus partidos.
          </p>
          <CreateCompetitionDialog onCompetitionCreated={handleCompetitionCreated} />
        </MotionItem>
      ) : (
        <MotionList className="grid gap-4">
          {/* Mobile/Tablet Card View (Visible on small screens) */}
          <div className="grid gap-4 md:hidden">
            {competitions.map((competition) => (
              <MotionItem key={competition.id}>
                <Card 
                  className="overflow-hidden hover:shadow-md active:scale-[0.98] transition-transform duration-200"
                >
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge variant={getStatusBadgeVariant(competition.status)}>
                        {competition.status}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive -mr-2 -mt-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar competición</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar competición?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminarán todos los datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(competition.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-semibold text-lg">{competition.name}</p>
                          <Badge variant="secondary" className="text-xs">{competition.type}</Badge>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <CalendarCheck className="h-3.5 w-3.5" />
                        Temporada: {competition.season}
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {format(new Date(competition.start_date), "dd MMM yyyy", { locale: es })} - {format(new Date(competition.end_date), "dd MMM yyyy", { locale: es })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MotionItem>
            ))}
          </div>

          {/* Desktop Table View (Hidden on small screens) */}
          <div className="hidden md:block border rounded-lg overflow-hidden bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="p-6">Nombre</TableHead>
                  <TableHead className="p-6">Tipo</TableHead>
                  <TableHead className="p-6">Temporada</TableHead>
                  <TableHead className="p-6">Fechas</TableHead>
                  <TableHead className="p-6">Estado</TableHead>
                  <TableHead className="p-6 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitions.map((competition) => (
                  <TableRow
                    key={competition.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors h-[60px]"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-primary" />
                        {competition.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{competition.type}</Badge>
                    </TableCell>
                    <TableCell>{competition.season}</TableCell>
                    <TableCell>
                      {format(new Date(competition.start_date), "dd MMM yyyy", { locale: es })} - {format(new Date(competition.end_date), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(competition.status)}>
                        {competition.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menú</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Más opciones</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4 text-blue-500" /> <span className="text-blue-500">Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" /> <span className="text-red-500">Eliminar</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar competición?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a esta competición.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(competition.id)}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
