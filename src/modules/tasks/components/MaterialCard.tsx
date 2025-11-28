
"use client";

import { Material } from "@/modules/core/types/db.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Package } from "lucide-react";

interface MaterialCardProps {
  material: Material;
  onDelete: (id: string) => void;
}

export function MaterialCard({ material, onDelete }: MaterialCardProps) {
  const getStatusBadgeVariant = (status: Material["status"]) => {
    switch (status) {
      case "Disponible":
        return "default";
      case "En Mantenimiento":
        return "secondary";
      case "Baja":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{material.name}</CardTitle>
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
            <DropdownMenuItem onClick={() => onDelete(material.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
            <p className="text-lg font-bold">{material.available_quantity}</p>
            <p className="text-sm text-muted-foreground">/{material.total_quantity} disponibles</p>
        </div>
        <Badge variant={getStatusBadgeVariant(material.status)} className="mt-4">
          {material.status}
        </Badge>
      </CardContent>
    </Card>
  );
}
