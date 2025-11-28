"use client";

import { useState } from "react";
import { Material } from "@/modules/core/types/db.types";
import { tasksService } from "@/modules/tasks/services/tasks.service";
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
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateMaterialDialogProps {
  onMaterialCreated: (material: Material) => void;
}

export function CreateMaterialDialog({ onMaterialCreated }: CreateMaterialDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [totalQuantity, setTotalQuantity] = useState<string>("0");
  const [availableQuantity, setAvailableQuantity] = useState<string>("0");
  const [status, setStatus] = useState<Material["status"]>("Disponible");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newMaterial = await tasksService.createMaterial({
        name,
        total_quantity: parseInt(totalQuantity),
        available_quantity: parseInt(availableQuantity),
        status,
      });
      onMaterialCreated(newMaterial);
      setOpen(false);
      setName("");
      setTotalQuantity("0");
      setAvailableQuantity("0");
      setStatus("Disponible");
    } catch (error) {
      console.error("Error creating material:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Material</DialogTitle>
          <DialogDescription>
            Añade un nuevo ítem al inventario de material deportivo.
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
                placeholder="Ej: Conos"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalQuantity" className="text-right">
                Cantidad Total
              </Label>
              <Input
                id="totalQuantity"
                type="number"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(e.target.value)}
                className="col-span-3"
                min="0"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availableQuantity" className="text-right">
                Cantidad Disponible
              </Label>
              <Input
                id="availableQuantity"
                type="number"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                className="col-span-3"
                min="0"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Estado
              </Label>
              <div className="col-span-3">
                <Select value={status} onValueChange={(value) => setStatus(value as Material["status"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
