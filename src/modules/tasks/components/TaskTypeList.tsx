
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TaskType } from "@/modules/core/types/db.types";
import { tasksService } from "@/modules/tasks/services/tasks.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateTaskTypeDialog } from "./CreateTaskTypeDialog";
import { Trash2, Edit, MoreHorizontal, ListChecks, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMedia } from "@/lib/hooks/use-media";
import { TaskTypeCard } from "./TaskTypeCard";

export function TaskTypeList() {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const isDesktop = useMedia("(min-width: 768px)");

  useEffect(() => {
    loadTaskTypes();
  }, []);

  const loadTaskTypes = async () => {
    try {
      const data = await tasksService.getTaskTypes();
      setTaskTypes(data);
    } catch (error) {
      console.error("Error loading task types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskTypeCreated = (newTaskType: TaskType) => {
    setTaskTypes([...taskTypes, newTaskType]);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este tipo de tarea?")) {
      try {
        await tasksService.deleteTaskType(id);
        setTaskTypes(taskTypes.filter((tt) => tt.id !== id));
      } catch (error) {
        console.error("Error deleting task type:", error);
      }
    }
  };

  if (loading) {
    return <div>Cargando tipos de tarea...</div>;
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
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight">Tipos de Tarea</h2>
          <p className="text-muted-foreground">
            Clasifica tus actividades de entrenamiento.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreateTaskTypeDialog onTaskTypeCreated={handleTaskTypeCreated} />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        {isDesktop ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="p-6">Nombre</TableHead>
                    <TableHead className="p-6">Descripción</TableHead>
                    <TableHead className="p-6">Color</TableHead>
                    <TableHead className="p-6 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskTypes.map((taskType) => (
                    <TableRow
                      key={taskType.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium p-6 flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-muted-foreground" />
                        {taskType.name}
                      </TableCell>
                      <TableCell className="p-6">
                        {taskType.description || "-"}
                      </TableCell>
                      <TableCell className="p-6">
                        <Badge
                          style={{ backgroundColor: taskType.color_hex }}
                          className="text-white text-xs"
                        >
                          <Palette className="mr-1 h-3 w-3" />{" "}
                          {taskType.color_hex}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4 text-blue-500" />{" "}
                              <span className="text-blue-500">Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(taskType.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />{" "}
                              <span className="text-red-500">Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {taskTypes.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-48 text-center text-lg text-muted-foreground"
                      >
                        No hay tipos de tarea definidos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskTypes.map((taskType) => (
              <TaskTypeCard
                key={taskType.id}
                taskType={taskType}
                onDelete={handleDelete}
              />
            ))}
             {taskTypes.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  No hay tipos de tarea definidos.
                </div>
              )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

