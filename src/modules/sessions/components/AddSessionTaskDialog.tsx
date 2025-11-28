"use client";

import { useState, useEffect } from "react";
import { LibraryTask, SessionTask } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { tasksService } from "@/modules/tasks/services/tasks.service";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddSessionTaskDialogProps {
  sessionId: string;
  onTaskAdded: (task: SessionTask) => void;
}

export function AddSessionTaskDialog({ sessionId, onTaskAdded }: AddSessionTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [libraryTasks, setLibraryTasks] = useState<LibraryTask[]>([]);
  
  // Form states
  const [selectedLibraryTaskId, setSelectedLibraryTaskId] = useState("");
  const [order, setOrder] = useState<string>("1");
  const [estimatedDuration, setEstimatedDuration] = useState<string>("10");

  useEffect(() => {
    if (open) {
      loadLibraryTasks();
    }
  }, [open]);

  const loadLibraryTasks = async () => {
    try {
      const data = await tasksService.getLibraryTasks();
      setLibraryTasks(data);
      if (data.length > 0) {
        setSelectedLibraryTaskId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading library tasks:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLibraryTaskId) {
      alert("Por favor, selecciona una tarea.");
      return;
    }
    setIsLoading(true);
    try {
      const newSessionTask = await sessionsService.addSessionTask({
        session_id: sessionId,
        library_task_id: selectedLibraryTaskId,
        order: parseInt(order),
        estimated_duration_min: parseInt(estimatedDuration),
      });
      onTaskAdded(newSessionTask);
      setOpen(false);
      // Reset form
      setOrder("1");
      setEstimatedDuration("10");
      if (libraryTasks.length > 0) {
        setSelectedLibraryTaskId(libraryTasks[0].id);
      }
    } catch (error) {
      console.error("Error adding session task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Tarea a la Sesión</DialogTitle>
          <DialogDescription>
            Selecciona una tarea de la biblioteca para añadirla a esta sesión.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task">Tarea de la Biblioteca</Label>
              <Select value={selectedLibraryTaskId} onValueChange={setSelectedLibraryTaskId} required>
                <SelectTrigger id="task">
                  <SelectValue placeholder="Seleccionar tarea" />
                </SelectTrigger>
                <SelectContent>
                  {libraryTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>{task.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Orden</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Añadiendo..." : "Añadir a la Sesión"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
