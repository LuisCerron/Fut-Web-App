"use client";

import { useState } from "react";
import { Position } from "@/modules/core/types/db.types";
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

interface CreatePositionDialogProps {
  onPositionCreated: (position: Position) => void;
}

export function CreatePositionDialog({ onPositionCreated }: CreatePositionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newPosition = await sportsService.createPosition({
        name,
        abbreviation,
        area,
      });
      onPositionCreated(newPosition);
      setOpen(false);
      setName("");
      setAbbreviation("");
      setArea("");
    } catch (error) {
      console.error("Error creating position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nueva Posición</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Posición</DialogTitle>
          <DialogDescription>
            Define una nueva posición táctica para tus jugadores.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Mediocentro Ofensivo"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="abbr" className="text-right">
                Abrev.
              </Label>
              <Input
                id="abbr"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                className="col-span-3"
                placeholder="Ej: MCO"
                maxLength={5}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">
                Área
              </Label>
              <div className="col-span-3">
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Portería">Portería</SelectItem>
                    <SelectItem value="Defensa">Defensa</SelectItem>
                    <SelectItem value="Mediocampo">Mediocampo</SelectItem>
                    <SelectItem value="Ataque">Ataque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Posición"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
