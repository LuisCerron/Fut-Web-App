"use client";

import { useState, useEffect } from "react";
import { LibraryTask, TaskType, Material, User, DifficultyLevel } from "@/modules/core/types/db.types";
import { tasksService } from "@/modules/tasks/services/tasks.service";
import { usersService } from "@/modules/users/services/users.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { PlusCircle, X } from "lucide-react";

interface CreateLibraryTaskDialogProps {
  onLibraryTaskCreated: (task: LibraryTask) => void;
}

export function CreateLibraryTaskDialog({ onLibraryTaskCreated }: CreateLibraryTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states for LibraryTask
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [taskTypeId, setTaskTypeId] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState<string>("0");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Media");
  const [isPublic, setIsPublic] = useState(true);
  const [creatorUserId, setCreatorUserId] = useState(""); // This should probably be the logged-in user

  // States for Task Materials
  const [selectedMaterials, setSelectedMaterials] = useState<{ material_id: string; required_quantity: number }[]>([]);
  const [currentMaterialId, setCurrentMaterialId] = useState("");
  const [currentMaterialQuantity, setCurrentMaterialQuantity] = useState<string>("1");

  // Data for selects
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (open) {
      loadDependencies();
    }
  }, [open]);

  const loadDependencies = async () => {
    try {
      const [taskTypesData, materialsData, usersData] = await Promise.all([
        tasksService.getTaskTypes(),
        tasksService.getMaterials(),
        usersService.getUsers(),
      ]);
      setTaskTypes(taskTypesData);
      setMaterials(materialsData);
      setUsers(usersData);
      // Pre-select current logged-in user as creator, if available
      // For now, setting to first user for demo purposes if not already set
      if (!creatorUserId && usersData.length > 0) {
        setCreatorUserId(usersData[0].id);
      }
      if (!taskTypeId && taskTypesData.length > 0) {
        setTaskTypeId(taskTypesData[0].id);
      }
      if (!currentMaterialId && materialsData.length > 0) {
        setCurrentMaterialId(materialsData[0].id);
      }
    } catch (error) {
      console.error("Error loading dependencies:", error);
    }
  };

  const handleAddMaterial = () => {
    if (currentMaterialId && parseInt(currentMaterialQuantity) > 0) {
      setSelectedMaterials((prev) => {
        const existingIndex = prev.findIndex(m => m.material_id === currentMaterialId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].required_quantity += parseInt(currentMaterialQuantity);
          return updated;
        }
        return [...prev, { material_id: currentMaterialId, required_quantity: parseInt(currentMaterialQuantity) }];
      });
      setCurrentMaterialQuantity("1");
    }
  };

  const handleRemoveMaterial = (materialId: string) => {
    setSelectedMaterials((prev) => prev.filter(m => m.material_id !== materialId));
  };

  const getMaterialName = (id: string) => {
    return materials.find(m => m.id === id)?.name || "Desconocido";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newLibraryTask = await tasksService.createLibraryTask(
        {
          name,
          description,
          task_type_id: taskTypeId,
          estimated_duration_min: parseInt(estimatedDuration),
          difficulty,
          is_public: isPublic,
          created_by_user_id: creatorUserId,
        },
        selectedMaterials
      );
      onLibraryTaskCreated(newLibraryTask);
      setOpen(false);
      // Reset form
      setName("");
      setDescription("");
      setTaskTypeId(taskTypes.length > 0 ? taskTypes[0].id : "");
      setEstimatedDuration("0");
      setDifficulty("Media");
      setIsPublic(true);
      setCreatorUserId(users.length > 0 ? users[0].id : "");
      setSelectedMaterials([]);
      setCurrentMaterialId(materials.length > 0 ? materials[0].id : "");
      setCurrentMaterialQuantity("1");
    } catch (error) {
      console.error("Error creating library task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Tarea de Biblioteca
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Tarea de Biblioteca</DialogTitle>
          <DialogDescription>
            Registra un nuevo ejercicio o tarea de entrenamiento reutilizable.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Rondo 4 vs 2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskType">Tipo de Tarea</Label>
                <Select value={taskTypeId} onValueChange={setTaskTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((tt) => (
                      <SelectItem key={tt.id} value={tt.id}>
                        {tt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción detallada del ejercicio..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración Estimada (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as DifficultyLevel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="isPublic">Pública (visible para otros entrenadores)</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creator">Creador</Label>
              <Select value={creatorUserId} onValueChange={setCreatorUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar creador" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 border-t pt-4">
              <Label>Materiales Requeridos</Label>
              <div className="flex gap-2">
                <Select value={currentMaterialId} onValueChange={setCurrentMaterialId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={currentMaterialQuantity}
                  onChange={(e) => setCurrentMaterialQuantity(e.target.value)}
                  min="1"
                  className="w-24"
                />
                <Button type="button" onClick={handleAddMaterial} disabled={!currentMaterialId || parseInt(currentMaterialQuantity) <= 0}>
                  Añadir
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {selectedMaterials.map((tm, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center justify-between pr-1">
                    {getMaterialName(tm.material_id)}: {tm.required_quantity}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-auto p-1 ml-2 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveMaterial(tm.material_id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
