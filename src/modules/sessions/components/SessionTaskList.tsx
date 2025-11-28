"use client";

import { useEffect, useState } from "react";
import { SessionTask, LibraryTask } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { tasksService } from "@/modules/tasks/services/tasks.service"; // To get library task details
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { AddSessionTaskDialog } from "./AddSessionTaskDialog";
import { EditSessionTaskDialog } from "./EditSessionTaskDialog";
import { Badge } from "@/components/ui/badge";

interface SessionTaskListProps {
  sessionId: string;
}

export function SessionTaskList({ sessionId }: SessionTaskListProps) {
  const [sessionTasks, setSessionTasks] = useState<SessionTask[]>([]);
  const [libraryTasks, setLibraryTasks] = useState<Record<string, LibraryTask>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionTasksData, libraryTasksData] = await Promise.all([
        sessionsService.getSessionTasksForSession(sessionId),
        tasksService.getLibraryTasks(),
      ]);

      setSessionTasks(sessionTasksData.sort((a, b) => a.order - b.order));

      const libraryTasksMap = libraryTasksData.reduce((acc, lt) => ({ ...acc, [lt.id]: lt }), {});
      setLibraryTasks(libraryTasksMap);

    } catch (error) {
      console.error("Error loading session task data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionTaskAdded = (newSessionTask: SessionTask) => {
    setSessionTasks([...sessionTasks, newSessionTask].sort((a, b) => a.order - b.order));
  };

  const handleTaskUpdated = (updatedTask: SessionTask) => {
    setSessionTasks(sessionTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  
  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta tarea de la sesión?")) {
      try {
        await sessionsService.deleteSessionTask(id);
        setSessionTasks(sessionTasks.filter((st) => st.id !== id));
      } catch (error) {
        console.error("Error deleting session task:", error);
      }
    }
  };
  
  const getStatusBadgeVariant = (status: SessionTask["status"]) => {
    switch (status) {
      case "Pendiente": return "outline";
      case "En Progreso": return "secondary";
      case "Completada": return "default";
      case "Saltada": return "destructive";
      default: return "outline";
    }
  };


  if (loading) {
    return <div>Cargando tareas de la sesión...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tareas de la Sesión</CardTitle>
        <AddSessionTaskDialog sessionId={sessionId} onTaskAdded={handleSessionTaskAdded} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessionTasks.map((task) => {
            const libraryTask = libraryTasks[task.library_task_id];
            return (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-primary">{task.order}</span>
                  <div>
                    <p className="font-semibold">{libraryTask?.name || "Tarea no encontrada"}</p>
                    <p className="text-sm text-muted-foreground">{libraryTask?.description || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
                  <span className="text-sm text-muted-foreground">{task.estimated_duration_min} min</span>
                  <EditSessionTaskDialog 
                    task={task} 
                    libraryTaskName={libraryTask?.name || "Tarea"} 
                    onTaskUpdated={handleTaskUpdated} 
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)} className="h-8 w-8 text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          {sessionTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay tareas asignadas a esta sesión.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
