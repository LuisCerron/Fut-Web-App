import { Session, SessionTask, Attendance, PlayerLoad } from "@/modules/core/types/db.types";

// Mock Data for Sessions
const INITIAL_MOCK_SESSIONS: Session[] = [
  {
    id: "s1",
    tenant_id: "t1",
    session_type: "Entrenamiento",
    team_id: "1",
    start_time: "2024-05-20T18:00:00Z",
    end_time: "2024-05-20T19:30:00Z",
    location: "Campo Norte",
    objectives: "Mejora de técnica de pase y control",
    status: "Planificada",
    created_by_user_id: "2",
    responsible_user_id: "2",
    is_template: false,
  },
  {
    id: "s2",
    tenant_id: "t1",
    session_type: "Partido",
    team_id: "1",
    start_time: "2024-05-25T11:00:00Z",
    end_time: "2024-05-25T12:30:00Z",
    location: "Campo Municipal Los Olivos",
    description: "Partido de Liga vs. Ciudad Deportiva",
    status: "Planificada",
    created_by_user_id: "2",
    responsible_user_id: "2",
    is_template: false,
  },
];

const LOCAL_STORAGE_SESSIONS_KEY = "mock_sessions";

function getLocalStorageSessions(): Session[] {
  if (typeof window === "undefined") return [];
  const storedSessions = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
  if (storedSessions) {
    return JSON.parse(storedSessions);
  }
  localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(INITIAL_MOCK_SESSIONS));
  return INITIAL_MOCK_SESSIONS;
}

function setLocalStorageSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
}

// Mock Data for Session Tasks
const INITIAL_MOCK_SESSION_TASKS: SessionTask[] = [
  {
    id: "st1", session_id: "s1", library_task_id: "lt1", order: 1, 
    estimated_duration_min: 15, status: "Pendiente", is_optional: false 
  },
  {
    id: "st2", session_id: "s1", library_task_id: "lt2", order: 2, 
    estimated_duration_min: 20, status: "Pendiente", is_optional: false 
  },
];

const LOCAL_STORAGE_SESSION_TASKS_KEY = "mock_session_tasks";

function getLocalStorageSessionTasks(): SessionTask[] {
  if (typeof window === "undefined") return [];
  const storedSessionTasks = localStorage.getItem(LOCAL_STORAGE_SESSION_TASKS_KEY);
  if (storedSessionTasks) {
    return JSON.parse(storedSessionTasks);
  }
  localStorage.setItem(LOCAL_STORAGE_SESSION_TASKS_KEY, JSON.stringify(INITIAL_MOCK_SESSION_TASKS));
  return INITIAL_MOCK_SESSION_TASKS;
}

function setLocalStorageSessionTasks(sessionTasks: SessionTask[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_SESSION_TASKS_KEY, JSON.stringify(sessionTasks));
}

// Mock Data for Attendances
const INITIAL_MOCK_ATTENDANCES: Attendance[] = [
  { id: "att1", session_id: "s1", player_id: "1", status: "Presente", arrival_time: "2024-05-20T17:55:00Z" },
  { id: "att2", session_id: "s1", player_id: "2", status: "Presente", arrival_time: "2024-05-20T18:00:00Z" },
];

const LOCAL_STORAGE_ATTENDANCES_KEY = "mock_attendances";

function getLocalStorageAttendances(): Attendance[] {
  if (typeof window === "undefined") return [];
  const storedAttendances = localStorage.getItem(LOCAL_STORAGE_ATTENDANCES_KEY);
  if (storedAttendances) {
    return JSON.parse(storedAttendances);
  }
  localStorage.setItem(LOCAL_STORAGE_ATTENDANCES_KEY, JSON.stringify(INITIAL_MOCK_ATTENDANCES));
  return INITIAL_MOCK_ATTENDANCES;
}

function setLocalStorageAttendances(attendances: Attendance[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_ATTENDANCES_KEY, JSON.stringify(attendances));
}

// Mock Data for Player Loads
const INITIAL_MOCK_PLAYER_LOADS: PlayerLoad[] = [
  { id: "pl1", session_id: "s1", player_id: "1", real_duration_min: 90, rpe: 7, calculated_load: 630 },
  { id: "pl2", session_id: "s1", player_id: "2", real_duration_min: 90, rpe: 8, calculated_load: 720 },
];

const LOCAL_STORAGE_PLAYER_LOADS_KEY = "mock_player_loads";

function getLocalStoragePlayerLoads(): PlayerLoad[] {
  if (typeof window === "undefined") return [];
  const storedPlayerLoads = localStorage.getItem(LOCAL_STORAGE_PLAYER_LOADS_KEY);
  if (storedPlayerLoads) {
    return JSON.parse(storedPlayerLoads);
  }
  localStorage.setItem(LOCAL_STORAGE_PLAYER_LOADS_KEY, JSON.stringify(INITIAL_MOCK_PLAYER_LOADS));
  return INITIAL_MOCK_PLAYER_LOADS;
}

