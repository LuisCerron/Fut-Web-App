"use client";

import { useState, useEffect } from "react";
import { Due, Player, DueStatus, PaymentMethod } from "@/modules/core/types/db.types";
import { financesService } from "@/modules/finances/services/finances.service";
import { sportsService } from "@/modules/sports/services/sports.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { PlusCircle } from "lucide-react";

interface CreateDueDialogProps {
  onDueCreated: (due: Due) => void;
}

export function CreateDueDialog({ onDueCreated }: CreateDueDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [playerId, setPlayerId] = useState("");
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Data for selects
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (open) {
      loadDependencies();
    }
  }, [open]);

  const loadDependencies = async () => {
    try {
      const playersData = await sportsService.getPlayers();
      setPlayers(playersData);
    } catch (error) {
      console.error("Error loading dependencies:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newDue = await financesService.createDue({
        player_id: playerId,
        concept,
        amount: parseFloat(amount),
        due_date: new Date(dueDate).toISOString(),
      });
      onDueCreated(newDue);
      setOpen(false);
      // Reset form
      setPlayerId("");
      setConcept("");
      setAmount("");
      setDueDate("");
    } catch (error) {
      console.error("Error creating due:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Cuota
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Cuota</DialogTitle>
          <DialogDescription>
            Registra una nueva cuota para un jugador.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jugador</Label>
              <Select value={playerId} onValueChange={setPlayerId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar jugador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="concept">Concepto</Label>
              <Input
                id="concept"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ej: Cuota Mensual - Febrero 2024"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej: 60"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cuota"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
