"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Trophy, 
  Settings, 
  LogOut,
  Tags,
  Package,
  BookText,
  FileText,
  ClipboardCheck,
  ListChecks,
  UserCheck,
  CalendarClock,
  Swords,
  DollarSign,
  type LucideIcon
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const sidebarGroups = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ]
  },
  {
    title: "Gestión Deportiva",
    items: [
      {
        title: "Jugadores",
        href: "/dashboard/players",
        icon: UserCheck,
      },
      {
        title: "Equipos",
        href: "/dashboard/teams",
        icon: Shield,
      },
      {
        title: "Sesiones",
        href: "/dashboard/sessions",
        icon: CalendarClock,
      },
      {
        title: "Partidos",
        href: "/dashboard/matches",
        icon: Swords,
      },
      {
        title: "Competencias",
        href: "/dashboard/competitions",
        icon: Trophy,
      },
    ]
  },
  {
    title: "Planificación",
    items: [
      {
        title: "Biblioteca de Tareas",
        href: "/dashboard/library-tasks",
        icon: BookText,
      },
      {
        title: "Tipos de Tarea",
        href: "/dashboard/task-types",
        icon: ListChecks,
      },
      {
        title: "Inventario",
        href: "/dashboard/inventory",
        icon: Package,
      },
    ]
  },
  {
    title: "Evaluación",
    items: [
      {
        title: "Evaluaciones",
        href: "/dashboard/evaluations",
        icon: ClipboardCheck,
      },
      {
        title: "Criterios",
        href: "/dashboard/attributes",
        icon: FileText,
      },
    ]
  },
  {
    title: "Administración",
    items: [
      {
        title: "Usuarios",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Cuotas",
        href: "/dashboard/dues",
        icon: DollarSign,
      },
      {
        title: "Posiciones",
        href: "/dashboard/positions",
        icon: Tags,
      },
      {
        title: "Configuración",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ]
  },
];

const navVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const mobileSidebarVariants = {
  hidden: { x: "-100%" },
  visible: { x: "0%", transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  exit: { x: "-100%", transition: { duration: 0.2 } },
};

function SidebarContent() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex h-16 items-center border-b px-6 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-wide relative z-10">
          <Trophy className="h-6 w-6 text-yellow-300 animate-pulse" />
          <span>Futbol Academia</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-6 scrollbar-thin scrollbar-thumb-green-200 dark:scrollbar-thumb-green-900">
        <motion.nav 
          className="grid items-start px-4 text-sm font-medium gap-1"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          {sidebarGroups.map((group, groupIndex) => (
            <motion.div key={groupIndex} className="mb-6" variants={itemVariants}>
              <h3 className="mb-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ease-in-out overflow-hidden",
                        isActive
                          ? "text-green-700 dark:text-green-400 font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon className={cn("h-4 w-4 relative z-10 transition-colors", isActive ? "text-green-600 dark:text-green-400" : "group-hover:text-green-600")} />
                      <span className="relative z-10">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.nav>
      </div>
      <div className="border-t p-4 bg-muted/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center text-green-700 dark:text-green-300 font-bold border-2 border-green-200 dark:border-green-700 shadow-sm">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@futbol.com</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <span className="text-sm font-medium text-muted-foreground">Tema</span>
            <ModeToggle />
          </div>
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Link>
        </div>
      </div>
    </>
  );
}


export function Sidebar({ isMobile, isOpen, onClose }: SidebarProps) {
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-64 flex-col border-r bg-card/50 backdrop-blur-xl z-50 flex"
              variants={mobileSidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
  
  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card/50 backdrop-blur-xl">
      <SidebarContent />
    </div>
  );
}
