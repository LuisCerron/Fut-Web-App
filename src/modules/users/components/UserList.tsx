"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { User, Role } from "@/modules/core/types/db.types";
import { usersService } from "@/modules/users/services/users.service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserDialog } from "./CreateUserDialog";
import { Search, Edit, Power, PowerOff, Mail, Phone, Shield, UserCog, Users, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Generate consistent colors for users
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getUserColor(id: string) {
  const hash = hashString(id);
  const hue = hash % 360;
  return {
    bg: `hsl(${hue}, 70%, 95%)`,
    text: `hsl(${hue}, 70%, 35%)`,
    accent: `hsl(${hue}, 60%, 50%)`,
  };
}

const roleIcons: Record<string, React.ReactNode> = {
  ADMIN: <Crown className="h-3.5 w-3.5" />,
  COACH: <Shield className="h-3.5 w-3.5" />,
  PARENT: <Users className="h-3.5 w-3.5" />,
  PLAYER: <UserCog className="h-3.5 w-3.5" />,
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
  COACH: "bg-blue-100 text-blue-700 border-blue-200",
  PARENT: "bg-green-100 text-green-700 border-green-200",
  PLAYER: "bg-amber-100 text-amber-700 border-amber-200",
};

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        usersService.getUsers(),
        usersService.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = (newUser: User) => {
    setUsers([...users, newUser]);
    toast.success("Usuario creado exitosamente");
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const updatedUser = await usersService.toggleUserStatus(userId);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      toast.success(updatedUser.is_active ? "Usuario activado" : "Usuario desactivado");
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Error al cambiar estado");
    }
  };

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.name || roleId;
  };

  const filteredUsers = useMemo(() => users.filter((user) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      user.full_name?.toLowerCase().includes(search) ||
      user.dni.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);
    
    const matchesRole = roleFilter === "ALL" || user.role_id === roleFilter;

    return matchesSearch && matchesRole;
  }), [users, searchTerm, roleFilter]);

  // Stats
  const stats = useMemo(() => {
    const byRole = roles.reduce((acc, role) => {
      acc[role.name] = users.filter(u => u.role_id === role.id).length;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: users.length,
      active: users.filter(u => u.is_active).length,
      byRole,
    };
  }, [users, roles]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserCog className="h-6 w-6 text-primary" />
            Usuarios
          </h2>
          <p className="text-muted-foreground">
            Gestión de administradores, entrenadores y padres
          </p>
        </div>
        <CreateUserDialog onUserCreated={handleUserCreated} />
      </div>

      {/* Role Stats */}
      <div className="flex flex-wrap gap-3">
        {roles.map(role => (
          <Card 
            key={role.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${roleFilter === role.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setRoleFilter(roleFilter === role.id ? "ALL" : role.id)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${roleColors[role.name] || 'bg-gray-100'}`}>
                {roleIcons[role.name] || <UserCog className="h-3.5 w-3.5" />}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{role.name}</p>
                <p className="text-lg font-bold">{stats.byRole[role.name] || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, DNI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px] h-11">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user, index) => {
          const colors = getUserColor(user.id);
          const roleName = getRoleName(user.role_id);
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className={`group overflow-hidden transition-all hover:shadow-lg ${!user.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="p-0">
                  {/* Header accent */}
                  <div 
                    className="h-2"
                    style={{ background: colors.accent }}
                  />
                  
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar className="h-14 w-14 border-2 shadow-sm" style={{ borderColor: colors.accent }}>
                        <AvatarFallback 
                          className="text-lg font-bold"
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          {user.full_name?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{user.full_name}</h3>
                          {!user.is_active && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                              Inactivo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.dni}</p>
                        <Badge 
                          variant="outline" 
                          className={`mt-2 ${roleColors[roleName] || ''}`}
                        >
                          {roleIcons[roleName]}
                          <span className="ml-1">{roleName}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant={user.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className="flex-1"
                      >
                        {user.is_active ? (
                          <>
                            <PowerOff className="h-3.5 w-3.5 mr-1" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Power className="h-3.5 w-3.5 mr-1" />
                            Activar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No se encontraron usuarios</p>
          <p className="text-sm">Intenta ajustar los filtros o crear un nuevo usuario</p>
        </div>
      )}
    </motion.div>
  );
}

