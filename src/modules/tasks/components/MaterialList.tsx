
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Material } from "@/modules/core/types/db.types";
import { tasksService } from "@/modules/tasks/services/tasks.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateMaterialDialog } from "./CreateMaterialDialog";
import { Trash2, Edit, MoreHorizontal, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMedia } from "@/lib/hooks/use-media";
import { MaterialCard } from "./MaterialCard";

export function MaterialList() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const isDesktop = useMedia("(min-width: 768px)");

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const data = await tasksService.getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error("Error loading materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialCreated = (newMaterial: Material) => {
    setMaterials([...materials, newMaterial]);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este material?")) {
      try {
        await tasksService.deleteMaterial(id);
        setMaterials(materials.filter((m) => m.id !== id));
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

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

  if (loading) {
    return <div>Cargando inventario...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight">
            Inventario de Material
          </h2>
          <p className="text-muted-foreground">
            Gestión de equipamiento deportivo.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreateMaterialDialog onMaterialCreated={handleMaterialCreated} />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        {isDesktop ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="p-6">Material</TableHead>
                    <TableHead className="p-6">Cantidad Total</TableHead>
                    <TableHead className="p-6">Cantidad Disponible</TableHead>
                    <TableHead className="p-6">Estado</TableHead>
                    <TableHead className="p-6 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow
                      key={material.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium p-6 flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-muted-foreground" />
                        {material.name}
                      </TableCell>
                      <TableCell className="p-6">
                        {material.total_quantity}
                      </TableCell>
                      <TableCell className="p-6">
                        {material.available_quantity}
                      </TableCell>
                      <TableCell className="p-6">
                        <Badge variant={getStatusBadgeVariant(material.status)}>
                          {material.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4 text-blue-500" />{" "}
                              <span className="text-blue-500">Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(material.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />{" "}
                              <span className="text-red-500">Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {materials.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-48 text-center text-lg text-muted-foreground"
                      >
                        No hay material en el inventario.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onDelete={handleDelete}
              />
            ))}
            {materials.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  No hay material en el inventario.
                </div>
              )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

