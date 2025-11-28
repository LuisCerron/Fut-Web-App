import { User, RoleName } from "@/modules/core/types/db.types";

export interface AuthUser {
  id: string;
  dni: string;
  email: string;
  full_name: string;
  role_id: string;
  role_name: RoleName;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Test users with passwords
const TEST_USERS = [
  {
    id: "1",
    dni: "admin",
    password: "admin123",
    email: "admin@academia.com",
    full_name: "Admin Principal",
    role_id: "role-admin",
    role_name: "ADMIN" as RoleName,
  },
  {
    id: "2",
    dni: "coach",
    password: "coach123",
    email: "entrenador@academia.com",
    full_name: "Carlos Entrenador",
    role_id: "role-coach",
    role_name: "COACH" as RoleName,
  },
  {
    id: "3",
    dni: "parent",
    password: "parent123",
    email: "padre@academia.com",
    full_name: "Juan Padre",
    role_id: "role-parent",
    role_name: "PARENT" as RoleName,
  },
];

export const authService = {
  login: async (dni: string, password: string): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = TEST_USERS.find(
          (u) => u.dni === dni && u.password === password
        );

        if (!user) {
          reject(new Error("Credenciales inválidas"));
          return;
        }

        const { password: _, ...userWithoutPassword } = user;

        resolve({
          accessToken: `token-${user.id}-${Date.now()}`,
          refreshToken: `refresh-${user.id}-${Date.now()}`,
          user: userWithoutPassword,
        });
      }, 800);
    });
  },

  getCurrentUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  },

  saveSession: (response: LoginResponse) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", response.accessToken);
    localStorage.setItem("auth_user", JSON.stringify(response.user));
  },

  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};
