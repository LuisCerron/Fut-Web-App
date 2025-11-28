"use client";

import { useState } from "react";
import { SessionTask } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";

interface EditSessionTaskDialogProps {
  task: SessionTask;
  libraryTaskName: string;
  onTaskUpdated: (updatedTask: SessionTask) => void;
}

export function EditSessionTaskDialog({ task, libraryTaskName, onTaskUpdated }: EditSessionTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [realizedDuration, setRealizedDuration] = useState(task.realized_duration_min?.toString() || "");
  const [coachNotes, setCoachNotes] = useState(task.coach_notes || "");
  const [isOptional, setIsOptional] = useState(task.is_optional);
  const [improvisedMaterial, setImprovisedMaterial] = useState(task.improvised_material || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedTask = await sessionsService.updateSessionTask(task.id, {
        realized_duration_min: realizedDuration ? parseInt(realizedDuration) : undefined,
        coach_notes: coachNotes,
        is_optional: isOptional,
        improvised_material: improvisedMaterial,
      });
      onTaskUpdated(updatedTask);
      setOpen(false);
    } catch (error) {
      console.error("Error updating session task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tarea: {libraryTaskName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="realizedDuration" className="text-right">
              Duración Real (min)
            </Label>
            <Input
              id="realizedDuration"
              type="number"
              value={realizedDuration}
              onChange={(e) => setRealizedDuration(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coachNotes" className="text-right">
              Notas del Entrenador
            </Label>
            <Textarea
              id="coachNotes"
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="improvisedMaterial" className="text-right">
              Material Imprevisto
            </Label>
            <Input
              id="improvisedMaterial"
              value={improvisedMaterial}
              onChange={(e) => setImprovisedMaterial(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isOptional" className="text-right">
              Opcional
            </Label>
            <Checkbox
              id="isOptional"
              checked={isOptional}
              onCheckedChange={(checked) => setIsOptional(checked as boolean)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
