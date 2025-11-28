import { Competition, Match, PlayerMatchStats, MatchEvent, LineupTemplate, Lineup } from "@/modules/core/types/db.types";

// Mock Data for Competitions
const INITIAL_MOCK_COMPETITIONS: Competition[] = [
  {
    id: "comp1",
    tenant_id: "t1",
    name: "Liga Regional Sub-15",
    type: "Liga",
    season: "2024-2025",
    start_date: "2024-09-01",
    end_date: "2025-05-30",
    status: "Planificada",
  },
  {
    id: "comp2",
    tenant_id: "t1",
    name: "Copa Primavera",
    type: "Copa",
    season: "2025",
    start_date: "2025-03-20",
    end_date: "2025-04-10",
    status: "Planificada",
  },
];

const LOCAL_STORAGE_COMPETITIONS_KEY = "mock_competitions";

function getLocalStorageCompetitions(): Competition[] {
  if (typeof window === "undefined") return [];
  const storedCompetitions = localStorage.getItem(LOCAL_STORAGE_COMPETITIONS_KEY);
  if (storedCompetitions) {
    return JSON.parse(storedCompetitions);
  }
  localStorage.setItem(LOCAL_STORAGE_COMPETITIONS_KEY, JSON.stringify(INITIAL_MOCK_COMPETITIONS));
  return INITIAL_MOCK_COMPETITIONS;
}

function setLocalStorageCompetitions(competitions: Competition[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_COMPETITIONS_KEY, JSON.stringify(competitions));
}

// Mock Data for Matches
const INITIAL_MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    tenant_id: "t1",
    session_id: "s2",
    home_team_id: "1",
    away_team_id: "3",
    competition_id: "comp1",
    round_number: 1,
    home_goals: 0,
    away_goals: 0,
    competition_type: "Liga",
    status: "Programado",
  },
];

const LOCAL_STORAGE_MATCHES_KEY = "mock_matches";

function getLocalStorageMatches(): Match[] {
  if (typeof window === "undefined") return [];
  const storedMatches = localStorage.getItem(LOCAL_STORAGE_MATCHES_KEY);
  if (storedMatches) {
    return JSON.parse(storedMatches);
  }
  localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(INITIAL_MOCK_MATCHES));
  return INITIAL_MOCK_MATCHES;
}

function setLocalStorageMatches(matches: Match[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(matches));
}

// Mock Data for Player Match Stats
const INITIAL_MOCK_PLAYER_MATCH_STATS: PlayerMatchStats[] = [
  { 
    id: "pms1", match_id: "m1", player_id: "1", is_starter: true, minutes_played: 90, 
    goals: 1, assists: 0, yellow_cards: 0, red_cards: 0, shots: 3, shots_on_goal: 2,
    fouls_committed: 1, fouls_received: 3, offsides: 0, penalties_committed: 0, penalties_received: 0,
    recoveries: 5, completed_passes: 30, total_passes: 35
  },
  { 
    id: "pms2", match_id: "m1", player_id: "2", is_starter: true, minutes_played: 90,
    goals: 0, assists: 1, yellow_cards: 1, red_cards: 0, shots: 2, shots_on_goal: 1,
    fouls_committed: 2, fouls_received: 2, offsides: 1, penalties_committed: 0, penalties_received: 0,
    recoveries: 4, completed_passes: 25, total_passes: 30
  },
];

const LOCAL_STORAGE_PLAYER_MATCH_STATS_KEY = "mock_player_match_stats";

function getLocalStoragePlayerMatchStats(): PlayerMatchStats[] {
  if (typeof window === "undefined") return [];
  const storedStats = localStorage.getItem(LOCAL_STORAGE_PLAYER_MATCH_STATS_KEY);
  if (storedStats) {
    return JSON.parse(storedStats);
  }
  localStorage.setItem(LOCAL_STORAGE_PLAYER_MATCH_STATS_KEY, JSON.stringify(INITIAL_MOCK_PLAYER_MATCH_STATS));
  return INITIAL_MOCK_PLAYER_MATCH_STATS;
}

function setLocalStoragePlayerMatchStats(stats: PlayerMatchStats[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_PLAYER_MATCH_STATS_KEY, JSON.stringify(stats));
}

