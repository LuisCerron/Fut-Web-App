"use client";

import { useEffect, useState } from "react";
import { sportsService } from "@/modules/sports/services/sports.service";
import { Users, Shield, Trophy, Plus, Calendar, ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    players: 0,
    teams: 0,
    positions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [players, teams, positions] = await Promise.all([
          sportsService.getPlayers(),
          sportsService.getTeams(),
          sportsService.getPositions()
        ]);
        setStats({
          players: players.length,
          teams: teams.length,
          positions: positions.length
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 p-1"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            Bienvenido al panel de administración de tu academia.
          </p>
        </div>
        <div className="flex gap-2">
           <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-600/20 transition-all active:scale-95">
             <Link href="/dashboard/players">
               <Plus className="mr-2 h-5 w-5" /> Nuevo Jugador
             </Link>
           </Button>
        </div>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Total Jugadores" 
            value={loading ? "..." : stats.players} 
            icon={Users} 
            description="Jugadores activos"
            color="text-blue-600"
            bgColor="bg-blue-100 dark:bg-blue-900/20"
            trend="+12% vs mes anterior"
        />
        <StatsCard 
            title="Equipos" 
            value={loading ? "..." : stats.teams} 
            icon={Shield} 
            description="Categorías registradas"
            color="text-green-600"
            bgColor="bg-green-100 dark:bg-green-900/20"
            trend="+2 nuevas categorías"
        />
        <StatsCard 
            title="Posiciones" 
            value={loading ? "..." : stats.positions} 
            icon={Trophy} 
            description="Roles definidos"
            color="text-yellow-600"
            bgColor="bg-yellow-100 dark:bg-yellow-900/20"
            trend="Estructura estable"
        />
         <StatsCard 
            title="Próximos Partidos" 
            value={3} 
            icon={Calendar} 
            description="Esta semana"
            color="text-purple-600"
            bgColor="bg-purple-100 dark:bg-purple-900/20"
            trend="Próximo: Sábado 10AM"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={item} className="col-span-4">
          <Card className="h-full border-none shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.02)" }}
                    className="flex items-center gap-4 p-3 rounded-xl transition-colors cursor-default"
                  >
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold shadow-sm">
                      JM
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Nuevo jugador registrado</p>
                      <p className="text-xs text-muted-foreground">Hace {i * 2} horas • Sistema</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item} className="col-span-3">
          <Card className="h-full border-none shadow-md bg-gradient-to-br from-green-600 to-teal-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
            
            <CardHeader>
              <CardTitle className="text-white text-xl">Acceso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 relative z-10">
              <Button variant="secondary" className="w-full justify-start h-12 bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm transition-all hover:pl-6">
                <Shield className="mr-3 h-5 w-5" /> Gestionar Equipos
              </Button>
              <Button variant="secondary" className="w-full justify-start h-12 bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm transition-all hover:pl-6">
                <Trophy className="mr-3 h-5 w-5" /> Ver Torneos
              </Button>
              <Button variant="secondary" className="w-full justify-start h-12 bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm transition-all hover:pl-6">
                <Calendar className="mr-3 h-5 w-5" /> Calendario
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatsCard({ title, value, icon: Icon, description, color, bgColor, trend }: any) {
  return (
    <motion.div variants={item} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 -mr-4 -mt-4 transition-transform group-hover:scale-110", color.replace('text-', 'bg-'))} />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn("p-2.5 rounded-xl shadow-sm", bgColor)}>
              <Icon className={cn("h-5 w-5", color)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <div className="flex items-center mt-1 gap-2">
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
            {trend && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {trend}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