function setLocalStoragePlayerLoads(playerLoads: PlayerLoad[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_PLAYER_LOADS_KEY, JSON.stringify(playerLoads));
}


export const sessionsService = {
  // Sessions
  getSessions: async (): Promise<Session[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageSessions()), 500));
  },

  getSessionById: async (id: string): Promise<Session | undefined> => {
    return new Promise((resolve) => {
      const sessions = getLocalStorageSessions();
      const session = sessions.find((s) => s.id === id);
      setTimeout(() => resolve(session), 300);
    });
  },

  createSession: async (session: Partial<Session>): Promise<Session> => {
    return new Promise((resolve) => {
      const sessions = getLocalStorageSessions();
      const newSession = {
        ...session,
        id: (sessions.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
        created_by_user_id: session.created_by_user_id || "2", // Default to coach
        responsible_user_id: session.responsible_user_id || "2",
        status: session.status || "Planificada",
        is_template: session.is_template || false,
      } as Session;
      sessions.push(newSession);
      setLocalStorageSessions(sessions);
      setTimeout(() => resolve(newSession), 500);
    });
  },

  updateSession: async (id: string, data: Partial<Session>): Promise<Session> => {
    return new Promise((resolve, reject) => {
      const sessions = getLocalStorageSessions();
      const index = sessions.findIndex((s) => s.id === id);
      if (index === -1) {
        reject(new Error("Session not found"));
        return;
      }
      sessions[index] = { ...sessions[index], ...data };
      setLocalStorageSessions(sessions);
      setTimeout(() => resolve(sessions[index]), 500);
    });
  },

  deleteSession: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let sessions = getLocalStorageSessions();
      sessions = sessions.filter((s) => s.id !== id);
      setLocalStorageSessions(sessions);

      // Also delete associated session tasks, attendances and player loads
      let sessionTasks = getLocalStorageSessionTasks();
      sessionTasks = sessionTasks.filter((st) => st.session_id !== id);
      setLocalStorageSessionTasks(sessionTasks);

      let attendances = getLocalStorageAttendances();
      attendances = attendances.filter((att) => att.session_id !== id);
      setLocalStorageAttendances(attendances);
      
      let playerLoads = getLocalStoragePlayerLoads();
      playerLoads = playerLoads.filter((pl) => pl.session_id !== id);
      setLocalStoragePlayerLoads(playerLoads);

      setTimeout(() => resolve(), 300);
    });
  },

  duplicateSession: async (sessionId: string): Promise<Session> => {
    return new Promise((resolve, reject) => {
      const sessions = getLocalStorageSessions();
      const originalSession = sessions.find((s) => s.id === sessionId);
      if (!originalSession) {
        reject(new Error("Session not found"));
        return;
      }

      const newSession: Session = {
        ...originalSession,
        id: (sessions.length + 1 + Math.floor(Math.random() * 1000)).toString(),
        status: "Planificada",
        is_template: true,
        template_origin_id: originalSession.id,
        description: `Plantilla copia de: ${originalSession.description || originalSession.session_type}`,
        start_time: new Date().toISOString(), // Reset dates for template
        end_time: new Date(Date.now() + 90 * 60000).toISOString(),
      };
      
      sessions.push(newSession);
      setLocalStorageSessions(sessions);

      // Duplicate tasks
      const sessionTasks = getLocalStorageSessionTasks();
      const originalTasks = sessionTasks.filter(st => st.session_id === sessionId);
      
      originalTasks.forEach((task, index) => {
         const newTask: SessionTask = {
             ...task,
             id: `st${Date.now()}${index}`,
             session_id: newSession.id,
             status: "Pendiente",
             realized_duration_min: undefined,
             coach_notes: undefined
         };
         sessionTasks.push(newTask);
      });
      setLocalStorageSessionTasks(sessionTasks);

      setTimeout(() => resolve(newSession), 500);
    });
  },

  delegateSession: async (sessionId: string, newResponsibleId: string): Promise<Session> => {
    return new Promise((resolve, reject) => {
      const sessions = getLocalStorageSessions();
      const index = sessions.findIndex((s) => s.id === sessionId);
      if (index === -1) {
        reject(new Error("Session not found"));
        return;
      }
      
      sessions[index] = { 
        ...sessions[index], 
        responsible_user_id: newResponsibleId,
        last_delegation_date: new Date().toISOString()
      };
      setLocalStorageSessions(sessions);
      setTimeout(() => resolve(sessions[index]), 500);
    });
  },

  // Session Tasks
  getSessionTasksForSession: async (sessionId: string): Promise<SessionTask[]> => {
    return new Promise((resolve) => {
      const sessionTasks = getLocalStorageSessionTasks();
      const tasks = sessionTasks.filter((st) => st.session_id === sessionId);
      setTimeout(() => resolve(tasks), 300);
    });
  },

  addSessionTask: async (sessionTask: Partial<SessionTask>): Promise<SessionTask> => {
    return new Promise((resolve) => {
      const sessionTasks = getLocalStorageSessionTasks();
      const newSessionTask = {
        ...sessionTask,
        id: (sessionTasks.length + 1).toString(), // Simple ID generation
        status: "Pendiente",
        is_optional: false,
      } as SessionTask;
      sessionTasks.push(newSessionTask);
      setLocalStorageSessionTasks(sessionTasks);
      setTimeout(() => resolve(newSessionTask), 500);
    });
  },

  updateSessionTask: async (id: string, data: Partial<SessionTask>): Promise<SessionTask> => {
    return new Promise((resolve, reject) => {
      const sessionTasks = getLocalStorageSessionTasks();
      const index = sessionTasks.findIndex((st) => st.id === id);
      if (index === -1) {
        reject(new Error("SessionTask not found"));
        return;
      }
      sessionTasks[index] = { ...sessionTasks[index], ...data };
      setLocalStorageSessionTasks(sessionTasks);
      setTimeout(() => resolve(sessionTasks[index]), 500);
    });
  },

  deleteSessionTask: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let sessionTasks = getLocalStorageSessionTasks();
      sessionTasks = sessionTasks.filter((st) => st.id !== id);
      setLocalStorageSessionTasks(sessionTasks);
      setTimeout(() => resolve(), 300);
    });
  },

  // Attendances
  getAttendancesForSession: async (sessionId: string): Promise<Attendance[]> => {
    return new Promise((resolve) => {
      const attendances = getLocalStorageAttendances();
      const sessionAttendances = attendances.filter((att) => att.session_id === sessionId);
      setTimeout(() => resolve(sessionAttendances), 300);
    });
  },

  batchUpdateAttendances: async (attendances: Partial<Attendance>[]): Promise<Attendance[]> => {
    return new Promise((resolve) => {
      let allAttendances = getLocalStorageAttendances();
      const updatedAttendances: Attendance[] = [];

      attendances.forEach(att => {
        if (att.id) { // Update existing attendance
          const index = allAttendances.findIndex(a => a.id === att.id);
          if (index !== -1) {
            allAttendances[index] = { ...allAttendances[index], ...att };
            updatedAttendances.push(allAttendances[index]);
          }
        } else { // Create new attendance
          const newAttendance = {
            ...att,
            id: `att${allAttendances.length + 1}`,
          } as Attendance;
          allAttendances.push(newAttendance);
          updatedAttendances.push(newAttendance);
        }
      });
      
      setLocalStorageAttendances(allAttendances);
      setTimeout(() => resolve(updatedAttendances), 500);
    });
  },
  
  getAttendancesForPlayer: async (playerId: string): Promise<Attendance[]> => {
    return new Promise((resolve) => {
      const attendances = getLocalStorageAttendances();
      const playerAttendances = attendances.filter((att) => att.player_id === playerId);
      setTimeout(() => resolve(playerAttendances), 300);
    });
  },
  
  // Player Loads
  getPlayerLoadsForSession: async (sessionId: string): Promise<PlayerLoad[]> => {
    return new Promise((resolve) => {
      const playerLoads = getLocalStoragePlayerLoads();
      const sessionPlayerLoads = playerLoads.filter((pl) => pl.session_id === sessionId);
      setTimeout(() => resolve(sessionPlayerLoads), 300);
    });
  },
  
  batchUpdatePlayerLoads: async (playerLoads: Partial<PlayerLoad>[]): Promise<PlayerLoad[]> => {
    return new Promise((resolve) => {
      let allPlayerLoads = getLocalStoragePlayerLoads();
      const updatedPlayerLoads: PlayerLoad[] = [];

      playerLoads.forEach(pl => {
        if (pl.id) { // Update existing player load
          const index = allPlayerLoads.findIndex(p => p.id === pl.id);
          if (index !== -1) {
            allPlayerLoads[index] = { ...allPlayerLoads[index], ...pl };
            updatedPlayerLoads.push(allPlayerLoads[index]);
          }
        } else { // Create new player load
          const newPlayerLoad = {
            ...pl,
            id: `pl${allPlayerLoads.length + 1}`,
          } as PlayerLoad;
          allPlayerLoads.push(newPlayerLoad);
          updatedPlayerLoads.push(newPlayerLoad);
        }
      });
      
      setLocalStoragePlayerLoads(allPlayerLoads);
      setTimeout(() => resolve(updatedPlayerLoads), 500);
    });
  },
  
  getPlayerLoadsForPlayer: async (playerId: string): Promise<PlayerLoad[]> => {
    return new Promise((resolve) => {
      const playerLoads = getLocalStoragePlayerLoads();
      const playerPlayerLoads = playerLoads.filter((pl) => pl.player_id === playerId);
      setTimeout(() => resolve(playerPlayerLoads), 300);
    });
  },
};
