"use client";

import { useEffect, useState } from "react";
import { Due, Player } from "@/modules/core/types/db.types";
import { financesService } from "@/modules/finances/services/finances.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateDueDialog } from "./CreateDueDialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedia } from "@/lib/hooks/use-media";
import { DueCard } from "./DueCard";

export function DuesList() {
  const [dues, setDues] = useState<Due[]>([]);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [loading, setLoading] = useState(true);
  const isDesktop = useMedia("(min-width: 768px)");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [duesData, playersData] = await Promise.all([
        financesService.getDues(),
        sportsService.getPlayers(),
      ]);

      setDues(duesData);

      const playersMap = playersData.reduce(
        (acc, p) => ({ ...acc, [p.id]: p }),
        {}
      );
      setPlayers(playersMap);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDueCreated = (newDue: Due) => {
    setDues([...dues, newDue]);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta cuota?")) {
      try {
        await financesService.deleteDue(id);
        setDues(dues.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error deleting due:", error);
      }
    }
  };

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

  if (loading) {
    return <div>Cargando cuotas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cuotas</h2>
          <p className="text-muted-foreground">
            Gestión de cuotas de jugadores.
          </p>
        </div>
        <CreateDueDialog onDueCreated={handleDueCreated} />
      </div>

      {isDesktop ? (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jugador</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha de Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dues.map((due) => (
                <TableRow key={due.id}>
                  <TableCell className="font-medium">
                    {players[due.player_id]?.first_name || "N/A"}{" "}
                    {players[due.player_id]?.last_name || ""}
                  </TableCell>
                  <TableCell>{due.concept}</TableCell>
                  <TableCell>${due.amount}</TableCell>
                  <TableCell>
                    {new Date(due.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(due.status)}>
                      {due.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(due.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {dues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay cuotas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dues.map((due) => (
            <DueCard
              key={due.id}
              due={due}
              player={players[due.player_id]}
              onDelete={handleDelete}
            />
          ))}
          {dues.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No hay cuotas registradas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
