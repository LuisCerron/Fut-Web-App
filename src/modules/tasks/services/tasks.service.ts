import { TaskType, Material, MaterialStatus, LibraryTask, TaskMaterial, User } from "@/modules/core/types/db.types";
import { usersService } from "@/modules/users/services/users.service"; // To get mock users

// Mock Data for Task Types
const INITIAL_MOCK_TASK_TYPES: TaskType[] = [
  { id: "1", tenant_id: "t1", name: "Técnica", description: "Ejercicios de habilidad con el balón", color_hex: "#34D399" },
  { id: "2", tenant_id: "t1", name: "Física", description: "Entrenamiento de resistencia y fuerza", color_hex: "#FACC15" },
  { id: "3", tenant_id: "t1", name: "Táctica", description: "Estrategias y movimientos en equipo", color_hex: "#60A5FA" },
  { id: "4", tenant_id: "t1", name: "Psicológica", description: "Actividades de concentración y motivación", color_hex: "#F87171" },
];

const LOCAL_STORAGE_TASK_TYPES_KEY = "mock_task_types";

function getLocalStorageTaskTypes(): TaskType[] {
  if (typeof window === "undefined") return [];
  const storedTaskTypes = localStorage.getItem(LOCAL_STORAGE_TASK_TYPES_KEY);
  if (storedTaskTypes) {
    return JSON.parse(storedTaskTypes);
  }
  localStorage.setItem(LOCAL_STORAGE_TASK_TYPES_KEY, JSON.stringify(INITIAL_MOCK_TASK_TYPES));
  return INITIAL_MOCK_TASK_TYPES;
}

function setLocalStorageTaskTypes(taskTypes: TaskType[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_TASK_TYPES_KEY, JSON.stringify(taskTypes));
}

// Mock Data for Materials
const INITIAL_MOCK_MATERIALS: Material[] = [
  { id: "1", tenant_id: "t1", name: "Conos", total_quantity: 50, available_quantity: 45, status: "Disponible" },
  { id: "2", tenant_id: "t1", name: "Balones Talla 5", total_quantity: 30, available_quantity: 28, status: "Disponible" },
  { id: "3", tenant_id: "t1", name: "Vallas", total_quantity: 20, available_quantity: 18, status: "En Mantenimiento" },
];

const LOCAL_STORAGE_MATERIALS_KEY = "mock_materials";

function getLocalStorageMaterials(): Material[] {
  if (typeof window === "undefined") return [];
  const storedMaterials = localStorage.getItem(LOCAL_STORAGE_MATERIALS_KEY);
  if (storedMaterials) {
    return JSON.parse(storedMaterials);
  }
  localStorage.setItem(LOCAL_STORAGE_MATERIALS_KEY, JSON.stringify(INITIAL_MOCK_MATERIALS));
  return INITIAL_MOCK_MATERIALS;
}

function setLocalStorageMaterials(materials: Material[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_MATERIALS_KEY, JSON.stringify(materials));
}

// Mock Data for Library Tasks
const INITIAL_MOCK_LIBRARY_TASKS: LibraryTask[] = [
  {
    id: "lt1", tenant_id: "t1", task_type_id: "1", name: "Rondo 4 vs 2",
    description: "Rondo para mejorar pase y presión", estimated_duration_min: 15,
    difficulty: "Media", is_public: true, created_by_user_id: "1"
  },
  {
    id: "lt2", tenant_id: "t1", task_type_id: "2", name: "Circuito de Velocidad",
    description: "Circuito para mejorar velocidad y agilidad", estimated_duration_min: 20,
    difficulty: "Alta", is_public: true, created_by_user_id: "2"
  },
];

const LOCAL_STORAGE_LIBRARY_TASKS_KEY = "mock_library_tasks";

function getLocalStorageLibraryTasks(): LibraryTask[] {
  if (typeof window === "undefined") return [];
  const storedTasks = localStorage.getItem(LOCAL_STORAGE_LIBRARY_TASKS_KEY);
  if (storedTasks) {
    return JSON.parse(storedTasks);
  }
  localStorage.setItem(LOCAL_STORAGE_LIBRARY_TASKS_KEY, JSON.stringify(INITIAL_MOCK_LIBRARY_TASKS));
  return INITIAL_MOCK_LIBRARY_TASKS;
}

function setLocalStorageLibraryTasks(tasks: LibraryTask[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_LIBRARY_TASKS_KEY, JSON.stringify(tasks));
}

// Mock Data for Task Materials
const INITIAL_MOCK_TASK_MATERIALS: TaskMaterial[] = [
  { task_id: "lt1", material_id: "1", required_quantity: 6 }, // Rondo needs 6 Conos
  { task_id: "lt1", material_id: "2", required_quantity: 3 }, // Rondo needs 3 Balones
  { task_id: "lt2", material_id: "1", required_quantity: 10 }, // Circuito needs 10 Conos
  { task_id: "lt2", material_id: "3", required_quantity: 4 }, // Circuito needs 4 Vallas
];

const LOCAL_STORAGE_TASK_MATERIALS_KEY = "mock_task_materials";

function getLocalStorageTaskMaterials(): TaskMaterial[] {
  if (typeof window === "undefined") return [];
  const storedTaskMaterials = localStorage.getItem(LOCAL_STORAGE_TASK_MATERIALS_KEY);
  if (storedTaskMaterials) {
    return JSON.parse(storedTaskMaterials);
  }
  localStorage.setItem(LOCAL_STORAGE_TASK_MATERIALS_KEY, JSON.stringify(INITIAL_MOCK_TASK_MATERIALS));
  return INITIAL_MOCK_TASK_MATERIALS;
}

