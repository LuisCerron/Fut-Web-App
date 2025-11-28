
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Position } from "@/modules/core/types/db.types";
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
import { CreatePositionDialog } from "./CreatePositionDialog";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMedia } from "@/lib/hooks/use-media";
import { PositionCard } from "./PositionCard";

export function PositionList() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const isDesktop = useMedia("(min-width: 768px)");

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      const data = await sportsService.getPositions();
      setPositions(data);
    } catch (error) {
      console.error("Error loading positions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePositionCreated = (newPosition: Position) => {
    setPositions([...positions, newPosition]);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta posición?")) {
      try {
        await sportsService.deletePosition(id);
        setPositions(positions.filter((pos) => pos.id !== id));
      } catch (error) {
        console.error("Error deleting position:", error);
      }
    }
  };

  if (loading) {
    return <div>Cargando posiciones...</div>;
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
          <h2 className="text-3xl font-bold tracking-tight">Posiciones</h2>
          <p className="text-muted-foreground">
            Configura las posiciones tácticas disponibles.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreatePositionDialog onPositionCreated={handlePositionCreated} />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        {isDesktop ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="p-6">Nombre</TableHead>
                    <TableHead className="p-6">Abreviatura</TableHead>
                    <TableHead className="p-6">Área</TableHead>
                    <TableHead className="p-6 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position) => (
                    <TableRow
                      key={position.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium p-6">
                        {position.name}
                      </TableCell>
                      <TableCell className="p-6">
                        <Badge variant="secondary" className="font-mono text-sm">
                          {position.abbreviation}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-6">{position.area}</TableCell>
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
                              onClick={() => handleDelete(position.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />{" "}
                              <span className="text-red-500">Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {positions.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-48 text-center text-lg text-muted-foreground"
                      >
                        No hay posiciones definidas.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {positions.map((position) => (
              <PositionCard
                key={position.id}
                position={position}
                onDelete={handleDelete}
              />
            ))}
            {positions.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  No hay posiciones definidas.
                </div>
              )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

