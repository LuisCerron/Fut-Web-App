
"use client";

import { Due, Player } from "@/modules/core/types/db.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, User, Calendar, DollarSign, Info } from "lucide-react";

interface DueCardProps {
  due: Due;
  player?: Player;
  onDelete: (id: string) => void;
}

export function DueCard({ due, player, onDelete }: DueCardProps) {
  const getStatusBadgeVariant = (status: Due["status"]) => {
    switch (status) {
      case "Pendiente":
        return "secondary";
      case "Pagada":
        return "default";
      case "Vencida":
        return "destructive";
      case "Anulada":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {player ? `${player.first_name} ${player.last_name}` : "Cargando..."}
        </CardTitle>
        <Badge variant={getStatusBadgeVariant(due.status)}>{due.status}</Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center">
          <Info className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{due.concept}</p>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-2xl font-bold">${due.amount}</p>
        </div>
        <div className="flex items-center pt-2">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Vence el {new Date(due.due_date).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      <div className="border-t px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(due.id)}
          className="w-full justify-center text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </Card>
  );
}
