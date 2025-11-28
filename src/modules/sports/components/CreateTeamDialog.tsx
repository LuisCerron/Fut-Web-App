"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Team } from "@/modules/core/types/db.types";
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
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CreateTeamDialogProps {
  onTeamCreated: (team: Team) => void;
}

export function CreateTeamDialog({ onTeamCreated }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isOwnTeam, setIsOwnTeam] = useState("true");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newTeam = await sportsService.createTeam({
        name,
        category,
        description,
        is_own_team: isOwnTeam === "true",
      });
      onTeamCreated(newTeam);
      toast.success("Equipo creado exitosamente");
      setOpen(false);
      setName("");
      setCategory("");
      setDescription("");
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Error al crear el equipo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 text-base">
          <Shield className="mr-2 h-5 w-5" />
          Nuevo Equipo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Crear Equipo</DialogTitle>
          <DialogDescription>
            Añade un nuevo equipo a tu academia o registra un rival.
          </DialogDescription>
        </DialogHeader>
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Equipo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 text-base"
                  placeholder="Ej: Sub-15"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={isOwnTeam} onValueChange={setIsOwnTeam}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Equipo Propio</SelectItem>
                    <SelectItem value="false">Equipo Rival</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Descripción (Opcional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Añade una breve descripción del equipo..."
                />
              </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="h-12 text-base w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : "Guardar Equipo"}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