// Mock Data for Match Events
const INITIAL_MOCK_MATCH_EVENTS: MatchEvent[] = [];
const LOCAL_STORAGE_MATCH_EVENTS_KEY = "mock_match_events";

function getLocalStorageMatchEvents(): MatchEvent[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_MATCH_EVENTS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(LOCAL_STORAGE_MATCH_EVENTS_KEY, JSON.stringify(INITIAL_MOCK_MATCH_EVENTS));
  return INITIAL_MOCK_MATCH_EVENTS;
}

function setLocalStorageMatchEvents(events: MatchEvent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_MATCH_EVENTS_KEY, JSON.stringify(events));
}

// Mock Data for Lineup Templates
const INITIAL_MOCK_LINEUP_TEMPLATES: LineupTemplate[] = [
  {
    id: "lt1", tenant_id: "t1", name: "4-4-2 Clásico", formation: "4-4-2",
    positions_json: JSON.stringify([]), is_public: true, created_by_user_id: "u1",
    created_at: new Date().toISOString(), usage_count: 0, category: "Equilibrada"
  }
];
const LOCAL_STORAGE_LINEUP_TEMPLATES_KEY = "mock_lineup_templates";

function getLocalStorageLineupTemplates(): LineupTemplate[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_LINEUP_TEMPLATES_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(LOCAL_STORAGE_LINEUP_TEMPLATES_KEY, JSON.stringify(INITIAL_MOCK_LINEUP_TEMPLATES));
  return INITIAL_MOCK_LINEUP_TEMPLATES;
}

function setLocalStorageLineupTemplates(templates: LineupTemplate[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_LINEUP_TEMPLATES_KEY, JSON.stringify(templates));
}

// Mock Data for Lineups
const INITIAL_MOCK_LINEUPS: Lineup[] = [];
const LOCAL_STORAGE_LINEUPS_KEY = "mock_lineups";

function getLocalStorageLineups(): Lineup[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_LINEUPS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(LOCAL_STORAGE_LINEUPS_KEY, JSON.stringify(INITIAL_MOCK_LINEUPS));
  return INITIAL_MOCK_LINEUPS;
}

function setLocalStorageLineups(lineups: Lineup[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_LINEUPS_KEY, JSON.stringify(lineups));
}

