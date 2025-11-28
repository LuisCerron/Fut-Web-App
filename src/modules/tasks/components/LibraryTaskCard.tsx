
"use client";

import {
  LibraryTask,
  TaskType,
  User,
  Material,
  TaskMaterial,
} from "@/modules/core/types/db.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  BarChart,
  User as UserIcon,
  Eye,
  EyeOff,
  Package,
  ChevronDown,
} from "lucide-react";

interface LibraryTaskCardProps {
  task: LibraryTask;
  taskType?: TaskType;
  creator?: User;
  materials: Material[];
  taskMaterials: TaskMaterial[];
  onDelete: (id: string) => void;
}

export function LibraryTaskCard({
  task,
  taskType,
  creator,
  materials,
  taskMaterials,
  onDelete,
}: LibraryTaskCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            {taskType && (
              <Badge
                style={{ backgroundColor: taskType.color_hex }}
                className="text-white text-xs mb-2"
              >
                {taskType.name}
              </Badge>
            )}
            <CardTitle>{task.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground">{task.description || "Sin descripción."}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{task.estimated_duration_min || "-"} min</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">{task.difficulty || "N/A"}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span>{creator?.full_name || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            {task.is_public ? (
              <>
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Pública</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <span>Privada</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-0">
        {taskMaterials.length > 0 && (
          <Collapsible className="w-full">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-6 py-4 border-t">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Materiales Requeridos ({taskMaterials.length})</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-4 space-y-2">
              {taskMaterials.map((tm) => {
                const material = materials.find(m => m.id === tm.material_id);
                return (
                  <div key={tm.material_id} className="flex justify-between items-center text-sm">
                    <span>{material?.name || "Desconocido"}</span>
                    <Badge variant="secondary">x{tm.required_quantity}</Badge>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardFooter>
    </Card>
  );
}
