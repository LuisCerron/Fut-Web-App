"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Player, Team, Position } from "@/modules/core/types/db.types";
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
  SELECT_NONE_VALUE,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CreatePlayerDialogProps {
  onPlayerCreated: (player: Player) => void;
}

export function CreatePlayerDialog({ onPlayerCreated }: CreatePlayerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [teamId, setTeamId] = useState("");
  const [positionPrimaryId, setPositionPrimaryId] = useState("");
  const [positionSecondaryId, setPositionSecondaryId] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [dominantFoot, setDominantFoot] = useState<Player["dominant_foot"]>("RIGHT");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");


  // Data for selects
  const [teams, setTeams] = useState<Team[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    if (open) {
      loadDependencies();
    }
  }, [open]);

  const loadDependencies = async () => {
    try {
      const [teamsData, positionsData] = await Promise.all([
        sportsService.getTeams(),
        sportsService.getPositions()
      ]);
      setTeams(teamsData.filter(t => t.is_own_team));
      setPositions(positionsData);
    } catch (error) {
      console.error("Error loading dependencies:", error);
      toast.error("Error al cargar datos para el formulario");
    }
  };
  
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setDni("");
    setBirthDate("");
    setTeamId("");
    setPositionPrimaryId("");
    setPositionSecondaryId("");
    setJerseyNumber("");
    setDominantFoot("RIGHT");
    setHeight("");
    setWeight("");
    setEmergencyContact("");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newPlayer = await sportsService.createPlayer({
        first_name: firstName,
        last_name: lastName,
        dni,
        birth_date: birthDate,
        team_id: teamId,
        position_primary_id: positionPrimaryId,
        position_secondary_id: positionSecondaryId,
        jersey_number: parseInt(jerseyNumber) || undefined,
        dominant_foot: dominantFoot,
        height_cm: parseInt(height) || undefined,
        weight_kg: parseInt(weight) || undefined,
        emergency_contact: emergencyContact,
        is_active: true,
      });
      onPlayerCreated(newPlayer);
      toast.success("Jugador registrado exitosamente");
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating player:", error);
      toast.error("Error al registrar el jugador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 text-base">
          <UserPlus className="mr-2 h-5 w-5" />
          Nuevo Jugador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Jugador</DialogTitle>
          <DialogDescription>
            Ingresa los datos del jugador para crear su ficha técnica.
          </DialogDescription>
        </DialogHeader>
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-h-[70vh] overflow-y-auto pr-4"
        >
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12 text-base" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12 text-base" required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" value={dni} onChange={(e) => setDni(e.target.value)} className="h-12 text-base" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="h-12 text-base" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                <Label>Equipo</Label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar equipo" /></SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => ( <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem> ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jersey">Dorsal</Label>
                <Input id="jersey" type="number" value={jerseyNumber} onChange={(e) => setJerseyNumber(e.target.value)} className="h-12 text-base" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Posición Principal</Label>
                <Select value={positionPrimaryId} onValueChange={setPositionPrimaryId}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar posición" /></SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => ( <SelectItem key={p.id} value={p.id}>{p.name} ({p.abbreviation})</SelectItem> ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Posición Secundaria</Label>
                <Select
                  value={positionSecondaryId}
                  onValueChange={(v) => setPositionSecondaryId(v === SELECT_NONE_VALUE ? "" : v)}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Seleccionar posición (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_NONE_VALUE}>Ninguna</SelectItem>
                    {positions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Pie Dominante</Label>
                <Select value={dominantFoot} onValueChange={(v) => setDominantFoot(v as Player["dominant_foot"])}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seleccionar pie" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RIGHT">Derecho</SelectItem>
                    <SelectItem value="LEFT">Izquierdo</SelectItem>
                    <SelectItem value="BOTH">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-12 text-base" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
              <Textarea id="emergencyContact" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Nombre y teléfono de contacto..." />
            </div>

          </div>
          <DialogFooter className="pt-4 border-t">
            <Button type="submit" disabled={isLoading} className="h-12 text-base w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : "Guardar Jugador"}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
