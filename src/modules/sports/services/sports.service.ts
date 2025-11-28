import { Team, Player, Position } from "@/modules/core/types/db.types";

// Mock Data
const INITIAL_MOCK_TEAMS: Team[] = [
  { id: "1", tenant_id: "t1", name: "Sub-15 A", category: "Sub-15", is_own_team: true, is_active: true, description: "Equipo de alto rendimiento", date_created: new Date().toISOString() },
  { id: "2", tenant_id: "t1", name: "Sub-13 B", category: "Sub-13", is_own_team: true, is_active: true, description: "Equipo de desarrollo", date_created: new Date().toISOString() },
  { id: "3", tenant_id: "t1", name: "Rival FC", category: "Sub-15", is_own_team: false, is_active: true, description: "Equipo externo", date_created: new Date().toISOString() },
];

const INITIAL_MOCK_POSITIONS: Position[] = [
  { id: "1", tenant_id: "t1", name: "Portero", abbreviation: "POR", area: "Defensa" },
  { id: "2", tenant_id: "t1", name: "Defensa Central", abbreviation: "DFC", area: "Defensa" },
  { id: "3", tenant_id: "t1", name: "Mediocentro", abbreviation: "MC", area: "Mediocampo" },
  { id: "4", tenant_id: "t1", name: "Delantero Centro", abbreviation: "DC", area: "Ataque" },
];

const INITIAL_MOCK_PLAYERS: Player[] = [
  { 
    id: "1", tenant_id: "t1", team_id: "1", first_name: "Lionel", last_name: "Messi", 
    dni: "12345678", jersey_number: 10, dominant_foot: "LEFT", is_active: true,
    position_primary_id: "4", position_secondary_id: "3", birth_date: "1987-06-24",
    height_cm: 170, weight_kg: 72, emergency_contact: "Contact Messi: 555-1234",
    payment_status: "AL_DIA", is_senior: true, date_registered: new Date().toISOString()
  },
  { 
    id: "2", tenant_id: "t1", team_id: "1", first_name: "Cristiano", last_name: "Ronaldo", 
    dni: "87654321", jersey_number: 7, dominant_foot: "RIGHT", is_active: true,
    position_primary_id: "4", position_secondary_id: "4", birth_date: "1985-02-05",
    height_cm: 187, weight_kg: 83, emergency_contact: "Contact Ronaldo: 555-5678",
    payment_status: "AL_DIA", is_senior: true, date_registered: new Date().toISOString()
  },
];

const LOCAL_STORAGE_TEAMS_KEY = "mock_teams";
const LOCAL_STORAGE_POSITIONS_KEY = "mock_positions";
const LOCAL_STORAGE_PLAYERS_KEY = "mock_players";

function getLocalStorageTeams(): Team[] {
  if (typeof window === "undefined") return [];
  const storedTeams = localStorage.getItem(LOCAL_STORAGE_TEAMS_KEY);
  if (storedTeams) {
    return JSON.parse(storedTeams);
  }
  localStorage.setItem(LOCAL_STORAGE_TEAMS_KEY, JSON.stringify(INITIAL_MOCK_TEAMS));
  return INITIAL_MOCK_TEAMS;
}

function setLocalStorageTeams(teams: Team[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_TEAMS_KEY, JSON.stringify(teams));
}

function getLocalStoragePositions(): Position[] {
  if (typeof window === "undefined") return [];
  const storedPositions = localStorage.getItem(LOCAL_STORAGE_POSITIONS_KEY);
  if (storedPositions) {
    return JSON.parse(storedPositions);
  }
  localStorage.setItem(LOCAL_STORAGE_POSITIONS_KEY, JSON.stringify(INITIAL_MOCK_POSITIONS));
  return INITIAL_MOCK_POSITIONS;
}

function setLocalStoragePositions(positions: Position[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_POSITIONS_KEY, JSON.stringify(positions));
}

function getLocalStoragePlayers(): Player[] {
  if (typeof window === "undefined") return [];
  const storedPlayers = localStorage.getItem(LOCAL_STORAGE_PLAYERS_KEY);
  if (storedPlayers) {
    return JSON.parse(storedPlayers);
  }
  localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(INITIAL_MOCK_PLAYERS));
  return INITIAL_MOCK_PLAYERS;
}

