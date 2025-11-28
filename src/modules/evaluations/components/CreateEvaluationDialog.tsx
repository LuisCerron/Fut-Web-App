"use client";

import { useState, useEffect } from "react";
import { Evaluation, EvaluationDetail, EvaluationType, EvaluationStatus, Player, User, Attribute } from "@/modules/core/types/db.types";
import { evaluationsService } from "@/modules/evaluations/services/evaluations.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { usersService } from "@/modules/users/services/users.service";
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
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2, TrendingUp, FlaskConical, Brain, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateEvaluationDialogProps {
  onEvaluationCreated: (evaluation: Evaluation) => void;
}

export function CreateEvaluationDialog({ onEvaluationCreated }: CreateEvaluationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDependencies, setLoadingDependencies] = useState(false);
  
  // Form states for Evaluation
  const [playerId, setPlayerId] = useState("");
  const [evaluatorUserId, setEvaluatorUserId] = useState("");
  const [evaluationType, setEvaluationType] = useState<EvaluationType>("Inicial");
  const [generalComments, setGeneralComments] = useState("");
  const [status, setStatus] = useState<EvaluationStatus>("Completada");
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split('T')[0]);

  // States for Evaluation Details
  const [evaluationDetails, setEvaluationDetails] = useState<Partial<EvaluationDetail>[]>([]);

  // Data for selects
  const [players, setPlayers] = useState<Player[]>([]);
  const [evaluators, setEvaluators] = useState<User[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    if (open) {
      loadDependencies();
    }
  }, [open]);

  const loadDependencies = async () => {
    setLoadingDependencies(true);
    try {
      const [playersData, usersData, attributesData] = await Promise.all([
        sportsService.getPlayers(),
        usersService.getUsers(),
        evaluationsService.getAttributes(),
      ]);
      setPlayers(playersData);
      setEvaluators(usersData.filter(u => u.role_id === "role-coach" || u.role_id === "role-admin"));
      setAttributes(attributesData);

      if (playersData.length > 0) setPlayerId(playersData[0].id);
      if (evaluators.length > 0) setEvaluatorUserId(evaluators[0].id);

      setEvaluationDetails(attributesData.map(attr => ({
        attribute_id: attr.id,
        numeric_value: attr.scale_type.includes("Numérica") ? attr.min_value : undefined,
        text_value: attr.scale_type === "Texto Libre" ? "" : undefined,
        comments: "",
      })));
    } catch (error) {
      console.error("Error loading dependencies:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoadingDependencies(false);
    }
  };

  const handleDetailChange = (attributeId: string, field: keyof Partial<EvaluationDetail>, value: string | number | undefined) => {
    setEvaluationDetails(prevDetails => prevDetails.map(detail => {
      if (detail.attribute_id === attributeId) {
        return { ...detail, [field]: value };
      }
      return detail;
    }));
  };

  const getAttributeById = (id: string) => attributes.find(attr => attr.id === id);

  const getTypeIcon = (type: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newEvaluation: Partial<Evaluation> = {
        player_id: playerId,
        evaluator_user_id: evaluatorUserId,
        evaluation_date: new Date(evaluationDate).toISOString(),
        evaluation_type: evaluationType,
        general_comments: generalComments,
        status: status,
      };
      
      const createdEvaluation = await evaluationsService.createEvaluation(
        newEvaluation,
        evaluationDetails
      );
      onEvaluationCreated(createdEvaluation);
      setOpen(false);
      toast.success("Evaluación guardada exitosamente");
      // Reset form
      setPlayerId("");
      setEvaluatorUserId("");
      setEvaluationType("Inicial");
      setGeneralComments("");
      setStatus("Completada");
      setEvaluationDate(new Date().toISOString().split('T')[0]);
      setEvaluationDetails([]);
    } catch (error) {
      console.error("Error creating evaluation:", error);
      toast.error("Error al guardar la evaluación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 md:h-12 px-4 md:px-6 gap-2 font-medium">
          <PlusCircle className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Nueva Evaluación</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-xl">Registrar Nueva Evaluación</DialogTitle>
          <DialogDescription>
            Realiza una evaluación detallada del rendimiento de un jugador.
          </DialogDescription>
        </DialogHeader>

        {loadingDependencies ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <ScrollArea className="max-h-[calc(90vh-200px)]">
              <div className="px-6 py-4 space-y-6">
                {/* Player & Evaluator Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="player" className="text-sm font-medium">Jugador</Label>
                    <Select value={playerId} onValueChange={setPlayerId} required>
                      <SelectTrigger className="h-11 md:h-12">
                        <SelectValue placeholder="Seleccionar jugador" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="py-3">
                            {p.first_name} {p.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evaluator" className="text-sm font-medium">Evaluador</Label>
                    <Select value={evaluatorUserId} onValueChange={setEvaluatorUserId} required>
                      <SelectTrigger className="h-11 md:h-12">
                        <SelectValue placeholder="Seleccionar evaluador" />
                      </SelectTrigger>
                      <SelectContent>
                        {evaluators.map((u) => (
                          <SelectItem key={u.id} value={u.id} className="py-3">
                            {u.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Type & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="evaluationType" className="text-sm font-medium">Tipo de Evaluación</Label>
                    <Select value={evaluationType} onValueChange={(value) => setEvaluationType(value as EvaluationType)} required>
                      <SelectTrigger className="h-11 md:h-12">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inicial" className="py-3">Inicial</SelectItem>
                        <SelectItem value="Periódica" className="py-3">Periódica</SelectItem>
                        <SelectItem value="Final" className="py-3">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evaluationDate" className="text-sm font-medium">Fecha de Evaluación</Label>
                    <Input
                      id="evaluationDate"
                      type="date"
                      value={evaluationDate}
                      onChange={(e) => setEvaluationDate(e.target.value)}
                      className="h-11 md:h-12"
                      required
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <Label htmlFor="generalComments" className="text-sm font-medium">Comentarios Generales</Label>
                  <Textarea
                    id="generalComments"
                    value={generalComments}
                    onChange={(e) => setGeneralComments(e.target.value)}
                    placeholder="Comentarios generales sobre la evaluación..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
                
                {/* Attributes Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Detalle de Atributos</Label>
                    <Badge variant="outline" className="text-xs">
                      {attributes.length} criterios
                    </Badge>
                  </div>

                  {attributes.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          No hay atributos definidos. Por favor, define algunos primero.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-3">
                      {evaluationDetails.map((detail) => {
                        const attr = getAttributeById(detail.attribute_id as string);
                        if (!attr) return null;

                        return (
                          <Card key={attr.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-3 min-w-[180px]">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    {getTypeIcon(attr.type)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{attr.name}</p>
                                    <p className="text-xs text-muted-foreground">{attr.type}</p>
                                  </div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {attr.scale_type.includes("Numérica") || attr.scale_type === "Porcentaje" ? (
                                    <Input
                                      type="number"
                                      value={detail.numeric_value ?? (attr.min_value || 0)}
                                      onChange={(e) => handleDetailChange(attr.id, "numeric_value", parseInt(e.target.value))}
                                      min={attr.min_value}
                                      max={attr.max_value}
                                      placeholder={`${attr.min_value || 0}-${attr.max_value || 10}`}
                                      className="h-10"
                                    />
                                  ) : attr.scale_type === "Letras A-F" ? (
                                    <Select
                                      value={detail.text_value ?? ""}
                                      onValueChange={(value) => handleDetailChange(attr.id, "text_value", value)}
                                    >
                                      <SelectTrigger className="h-10">
                                        <SelectValue placeholder="A-F" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {["A", "B", "C", "D", "E", "F"].map(letter => (
                                          <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      type="text"
                                      value={detail.text_value ?? ""}
                                      onChange={(e) => handleDetailChange(attr.id, "text_value", e.target.value)}
                                      placeholder="Valor"
                                      className="h-10"
                                    />
                                  )}
                                  <Input
                                    type="text"
                                    value={detail.comments ?? ""}
                                    onChange={(e) => handleDetailChange(attr.id, "comments", e.target.value)}
                                    placeholder="Comentario (opcional)"
                                    className="h-10"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Estado</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as EvaluationStatus)} required>
                    <SelectTrigger className="h-11 md:h-12">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Borrador" className="py-3">Borrador</SelectItem>
                      <SelectItem value="Completada" className="py-3">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="px-6 py-4 border-t bg-muted/30">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="h-11 min-w-[140px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Evaluación"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
