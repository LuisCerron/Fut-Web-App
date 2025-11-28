"use client";

import { useState, useEffect } from "react";
import { Session, User } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { usersService } from "@/modules/users/services/users.service";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { UserCog } from "lucide-react";

interface DelegateSessionDialogProps {
  session: Session;
  onSessionUpdated: (updatedSession: Session) => void;
}

export function DelegateSessionDialog({ session, onSessionUpdated }: DelegateSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(session.responsible_user_id);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      const usersData = await usersService.getUsers();
      // Filter for coaches and admins
      setUsers(usersData.filter(u => u.role_id === "role-coach" || u.role_id === "role-admin"));
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedSession = await sessionsService.delegateSession(session.id, selectedUserId);
      onSessionUpdated(updatedSession);
      setOpen(false);
    } catch (error) {
      console.error("Error delegating session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCog className="mr-2 h-4 w-4" />
          Delegar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delegar Responsabilidad</DialogTitle>
          <DialogDescription>
            Asigna un nuevo responsable para esta sesión.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="responsible">Nuevo Responsable</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar responsable" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Confirmar Delegación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
