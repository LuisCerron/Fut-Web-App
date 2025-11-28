export type UUID = string;

// 1. Tenants (Academias)
export interface Tenant {
  id: UUID;
  name: string;
  is_active: boolean;
  created_at: string; // ISO Date string
}

// 2. Roles (Por Tenant)
export type RoleName = 'ADMIN' | 'COACH' | 'PARENT' | 'PLAYER';

export interface Role {
  id: UUID;
  tenant_id: UUID;
  name: RoleName;
}

// 3. Users (Usuarios con acceso al sistema)
export interface User {
  id: UUID;
  tenant_id: UUID;
  role_id: UUID;
  dni: string;
  email: string;
  password_hash: string;
  full_name?: string;
  phone?: string;
  is_active: boolean;
}

// 4. Equipos
export interface Team {
  id: UUID;
  tenant_id: UUID;
  name: string;
  category?: string;
  is_own_team: boolean;
  is_active: boolean;
  description?: string;
  date_created?: string;
}

// 5. Posiciones
export interface Position {
  id: UUID;
  tenant_id: UUID;
  name?: string;
  abbreviation?: string;
  area?: string; // 'Defensa', 'Ataque'
}

// 6. Jugadores (Ficha Técnica)
export interface Player {
  id: UUID;
  tenant_id: UUID;
  team_id?: UUID;
  parent_user_id?: UUID;
  position_primary_id?: UUID;
  position_secondary_id?: UUID;
  
  first_name?: string;
  last_name?: string;
  birth_date?: string; // ISO Date string
  dni?: string;
  photo_url?: string;
  dominant_foot?: 'RIGHT' | 'LEFT' | 'BOTH';
  jersey_number?: number;
  
  is_active: boolean;
  height_cm?: number;
  weight_kg?: number;
  emergency_contact?: string;
  payment_status?: "AL_DIA" | "PENDIENTE" | "DESACTIVADO_POR_CUOTA";
  is_senior?: boolean;
  date_registered?: string;
}

// Módulo 2: Planificación de Tareas y Recursos - 1. Clasificación de Actividades (Tipos de Tarea)
export interface TaskType {
  id: UUID;
  tenant_id: UUID;
  name: string; // e.g., "Técnica", "Física", "Táctica"
  description?: string;
  color_hex?: string; // e.g., "#RRGGBB"
}

// Módulo 2: Planificación de Tareas y Recursos - 2. Control de Inventario de Material Deportivo
export type MaterialStatus = "Disponible" | "En Mantenimiento" | "Baja";

export interface Material {
  id: UUID;
  tenant_id: UUID;
  name: string; // e.g., "Conos", "Balones Talla 5"
  total_quantity: number;
  available_quantity: number;
  status: MaterialStatus;
}

// Módulo 2: Planificación de Tareas y Recursos - 3. Biblioteca de Ejercicios y Tareas Reutilizables
export type DifficultyLevel = "Baja" | "Media" | "Alta";

export interface LibraryTask {
  id: UUID;
  tenant_id: UUID;
  task_type_id?: UUID; // FK -> TaskType
  name: string;
  description?: string;
  estimated_duration_min?: number;
  difficulty?: DifficultyLevel;
  is_public: boolean; // within the academy
  created_by_user_id?: UUID; // FK -> User
}

export interface TaskMaterial {
  task_id: UUID; // PK, FK -> LibraryTask
  material_id: UUID; // PK, FK -> Material
  required_quantity: number;
}

// Módulo 3: Evaluación de Jugadores - 1. Definición Personalizada de Criterios de Evaluación (Atributos)
export type AttributeType = "Físico" | "Técnico" | "Mental" | "Táctico" | "Personal";
export type ScaleType = "Numérica 1-10" | "Letras A-F" | "Texto Libre" | "Porcentaje";

export interface Attribute {
  id: UUID;
  tenant_id: UUID;
  name: string; // e.g., "Velocidad", "Pase Corto", "Decisión"
  type: AttributeType;
  scale_type: ScaleType;
  min_value?: number; // For Numeric scale_type
  max_value?: number; // For Numeric scale_type
  unit?: string; // e.g., "segundos", "metros", "puntos", "%"
}

// Módulo 3: Evaluación de Jugadores - 2. Registro Detallado de Evaluaciones
export type EvaluationStatus = "Borrador" | "Completada";
export type EvaluationType = "Inicial" | "Periódica" | "Final";

export interface Evaluation {
  id: UUID;
  tenant_id: UUID;
  player_id: UUID; // FK -> Player
  evaluator_user_id: UUID; // FK -> User
  evaluation_date: string; // ISO Date string
  evaluation_type: EvaluationType;
  general_comments?: string;
  status: EvaluationStatus;
}

export interface EvaluationDetail {
  id: UUID;
  evaluation_id: UUID; // FK -> Evaluation
  attribute_id: UUID; // FK -> Attribute
  numeric_value?: number; // For Numeric/Percentage scale_type
  text_value?: string; // For Text/Letter scale_type
  comments?: string;
}

// Módulo 4: Sesiones y Seguimiento Diario
export type SessionType = "Entrenamiento" | "Partido" | "Fisioterapia" | "Teórica";
export type SessionStatus = "Planificada" | "En Curso" | "Completada" | "Cancelada";
export type SessionTemplateCategory = "Técnica" | "Táctica" | "Física" | "Integral" | "Partido";
export type SessionTemplateDifficulty = "Principiante" | "Intermedio" | "Avanzado";

