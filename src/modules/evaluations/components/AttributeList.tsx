"use client";

import { useEffect, useState } from "react";
import { Attribute } from "@/modules/core/types/db.types";
import { evaluationsService } from "@/modules/evaluations/services/evaluations.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateAttributeDialog } from "./CreateAttributeDialog";
import { Trash2, TrendingUp, FlaskConical, Brain, Users, Layers, Search, Sparkles } from "lucide-react";
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

export function AttributeList() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const data = await evaluationsService.getAttributes();
      setAttributes(data);
    } catch (error) {
      console.error("Error loading attributes:", error);
      toast.error("Error al cargar los criterios");
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeCreated = (newAttribute: Attribute) => {
    setAttributes([...attributes, newAttribute]);
    toast.success("Criterio de evaluación creado");
  };

  const handleDelete = async (id: string) => {
    try {
      await evaluationsService.deleteAttribute(id);
      setAttributes(attributes.filter((attr) => attr.id !== id));
      toast.success("Criterio eliminado");
    } catch (error) {
      console.error("Error deleting attribute:", error);
      toast.error("Error al eliminar el criterio");
    }
  };

  const getTypeIcon = (type: Attribute["type"]) => {
    switch (type) {
      case "Físico":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "Técnico":
        return <FlaskConical className="h-4 w-4 text-blue-500" />;
      case "Mental":
        return <Brain className="h-4 w-4 text-purple-500" />;
      case "Táctico":
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-amber-500" />;
    }
  };

  const getTypeBgColor = (type: Attribute["type"]) => {
    switch (type) {
      case "Físico":
        return "bg-orange-100 dark:bg-orange-500/20";
      case "Técnico":
        return "bg-blue-100 dark:bg-blue-500/20";
      case "Mental":
        return "bg-purple-100 dark:bg-purple-500/20";
      case "Táctico":
        return "bg-green-100 dark:bg-green-500/20";
      default:
        return "bg-amber-100 dark:bg-amber-500/20";
    }
  };

  const filteredAttributes = attributes.filter(
    (attr) =>
      attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-lg" />
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
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Criterios de Evaluación</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Define los atributos para evaluar a tus jugadores.
          </p>
        </div>
        <CreateAttributeDialog onAttributeCreated={handleAttributeCreated} />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 md:h-12"
        />
      </div>

      {filteredAttributes.length === 0 ? (
        <MotionItem className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">
            {searchTerm ? "No se encontraron criterios" : "No hay criterios definidos"}
          </h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Crea tu primer criterio de evaluación para comenzar a evaluar a tus jugadores."}
          </p>
          {!searchTerm && <CreateAttributeDialog onAttributeCreated={handleAttributeCreated} />}
        </MotionItem>
      ) : (
        <>
          {/* Card Grid for Mobile/Tablet */}
          <MotionList className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {filteredAttributes.map((attr) => (
              <MotionItem key={attr.id}>
                <Card className="overflow-hidden hover:shadow-md active:scale-[0.99] transition-all duration-200">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full ${getTypeBgColor(attr.type)} flex items-center justify-center flex-shrink-0`}>
                          {getTypeIcon(attr.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-base md:text-lg">{attr.name}</p>
                          <Badge variant="secondary" className="text-xs md:text-sm mt-1">
                            {attr.type}
                          </Badge>
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
                            <AlertDialogTitle>¿Eliminar criterio?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Este criterio podría estar siendo usado en evaluaciones existentes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="h-11">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(attr.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
                      <span>{attr.scale_type}</span>
                      <span>
                        {attr.scale_type.includes("Numérica") && attr.min_value !== undefined && attr.max_value !== undefined
                          ? `${attr.min_value}-${attr.max_value} ${attr.unit || ""}`
                          : attr.unit || "—"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </MotionItem>
            ))}
          </MotionList>

          {/* Desktop Table View */}
          <div className="hidden lg:block border rounded-lg overflow-hidden bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Atributo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Escala</TableHead>
                  <TableHead>Rango/Unidad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttributes.map((attr) => (
                  <TableRow key={attr.id} className="h-[60px] hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full ${getTypeBgColor(attr.type)} flex items-center justify-center`}>
                          {getTypeIcon(attr.type)}
                        </div>
                        {attr.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{attr.type}</Badge>
                    </TableCell>
                    <TableCell>{attr.scale_type}</TableCell>
                    <TableCell>
                      {attr.scale_type.includes("Numérica") && attr.min_value !== undefined && attr.max_value !== undefined
                        ? `${attr.min_value}-${attr.max_value} ${attr.unit || ""}`
                        : attr.unit || "—"}
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
                            <AlertDialogTitle>¿Eliminar criterio?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Este criterio podría estar siendo usado en evaluaciones existentes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(attr.id)}
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
        </>
      )}
    </MotionWrapper>
  );
}
