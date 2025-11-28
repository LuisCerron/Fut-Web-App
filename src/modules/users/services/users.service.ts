import { User, Role, RoleName } from "@/modules/core/types/db.types";

// Mock Roles
export const MOCK_ROLES: Role[] = [
  { id: "role-admin", tenant_id: "t1", name: "ADMIN" },
  { id: "role-coach", tenant_id: "t1", name: "COACH" },
  { id: "role-parent", tenant_id: "t1", name: "PARENT" },
  { id: "role-player", tenant_id: "t1", name: "PLAYER" },
];

// Mock Users
const INITIAL_MOCK_USERS: User[] = [
  {
    id: "1",
    tenant_id: "t1",
    role_id: "role-admin",
    dni: "12345678",
    email: "admin@academia.com",
    password_hash: "hashed_pw",
    full_name: "Admin Principal",
    phone: "999888777",
    is_active: true,
  },
  {
    id: "2",
    tenant_id: "t1",
    role_id: "role-coach",
    dni: "87654321",
    email: "entrenador@academia.com",
    password_hash: "hashed_pw",
    full_name: "Carlos Entrenador",
    phone: "999111222",
    is_active: true,
  },
  {
    id: "3",
    tenant_id: "t1",
    role_id: "role-parent",
    dni: "parent",
    email: "padre@academia.com",
    password_hash: "hashed_pw",
    full_name: "Juan Padre",
    phone: "999333444",
    is_active: true,
  },
];

const LOCAL_STORAGE_USERS_KEY = "mock_users";
const LOCAL_STORAGE_ROLES_KEY = "mock_roles";

function getLocalStorageUsers(): User[] {
  if (typeof window === "undefined") return [];
  const storedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(INITIAL_MOCK_USERS));
  return INITIAL_MOCK_USERS;
}

function setLocalStorageUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
}

function getLocalStorageRoles(): Role[] {
  if (typeof window === "undefined") return [];
  const storedRoles = localStorage.getItem(LOCAL_STORAGE_ROLES_KEY);
  if (storedRoles) {
    return JSON.parse(storedRoles);
  }
  localStorage.setItem(LOCAL_STORAGE_ROLES_KEY, JSON.stringify(MOCK_ROLES));
  return MOCK_ROLES;
}

function setLocalStorageRoles(roles: Role[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_ROLES_KEY, JSON.stringify(roles));
}

export const usersService = {
  getRoles: async (): Promise<Role[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(getLocalStorageRoles()), 300)
    );
  },

  getUsers: async (): Promise<User[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(getLocalStorageUsers()), 500)
    );
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      const users = getLocalStorageUsers();
      const user = users.find((u) => u.id === id);
      setTimeout(() => resolve(user), 300);
    });
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    return new Promise((resolve) => {
      const users = getLocalStorageUsers();
      const newUser = {
        ...user,
        id: (users.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
        is_active: true,
        password_hash: "default_hash", // In a real app, backend handles this
      } as User;
      users.push(newUser);
      setLocalStorageUsers(users);
      setTimeout(() => resolve(newUser), 500);
    });
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return new Promise((resolve, reject) => {
      const users = getLocalStorageUsers();
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) {
        reject(new Error("User not found"));
        return;
      }
      users[index] = { ...users[index], ...data };
      setLocalStorageUsers(users);
      setTimeout(() => resolve(users[index]), 500);
    });
  },

  toggleUserStatus: async (id: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const users = getLocalStorageUsers();
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) {
        reject(new Error("User not found"));
        return;
      }
      users[index].is_active = !users[index].is_active;
      setLocalStorageUsers(users);
      setTimeout(() => resolve(users[index]), 300);
    });
  },
};