export interface Session {
  id: UUID;
  tenant_id: UUID;
  session_type: SessionType;
  team_id?: UUID; // FK -> Team
  template_origin_id?: UUID; // FK -> Session
  start_time: string; // ISO Date string
  end_time: string; // ISO Date string
  location?: string;
  description?: string;
  objectives?: string;
  status: SessionStatus;
  created_by_user_id: UUID; // FK -> User
  responsible_user_id: UUID; // FK -> User
  last_delegation_date?: string; // ISO Date string
  is_template: boolean;
  template_category?: SessionTemplateCategory;
  template_difficulty?: SessionTemplateDifficulty;
  total_duration_min?: number;
}

export type SessionTaskStatus = "Pendiente" | "En Progreso" | "Completada" | "Saltada";

export interface SessionTask {
  id: UUID;
  session_id: UUID; // FK -> Session
  library_task_id: UUID; // FK -> LibraryTask
  order: number;
  estimated_duration_min?: number;
  realized_duration_min?: number;
  coach_notes?: string;
  status: SessionTaskStatus;
  is_optional: boolean;
  improvised_material?: string;
}

export type AttendanceStatus = "Presente" | "Ausente" | "Justificado" | "Tardanza";

export interface Attendance {
  id: UUID;
  session_id: UUID; // FK -> Session
  player_id: UUID; // FK -> Player
  status: AttendanceStatus;
  arrival_time?: string; // ISO Date string
  notes?: string;
}

export interface PlayerLoad {
  id: UUID;
  session_id: UUID; // FK -> Session
  player_id: UUID; // FK -> Player
  real_duration_min?: number;
  rpe: number; // 1-10
  total_distance_km?: number;
  avg_heart_rate?: number;
  calculated_load?: number; // e.g., real_duration_min * rpe
}

// Módulo 5: Partidos y Estadísticas Detalladas
export type CompetitionType = "Liga" | "Torneo" | "Copa";
export type CompetitionStatus = "Planificada" | "En Curso" | "Finalizada" | "Cancelada";

export interface Competition {
  id: UUID;
  tenant_id: UUID;
  name: string;
  type: CompetitionType;
  season: string; // "2024-2025"
  start_date: string; // ISO Date string
  end_date: string; // ISO Date string
  max_rounds?: number;
  points_system?: { win: number; draw: number; loss: number };
  status: CompetitionStatus;
}

export type MatchStatus = "Programado" | "En Juego" | "Medio Tiempo" | "Finalizado" | "Suspendido" | "Aplazado";
export type WeatherCondition = "Despejado" | "Lluvia" | "Nieve" | "Viento" | "Calor";
export type MatchCompetitionType = "Liga" | "Amistoso" | "Torneo" | "Copa" | "Playoff";

export interface Match {
  id: UUID;
  tenant_id: UUID;
  session_id: UUID; // FK -> Session
  home_team_id: UUID; // FK -> Team
  away_team_id: UUID; // FK -> Team
  competition_id?: UUID; // FK -> Competition
  round_number?: number;
  home_goals: number;
  away_goals: number;
  final_result?: string; // "3-1", "0-0"
  competition_type: MatchCompetitionType;
  phase?: string; // "Fase Grupos", "Cuartos"
  main_referee?: string;
  assistant_referee_1?: string;
  assistant_referee_2?: string;
  status: MatchStatus;
  current_minute?: number;
  weather?: WeatherCondition;
  attendance_count?: number;
  incidents?: string;
}

export interface PlayerMatchStats {
  id: UUID;
  match_id: UUID; // FK -> Match
  player_id: UUID; // FK -> Player
  is_starter: boolean;
  entry_minute?: number;
  exit_minute?: number;
  minutes_played?: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  shots: number;
  shots_on_goal: number;
  fouls_committed: number;
  fouls_received: number;
  offsides: number;
  penalties_committed: number;
  penalties_received: number;
  recoveries: number;
  completed_passes: number;
  total_passes: number;
  pass_percentage?: number;
  coach_rating?: number; // 1-10
  performance_comments?: string;
}

export interface MatchEvent {
  id: UUID;
  match_id: UUID; // FK -> Match
  minute: number;
  event_type: "Gol" | "Tarjeta_Amarilla" | "Tarjeta_Roja" | "Cambio" | "Penalti" | "Gol_Penalti" | "Falta" | "Incidencia";
  primary_player_id?: UUID; // FK -> Player
  secondary_player_id?: UUID; // FK -> Player
  team: "Local" | "Visitante";
  description?: string;
  is_decisive: boolean;
}

export interface LineupTemplate {
  id: UUID;
  tenant_id: UUID;
  name: string;
  formation: string; // "4-4-2", "4-3-3"
  positions_json: string; // JSON string of positions
  description?: string;
  is_public: boolean;
  created_by_user_id: UUID;
  created_at: string;
  usage_count: number;
  category: "Defensiva" | "Ofensiva" | "Equilibrada" | "Contraataque";
}

export interface Lineup {
  id: UUID;
  match_id: UUID; // FK -> Match
  player_id: UUID; // FK -> Player
  role: "Titular" | "Suplente" | "No_Convocado";
  field_position?: string; // "POR", "DFC"
  position_x?: number; // 0-100
  position_y?: number; // 0-100
  jersey_number?: number;
  is_captain: boolean;
  expected_minutes?: number;
  special_instructions?: string;
}

// Módulo 6: Gestión Financiera y Notificaciones
export type DueStatus = "Pendiente" | "Pagada" | "Vencida" | "Anulada";
export type PaymentMethod = "Efectivo" | "Transferencia" | "Tarjeta" | "Otro";

export interface Due {
  id: UUID;
  tenant_id: UUID;
  player_id: UUID; // FK -> Player
  concept: string;
  amount: number;
  due_date: string; // ISO Date string
  status: DueStatus;
  creation_date: string; // ISO Date string
  payment_date?: string; // ISO Date string
  payment_method?: PaymentMethod;
  payment_reference?: string;
}