function setLocalStoragePlayers(players: Player[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(players));
}

export const sportsService = {
  // Teams
  getTeams: async (): Promise<Team[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageTeams()), 500));
  },
  createTeam: async (team: Partial<Team>): Promise<Team> => {
    return new Promise((resolve) => {
      const teams = getLocalStorageTeams();
      const newTeam = { 
        ...team, 
        id: (teams.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", 
        is_active: true,
        date_created: new Date().toISOString()
      } as Team;
      teams.push(newTeam);
      setLocalStorageTeams(teams);
      setTimeout(() => resolve(newTeam), 500);
    });
  },
  updateTeam: async (id: string, team: Partial<Team>): Promise<Team> => {
    return new Promise((resolve, reject) => {
      const teams = getLocalStorageTeams();
      const index = teams.findIndex(t => t.id === id);
      if (index === -1) {
        reject("Team not found");
        return;
      }
      teams[index] = { ...teams[index], ...team };
      setLocalStorageTeams(teams);
      setTimeout(() => resolve(teams[index]), 500);
    });
  },
  deleteTeam: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let teams = getLocalStorageTeams();
      teams = teams.filter(t => t.id !== id);
      setLocalStorageTeams(teams);
      setTimeout(() => resolve(), 500);
    });
  },

  // Positions
  getPositions: async (): Promise<Position[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStoragePositions()), 500));
  },
  createPosition: async (position: Partial<Position>): Promise<Position> => {
    return new Promise((resolve) => {
      const positions = getLocalStoragePositions();
      const newPos = { 
        ...position, 
        id: (positions.length + 1).toString(), // Simple ID generation
        tenant_id: "t1" 
      } as Position;
      positions.push(newPos);
      setLocalStoragePositions(positions);
      setTimeout(() => resolve(newPos), 500);
    });
  },
  updatePosition: async (id: string, position: Partial<Position>): Promise<Position> => {
    return new Promise((resolve, reject) => {
      const positions = getLocalStoragePositions();
      const index = positions.findIndex(p => p.id === id);
      if (index === -1) {
        reject("Position not found");
        return;
      }
      positions[index] = { ...positions[index], ...position };
      setLocalStoragePositions(positions);
      setTimeout(() => resolve(positions[index]), 500);
    });
  },
  deletePosition: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let positions = getLocalStoragePositions();
      positions = positions.filter(p => p.id !== id);
      setLocalStoragePositions(positions);
      setTimeout(() => resolve(), 500);
    });
  },

  // Players
  getPlayers: async (): Promise<Player[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStoragePlayers()), 500));
  },
  createPlayer: async (player: Partial<Player>): Promise<Player> => {
    return new Promise((resolve) => {
      const players = getLocalStoragePlayers();
      const newPlayer = { 
        ...player, 
        id: (players.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", 
        is_active: true,
        date_registered: new Date().toISOString()
      } as Player;
      players.push(newPlayer);
      setLocalStoragePlayers(players);
      setTimeout(() => resolve(newPlayer), 500);
    });
  },
  updatePlayer: async (id: string, player: Partial<Player>): Promise<Player> => {
    return new Promise((resolve, reject) => {
      const players = getLocalStoragePlayers();
      const index = players.findIndex(p => p.id === id);
      if (index === -1) {
        reject("Player not found");
        return;
      }
      players[index] = { ...players[index], ...player };
      setLocalStoragePlayers(players);
      setTimeout(() => resolve(players[index]), 500);
    });
  },
  deletePlayer: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let players = getLocalStoragePlayers();
      players = players.filter(p => p.id !== id);
      setLocalStoragePlayers(players);
      setTimeout(() => resolve(), 500);
    });
  },

  // Sync helper functions (useful for detail pages)
  getPlayerById: (id: string): Player | undefined => {
    const players = getLocalStoragePlayers();
    return players.find(p => p.id === id);
  },

  getTeamById: (id: string): Team | undefined => {
    const teams = getLocalStorageTeams();
    return teams.find(t => t.id === id);
  },

  getPositionById: (id: string): Position | undefined => {
    const positions = getLocalStoragePositions();
    return positions.find(p => p.id === id);
  },

  getAllPositionsSync: (): Position[] => {
    return getLocalStoragePositions();
  }
};
