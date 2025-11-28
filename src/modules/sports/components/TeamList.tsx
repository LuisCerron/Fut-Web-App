"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Team } from "@/modules/core/types/db.types";
import { sportsService } from "@/modules/sports/services/sports.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { Shield, Users, Trash2, ShieldQuestion, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const data = await sportsService.getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamCreated = (newTeam: Team) => {
    setTeams([...teams, newTeam]);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este equipo?")) {
      try {
        await sportsService.deleteTeam(id);
        setTeams(teams.filter(t => t.id !== id));
      } catch (error) {
        console.error("Error deleting team:", error);
      }
    }
  };
  
  const filteredTeams = useMemo(() => teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [teams, searchTerm]);

  if (loading) {
    return <div>Cargando equipos...</div>;
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
          <h2 className="text-3xl font-bold tracking-tight">Equipos</h2>
          <p className="text-muted-foreground">
            Gestiona los equipos de tu academia y rivales.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreateTeamDialog onTeamCreated={handleTeamCreated} />
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants}>
        <Input 
          placeholder="Buscar equipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 text-base max-w-sm"
        />
      </motion.div>

      <motion.div 
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
      >
        {filteredTeams.map((team) => (
          <motion.div
            key={team.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="group relative"
          >
            <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 bg-muted/30">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold">
                    {team.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{team.category || "Sin categoría"}</p>
                </div>
                <Shield 
                  className={`h-6 w-6 transition-colors ${team.is_own_team ? "text-primary" : "text-muted-foreground"}`} 
                />
              </CardHeader>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant={team.is_own_team ? "default" : "secondary"}>
                      {team.is_own_team ? "Academia" : "Rival"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="h-4 w-4" /> Jugadores
                    </span>
                    <span className="font-bold text-lg">--</span>
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => handleDelete(e, team.id)} 
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-700 hover:bg-red-50 h-9 px-3"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
         {filteredTeams.length === 0 && (
          <motion.div 
            className="col-span-full text-center py-24 flex flex-col items-center justify-center bg-muted rounded-lg"
            variants={itemVariants}
          >
            <ShieldQuestion className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron equipos</h3>
            <p className="text-muted-foreground">Intenta ajustar tu búsqueda o crea un nuevo equipo.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