function setLocalStorageTaskMaterials(taskMaterials: TaskMaterial[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_TASK_MATERIALS_KEY, JSON.stringify(taskMaterials));
}


export const tasksService = {
  // Task Types
  getTaskTypes: async (): Promise<TaskType[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageTaskTypes()), 300));
  },

  createTaskType: async (taskType: Partial<TaskType>): Promise<TaskType> => {
    return new Promise((resolve) => {
      const taskTypes = getLocalStorageTaskTypes();
      const newTaskType = {
        ...taskType,
        id: (taskTypes.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
      } as TaskType;
      taskTypes.push(newTaskType);
      setLocalStorageTaskTypes(taskTypes);
      setTimeout(() => resolve(newTaskType), 500);
    });
  },

  updateTaskType: async (id: string, data: Partial<TaskType>): Promise<TaskType> => {
    return new Promise((resolve, reject) => {
      const taskTypes = getLocalStorageTaskTypes();
      const index = taskTypes.findIndex((tt) => tt.id === id);
      if (index === -1) {
        reject(new Error("TaskType not found"));
        return;
      }
      taskTypes[index] = { ...taskTypes[index], ...data };
      setLocalStorageTaskTypes(taskTypes);
      setTimeout(() => resolve(taskTypes[index]), 500);
    });
  },

  deleteTaskType: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let taskTypes = getLocalStorageTaskTypes();
      taskTypes = taskTypes.filter((tt) => tt.id !== id);
      setLocalStorageTaskTypes(taskTypes);
      setTimeout(() => resolve(), 300);
    });
  },

  // Materials
  getMaterials: async (): Promise<Material[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageMaterials()), 300));
  },

  createMaterial: async (material: Partial<Material>): Promise<Material> => {
    return new Promise((resolve) => {
      const materials = getLocalStorageMaterials();
      const newMaterial = {
        ...material,
        id: (materials.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
      } as Material;
      materials.push(newMaterial);
      setLocalStorageMaterials(materials);
      setTimeout(() => resolve(newMaterial), 500);
    });
  },

  updateMaterial: async (id: string, data: Partial<Material>): Promise<Material> => {
    return new Promise((resolve, reject) => {
      const materials = getLocalStorageMaterials();
      const index = materials.findIndex((m) => m.id === id);
      if (index === -1) {
        reject(new Error("Material not found"));
        return;
      }
      materials[index] = { ...materials[index], ...data };
      setLocalStorageMaterials(materials);
      setTimeout(() => resolve(materials[index]), 500);
    });
  },

  deleteMaterial: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let materials = getLocalStorageMaterials();
      materials = materials.filter((m) => m.id !== id);
      setLocalStorageMaterials(materials);
      setTimeout(() => resolve(), 300);
    });
  },

  // Library Tasks
  getLibraryTasks: async (): Promise<LibraryTask[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageLibraryTasks()), 500));
  },

  createLibraryTask: async (task: Partial<LibraryTask>, materials: Omit<TaskMaterial, 'task_id'>[]): Promise<LibraryTask> => {
    return new Promise(async (resolve) => {
      const libraryTasks = getLocalStorageLibraryTasks();
      const newLibraryTask = {
        ...task,
        id: (libraryTasks.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
        is_public: task.is_public ?? false,
        created_by_user_id: task.created_by_user_id || "1", // Default to admin for now
      } as LibraryTask;
      libraryTasks.push(newLibraryTask);
      setLocalStorageLibraryTasks(libraryTasks);

      // Save associated materials
      const allTaskMaterials = getLocalStorageTaskMaterials();
      const newTaskMaterials = materials.map(m => ({ ...m, task_id: newLibraryTask.id }));
      setLocalStorageTaskMaterials([...allTaskMaterials, ...newTaskMaterials]);

      setTimeout(() => resolve(newLibraryTask), 500);
    });
  },

  updateLibraryTask: async (id: string, data: Partial<LibraryTask>, materials: TaskMaterial[]): Promise<LibraryTask> => {
    return new Promise((resolve, reject) => {
      const libraryTasks = getLocalStorageLibraryTasks();
      const index = libraryTasks.findIndex((lt) => lt.id === id);
      if (index === -1) {
        reject(new Error("LibraryTask not found"));
        return;
      }
      libraryTasks[index] = { ...libraryTasks[index], ...data };
      setLocalStorageLibraryTasks(libraryTasks);

      // Update associated materials
      let allTaskMaterials = getLocalStorageTaskMaterials();
      allTaskMaterials = allTaskMaterials.filter(tm => tm.task_id !== id); // Remove old materials for this task
      const newTaskMaterials = materials.map(m => ({ ...m, task_id: id }));
      setLocalStorageTaskMaterials([...allTaskMaterials, ...newTaskMaterials]);

      setTimeout(() => resolve(libraryTasks[index]), 500);
    });
  },

  deleteLibraryTask: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let libraryTasks = getLocalStorageLibraryTasks();
      libraryTasks = libraryTasks.filter((lt) => lt.id !== id);
      setLocalStorageLibraryTasks(libraryTasks);

      // Delete associated materials
      let allTaskMaterials = getLocalStorageTaskMaterials();
      allTaskMaterials = allTaskMaterials.filter(tm => tm.task_id !== id);
      setLocalStorageTaskMaterials(allTaskMaterials);

      setTimeout(() => resolve(), 300);
    });
  },

  getTaskMaterialsForTask: async (taskId: string): Promise<TaskMaterial[]> => {
    return new Promise((resolve) => {
      const allTaskMaterials = getLocalStorageTaskMaterials();
      const taskMaterials = allTaskMaterials.filter(tm => tm.task_id === taskId);
      setTimeout(() => resolve(taskMaterials), 300);
    });
  },
};
