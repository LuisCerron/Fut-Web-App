
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  LibraryTask,
  TaskType,
  Material,
  User,
  TaskMaterial,
} from "@/modules/core/types/db.types";
import { tasksService } from "@/modules/tasks/services/tasks.service";
import { usersService } from "@/modules/users/services/users.service"; // To get user details
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateLibraryTaskDialog } from "./CreateLibraryTaskDialog";
import {
  Trash2,
  BookText,
  Eye,
  EyeOff,
  Package,
  ChevronDown,
  ChevronUp,
  Edit,
  MoreHorizontal,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMedia } from "@/lib/hooks/use-media";
import { LibraryTaskCard } from "./LibraryTaskCard";

export function LibraryTaskList() {
  const [libraryTasks, setLibraryTasks] = React.useState<LibraryTask[]>([]);
  const [taskTypes, setTaskTypes] = React.useState<Record<string, TaskType>>({});
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [users, setUsers] = React.useState<Record<string, User>>({});
  const [taskMaterials, setTaskMaterials] = React.useState<
    Record<string, TaskMaterial[]>
  >({});
  const [expandedTasks, setExpandedTasks] = React.useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = React.useState(true);
  const isDesktop = useMedia("(min-width: 1024px)");

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        libraryTasksData,
        taskTypesData,
        materialsData,
        usersData,
      ] = await Promise.all([
        tasksService.getLibraryTasks(),
        tasksService.getTaskTypes(),
        tasksService.getMaterials(),
        usersService.getUsers(),
      ]);

      setLibraryTasks(libraryTasksData);
      setMaterials(materialsData);

      const taskTypesMap = taskTypesData.reduce(
        (acc, tt) => ({ ...acc, [tt.id]: tt }),
        {}
      );
      setTaskTypes(taskTypesMap);

      const usersMap = usersData.reduce(
        (acc, u) => ({ ...acc, [u.id]: u }),
        {}
      );
      setUsers(usersMap);

      const taskMaterialsMap: Record<string, TaskMaterial[]> = {};
      for (const task of libraryTasksData) {
        const mats = await tasksService.getTaskMaterialsForTask(task.id);
        taskMaterialsMap[task.id] = mats;
      }
      setTaskMaterials(taskMaterialsMap);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleLibraryTaskCreated = async (newLibraryTask: LibraryTask) => {
    setLibraryTasks([...libraryTasks, newLibraryTask]);
    const mats = await tasksService.getTaskMaterialsForTask(newLibraryTask.id);
    setTaskMaterials((prev) => ({ ...prev, [newLibraryTask.id]: mats }));
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta tarea de la biblioteca?")) {
      try {
        await tasksService.deleteLibraryTask(id);
        setLibraryTasks(libraryTasks.filter((lt) => lt.id !== id));
        const newTaskMaterials = { ...taskMaterials };
        delete newTaskMaterials[id];
        setTaskMaterials(newTaskMaterials);
      } catch (error) {
        console.error("Error deleting library task:", error);
      }
    }
  };

  const getTaskMaterialCount = (taskId: string): number => {
    return taskMaterials[taskId]?.length || 0;
  };

  if (loading) {
    return <div>Cargando biblioteca de tareas...</div>;
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
          <h2 className="text-3xl font-bold tracking-tight">
            Biblioteca de Tareas
          </h2>
          <p className="text-muted-foreground">
            Crea y gestiona ejercicios de entrenamiento reutilizables.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreateLibraryTaskDialog
            onLibraryTaskCreated={handleLibraryTaskCreated}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        {isDesktop ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] p-6"></TableHead>
                    <TableHead className="p-6">Tarea</TableHead>
                    <TableHead className="p-6">Tipo</TableHead>
                    <TableHead className="p-6 hidden sm:table-cell">
                      Dificultad
                    </TableHead>
                    <TableHead className="p-6 hidden sm:table-cell">
                      Duración (min)
                    </TableHead>
                    <TableHead className="p-6 hidden md:table-cell">
                      Materiales
                    </TableHead>
                    <TableHead className="p-6 hidden lg:table-cell">
                      Creador
                    </TableHead>
                    <TableHead className="p-6 hidden lg:table-cell">
                      Pública
                    </TableHead>
                    <TableHead className="p-6 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {libraryTasks.map((task) => {
                    const materialCount = getTaskMaterialCount(task.id);
                    const isExpanded = expandedTasks.has(task.id);
                    const taskMaterialsList = taskMaterials[task.id] || [];

                    return (
                      <React.Fragment key={task.id}>
                        <TableRow
                          className={cn(
                            isExpanded && "border-b-0",
                            "transition-colors hover:bg-muted/50"
                          )}
                        >
                          <TableCell className="p-6">
                            {materialCount > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => toggleTaskExpanded(task.id)}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="font-medium p-6">
                            <div className="flex items-center gap-2">
                              <BookText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-semibold text-base">
                                  {task.name}
                                </p>
                                {task.description && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[150px] md:max-w-[200px]">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-6">
                            <Badge
                              style={{
                                backgroundColor: task.task_type_id
                                  ? taskTypes[task.task_type_id]?.color_hex
                                  : undefined,
                              }}
                              className="text-white text-xs"
                            >
                              {task.task_type_id
                                ? taskTypes[task.task_type_id]?.name
                                : "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-6 hidden sm:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {task.difficulty || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-6 hidden sm:table-cell">
                            {task.estimated_duration_min || "-"}
                          </TableCell>
                          <TableCell className="p-6 hidden md:table-cell">
                            {materialCount > 0 ? (
                              <Badge
                                variant="secondary"
                                className="gap-1 text-xs"
                              >
                                <Package className="h-3 w-3" />
                                {materialCount}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="p-6 hidden lg:table-cell text-sm">
                            <div className="flex items-center gap-1">
                              <UserIcon className="h-3 w-3 text-muted-foreground" />
                              {task.created_by_user_id
                                ? users[task.created_by_user_id]?.full_name
                                : "Desconocido"}
                            </div>
                          </TableCell>
                          <TableCell className="p-6 hidden lg:table-cell">
                            {task.is_public ? (
                              <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="p-6 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-9 w-9 p-0"
                                >
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
                                  onClick={() => handleDelete(task.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />{" "}
                                  <span className="text-red-500">
                                    Eliminar
                                  </span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {isExpanded && taskMaterialsList.length > 0 && (
                          <TableRow
                            key={`${task.id}-materials`}
                            className="bg-muted/30 hover:bg-muted/40 transition-colors"
                          >
                            <TableCell></TableCell>
                            <TableCell colSpan={8} className="py-3 px-6">
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                  <Package className="h-4 w-4" />
                                  Materiales requeridos:
                                </p>

                                <div className="flex flex-wrap gap-2 ml-6">
                                  {taskMaterialsList.map((tm) => {
                                    const material = materials.find(
                                      (m) => m.id === tm.material_id
                                    );
                                    return (
                                      <Badge
                                        key={tm.material_id}
                                        variant="outline"
                                        className="gap-2 py-1.5 px-3"
                                      >
                                        <span className="font-medium">
                                          {material?.name ||
                                            "Material desconocido"}
                                        </span>
                                        <span className="text-muted-foreground">
                                          x{tm.required_quantity}
                                        </span>
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {libraryTasks.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-48 text-center text-lg text-muted-foreground"
                      >
                        No hay tareas en la biblioteca.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {libraryTasks.map((task) => (
              <LibraryTaskCard
                key={task.id}
                task={task}
                taskType={
                  task.task_type_id ? taskTypes[task.task_type_id] : undefined
                }
                creator={
                  task.created_by_user_id
                    ? users[task.created_by_user_id]
                    : undefined
                }
                materials={materials}
                taskMaterials={taskMaterials[task.id] || []}
                onDelete={handleDelete}
              />
            ))}
            {libraryTasks.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  No hay tareas en la biblioteca.
                </div>
              )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

