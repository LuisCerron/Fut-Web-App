"use client";

import { useState } from "react";
import { Attribute, AttributeType, ScaleType } from "@/modules/core/types/db.types";
import { evaluationsService } from "@/modules/evaluations/services/evaluations.service";
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
import { PlusCircle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateAttributeDialogProps {
  onAttributeCreated: (attribute: Attribute) => void;
}

export function CreateAttributeDialog({ onAttributeCreated }: CreateAttributeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState<AttributeType>("Físico");
  const [scaleType, setScaleType] = useState<ScaleType>("Numérica 1-10");
  const [minValue, setMinValue] = useState<string>("1");
  const [maxValue, setMaxValue] = useState<string>("10");
  const [unit, setUnit] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newAttribute: Partial<Attribute> = {
        name,
        type,
        scale_type: scaleType,
      };

      if (scaleType.includes("Numérica")) {
        newAttribute.min_value = parseInt(minValue);
        newAttribute.max_value = parseInt(maxValue);
        newAttribute.unit = unit;
      } else if (scaleType === "Texto Libre") {
        newAttribute.unit = unit;
      } else if (scaleType === "Porcentaje") {
        newAttribute.unit = "%";
      }
      
      const createdAttribute = await evaluationsService.createAttribute(newAttribute);
      onAttributeCreated(createdAttribute);
      setOpen(false);
      toast.success("Criterio de evaluación creado");
      // Reset form
      setName("");
      setType("Físico");
      setScaleType("Numérica 1-10");
      setMinValue("1");
      setMaxValue("10");
      setUnit("");
    } catch (error) {
      console.error("Error creating attribute:", error);
      toast.error("Error al crear el criterio");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 md:h-12 px-4 md:px-6 gap-2 font-medium">
          <PlusCircle className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Nuevo Atributo</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Crear Atributo de Evaluación</DialogTitle>
          <DialogDescription>
            Define un nuevo criterio para evaluar el rendimiento de los jugadores.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre del Atributo
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 md:h-12"
                placeholder="Ej: Velocidad, Resistencia, Técnica de pase..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Categoría
              </Label>
              <Select value={type} onValueChange={(value) => setType(value as AttributeType)}>
                <SelectTrigger className="h-11 md:h-12">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Físico" className="py-3">🏃 Físico</SelectItem>
                  <SelectItem value="Técnico" className="py-3">⚽ Técnico</SelectItem>
                  <SelectItem value="Mental" className="py-3">🧠 Mental</SelectItem>
                  <SelectItem value="Táctico" className="py-3">📋 Táctico</SelectItem>
                  <SelectItem value="Personal" className="py-3">👤 Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scaleType" className="text-sm font-medium">
                Tipo de Escala
              </Label>
              <Select value={scaleType} onValueChange={(value) => setScaleType(value as ScaleType)}>
                <SelectTrigger className="h-11 md:h-12">
                  <SelectValue placeholder="Seleccionar escala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Numérica 1-10" className="py-3">Numérica (1-10)</SelectItem>
                  <SelectItem value="Porcentaje" className="py-3">Porcentaje (%)</SelectItem>
                  <SelectItem value="Letras A-F" className="py-3">Letras (A-F)</SelectItem>
                  <SelectItem value="Texto Libre" className="py-3">Texto Libre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scaleType.includes("Numérica") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minValue" className="text-sm font-medium">
                    Valor Mínimo
                  </Label>
                  <Input
                    id="minValue"
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    className="h-11 md:h-12"
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxValue" className="text-sm font-medium">
                    Valor Máximo
                  </Label>
                  <Input
                    id="maxValue"
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    className="h-11 md:h-12"
                    placeholder="10"
                  />
                </div>
              </div>
            )}

            {(scaleType.includes("Numérica") || scaleType === "Texto Libre") && (
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium">
                  Unidad {scaleType === "Texto Libre" && "(Opcional)"}
                </Label>
                <Input
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-11 md:h-12"
                  placeholder="Ej: segundos, metros, puntos..."
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="h-11 min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