export const matchesService = {
  // Competitions
  getCompetitions: async (): Promise<Competition[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageCompetitions()), 300));
  },

  createCompetition: async (competition: Partial<Competition>): Promise<Competition> => {
    return new Promise((resolve) => {
      const competitions = getLocalStorageCompetitions();
      const newCompetition = {
        ...competition,
        id: (competitions.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
        status: "Planificada",
      } as Competition;
      competitions.push(newCompetition);
      setLocalStorageCompetitions(competitions);
      setTimeout(() => resolve(newCompetition), 500);
    });
  },
  
  deleteCompetition: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let competitions = getLocalStorageCompetitions();
      competitions = competitions.filter((c) => c.id !== id);
      setLocalStorageCompetitions(competitions);
      setTimeout(() => resolve(), 300);
    });
  },

  // Matches
  getMatches: async (): Promise<Match[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageMatches()), 500));
  },
  
  getMatchById: async (id: string): Promise<Match | undefined> => {
    return new Promise((resolve) => {
      const matches = getLocalStorageMatches();
      const match = matches.find((m) => m.id === id);
      setTimeout(() => resolve(match), 300);
    });
  },

  createMatch: async (match: Partial<Match>): Promise<Match> => {
    return new Promise((resolve) => {
      const matches = getLocalStorageMatches();
      const newMatch = {
        ...match,
        id: (matches.length + 1).toString(), // Simple ID generation
        tenant_id: "t1",
        home_goals: 0,
        away_goals: 0,
        status: "Programado",
      } as Match;
      matches.push(newMatch);
      setLocalStorageMatches(matches);
      setTimeout(() => resolve(newMatch), 500);
    });
  },
  
  deleteMatch: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let matches = getLocalStorageMatches();
      matches = matches.filter((m) => m.id !== id);
      setLocalStorageMatches(matches);
      setTimeout(() => resolve(), 300);
    });
  },
  
  // Player Match Stats
  getPlayerMatchStatsForMatch: async (matchId: string): Promise<PlayerMatchStats[]> => {
    return new Promise((resolve) => {
      const allStats = getLocalStoragePlayerMatchStats();
      const matchStats = allStats.filter((stat) => stat.match_id === matchId);
      setTimeout(() => resolve(matchStats), 300);
    });
  },
  
  batchUpdatePlayerMatchStats: async (stats: Partial<PlayerMatchStats>[]): Promise<PlayerMatchStats[]> => {
    return new Promise((resolve) => {
      let allStats = getLocalStoragePlayerMatchStats();
      const updatedStats: PlayerMatchStats[] = [];

      stats.forEach(stat => {
        if (stat.id) { // Update existing stat
          const index = allStats.findIndex(s => s.id === stat.id);
          if (index !== -1) {
            allStats[index] = { ...allStats[index], ...stat };
            updatedStats.push(allStats[index]);
          }
        } else { // Create new stat
          const newStat = {
            ...stat,
            id: `pms${allStats.length + 1}`,
          } as PlayerMatchStats;
          allStats.push(newStat);
          updatedStats.push(newStat);
        }
      });
      
      setLocalStoragePlayerMatchStats(allStats);
      setTimeout(() => resolve(updatedStats), 500);
    });
  },

  // Match Events
  getMatchEvents: async (matchId: string): Promise<MatchEvent[]> => {
    return new Promise((resolve) => {
      const allEvents = getLocalStorageMatchEvents();
      const matchEvents = allEvents.filter((e) => e.match_id === matchId);
      setTimeout(() => resolve(matchEvents), 300);
    });
  },

  createMatchEvent: async (event: Partial<MatchEvent>): Promise<MatchEvent> => {
    return new Promise((resolve) => {
      const allEvents = getLocalStorageMatchEvents();
      const newEvent = {
        ...event,
        id: `evt${allEvents.length + 1}`,
      } as MatchEvent;
      allEvents.push(newEvent);
      setLocalStorageMatchEvents(allEvents);
      setTimeout(() => resolve(newEvent), 300);
    });
  },

  deleteMatchEvent: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let allEvents = getLocalStorageMatchEvents();
      allEvents = allEvents.filter((e) => e.id !== id);
      setLocalStorageMatchEvents(allEvents);
      setTimeout(() => resolve(), 300);
    });
  },

  // Lineup Templates
  getLineupTemplates: async (): Promise<LineupTemplate[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageLineupTemplates()), 300));
  },

  createLineupTemplate: async (template: Partial<LineupTemplate>): Promise<LineupTemplate> => {
    return new Promise((resolve) => {
      const templates = getLocalStorageLineupTemplates();
      const newTemplate = {
        ...template,
        id: `lt${templates.length + 1}`,
        created_at: new Date().toISOString(),
        usage_count: 0,
      } as LineupTemplate;
      templates.push(newTemplate);
      setLocalStorageLineupTemplates(templates);
      setTimeout(() => resolve(newTemplate), 300);
    });
  },

  // Lineups
  getMatchLineup: async (matchId: string): Promise<Lineup[]> => {
    return new Promise((resolve) => {
      const allLineups = getLocalStorageLineups();
      const matchLineup = allLineups.filter((l) => l.match_id === matchId);
      setTimeout(() => resolve(matchLineup), 300);
    });
  },

  saveMatchLineup: async (matchId: string, lineup: Partial<Lineup>[]): Promise<Lineup[]> => {
    return new Promise((resolve) => {
      let allLineups = getLocalStorageLineups();
      // Remove existing lineup for this match
      allLineups = allLineups.filter((l) => l.match_id !== matchId);
      
      const newLineup = lineup.map((l, index) => ({
        ...l,
        id: l.id || `l${Date.now()}${index}`,
        match_id: matchId,
      } as Lineup));
      
      allLineups.push(...newLineup);
      setLocalStorageLineups(allLineups);
      setTimeout(() => resolve(newLineup), 500);
    });
  },
};
