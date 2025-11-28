
"use client";

import { TaskType } from "@/modules/core/types/db.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Palette } from "lucide-react";

interface TaskTypeCardProps {
  taskType: TaskType;
  onDelete: (id: string) => void;
}

export function TaskTypeCard({ taskType, onDelete }: TaskTypeCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{taskType.name}</CardTitle>
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
            <DropdownMenuItem onClick={() => onDelete(taskType.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {taskType.description || "Sin descripción"}
        </p>
        <Badge
          style={{ backgroundColor: taskType.color_hex }}
          className="text-white mt-4"
        >
          <Palette className="mr-1 h-3 w-3" />
          {taskType.color_hex}
        </Badge>
      </CardContent>
    </Card>
  );
}
