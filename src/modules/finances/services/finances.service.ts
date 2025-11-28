import { Due } from "@/modules/core/types/db.types";

// Mock Data for Dues
const INITIAL_MOCK_DUES: Due[] = [
  {
    id: "d1",
    tenant_id: "t1",
    player_id: "1",
    concept: "Cuota Mensual - Enero 2024",
    amount: 60,
    due_date: "2024-01-05",
    status: "Pagada",
    creation_date: "2024-01-01",
    payment_date: "2024-01-03",
    payment_method: "Efectivo",
  },
  {
    id: "d2",
    tenant_id: "t1",
    player_id: "2",
    concept: "Cuota Mensual - Enero 2024",
    amount: 60,
    due_date: "2024-01-05",
    status: "Pendiente",
    creation_date: "2024-01-01",
  },
];

const LOCAL_STORAGE_DUES_KEY = "mock_dues";

function getLocalStorageDues(): Due[] {
  if (typeof window === "undefined") return [];
  const storedDues = localStorage.getItem(LOCAL_STORAGE_DUES_KEY);
  if (storedDues) {
    return JSON.parse(storedDues);
  }
  localStorage.setItem(LOCAL_STORAGE_DUES_KEY, JSON.stringify(INITIAL_MOCK_DUES));
  return INITIAL_MOCK_DUES;
}

function setLocalStorageDues(dues: Due[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_DUES_KEY, JSON.stringify(dues));
}

export const financesService = {
  getDues: async (): Promise<Due[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageDues()), 300));
  },

  createDue: async (due: Partial<Due>): Promise<Due> => {
    return new Promise((resolve) => {
      const dues = getLocalStorageDues();
      const newDue = {
        ...due,
        id: (dues.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
        status: "Pendiente",
        creation_date: new Date().toISOString(),
      } as Due;
      dues.push(newDue);
      setLocalStorageDues(dues);
      setTimeout(() => resolve(newDue), 500);
    });
  },

  updateDue: async (id: string, data: Partial<Due>): Promise<Due> => {
    return new Promise((resolve, reject) => {
      const dues = getLocalStorageDues();
      const index = dues.findIndex((d) => d.id === id);
      if (index === -1) {
        reject(new Error("Due not found"));
        return;
      }
      dues[index] = { ...dues[index], ...data };
      setLocalStorageDues(dues);
      setTimeout(() => resolve(dues[index]), 500);
    });
  },

  deleteDue: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let dues = getLocalStorageDues();
      dues = dues.filter((d) => d.id !== id);
      setLocalStorageDues(dues);
      setTimeout(() => resolve(), 300);
    });
  },
};
