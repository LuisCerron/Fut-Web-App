"use client";

import { PlayerCardMini } from "@/modules/sports/components/PlayerCardMini";
import { Player } from "@/modules/core/types/db.types";
import { useState } from "react";

// Sample players for demo
const samplePlayers: (Player & { positionName: string })[] = [
  {
    id: "p1",
    tenant_id: "t1",
    first_name: "Carlos",
    last_name: "Mendoza",
    jersey_number: 10,
    birth_date: "2008-03-15",
    dominant_foot: "RIGHT",
    height_cm: 168,
    is_active: true,
    positionName: "Mediocampista",
  },
  {
    id: "p2",
    tenant_id: "t1",
    first_name: "Luis",
    last_name: "Torres",
    jersey_number: 9,
    birth_date: "2007-08-22",
    dominant_foot: "LEFT",
    height_cm: 175,
    is_active: true,
    positionName: "Delantero",
  },
  {
    id: "p3",
    tenant_id: "t1",
    first_name: "Miguel",
    last_name: "García",
    jersey_number: 1,
    birth_date: "2006-11-10",
    dominant_foot: "RIGHT",
    height_cm: 182,
    is_active: true,
    positionName: "Portero",
  },
  {
    id: "p4",
    tenant_id: "t1",
    first_name: "Andrés",
    last_name: "Ramírez",
    jersey_number: 4,
    birth_date: "2008-05-03",
    dominant_foot: "BOTH",
    height_cm: 171,
    is_active: true,
    positionName: "Defensa",
  },
  {
    id: "p5",
    tenant_id: "t1",
    first_name: "Diego",
    last_name: "Fernández",
    jersey_number: 7,
    birth_date: "2009-01-28",
    dominant_foot: "RIGHT",
    height_cm: 165,
    is_active: true,
    positionName: "Extremo",
  },
  {
    id: "p6",
    tenant_id: "t1",
    first_name: "Sebastián",
    last_name: "López",
    jersey_number: 23,
    birth_date: "2007-12-05",
    dominant_foot: "LEFT",
    height_cm: 178,
    is_active: true,
    positionName: "Lateral",
  },
];

export default function CardsDemoPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Player Cards</h1>
          <p className="text-neutral-400">
            Diseño minimalista con colores y patrones generados proceduralmente
          </p>
        </div>

        {/* Default Variant */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Default — Tarjeta Principal
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {samplePlayers.slice(0, 4).map((player) => (
              <PlayerCardMini
                key={player.id}
                player={player}
                positionName={player.positionName}
                teamName="Sub-15"
                variant="default"
                showTeamBadge
                isSelected={selectedPlayer === player.id}
                onClick={() => setSelectedPlayer(player.id)}
                onFavorite={() => toggleFavorite(player.id)}
                isFavorite={favorites.includes(player.id)}
              />
            ))}
          </div>
        </section>

        {/* Stats Variant - NEW */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Stats — Con Métricas Detalladas
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {samplePlayers.slice(0, 3).map((player) => (
              <PlayerCardMini
                key={player.id}
                player={{...player, weight_kg: 60 + Math.floor(Math.random() * 20)}}
                positionName={player.positionName}
                teamName="Sub-15"
                teamColor="#3b82f6"
                variant="stats"
                rating={3 + Math.floor(Math.random() * 3)}
              />
            ))}
          </div>
        </section>

        {/* Compact Variant */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Compact — Para Grids Densos
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {samplePlayers.map((player) => (
              <PlayerCardMini
                key={player.id}
                player={player}
                positionName={player.positionName}
                variant="compact"
                showTeamBadge
                teamColor="#22c55e"
                isSelected={selectedPlayer === player.id}
                onClick={() => setSelectedPlayer(player.id)}
              />
            ))}
          </div>
        </section>

        {/* Horizontal Variant */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Horizontal — Para Listas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {samplePlayers.map((player) => (
              <PlayerCardMini
                key={player.id}
                player={player}
                positionName={player.positionName}
                teamName="Academia FC"
                variant="horizontal"
                rating={3 + Math.floor(Math.random() * 3)}
              />
            ))}
          </div>
        </section>

        {/* Badge Variant - NEW */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Badge — Selección Rápida
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {samplePlayers.map((player) => (
              <PlayerCardMini
                key={player.id}
                player={player}
                positionName={player.positionName}
                variant="badge"
                isSelected={selectedPlayer === player.id}
                onClick={() => setSelectedPlayer(player.id)}
              />
            ))}
          </div>
        </section>

        {/* Color Showcase */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Generación Procedural — Cada Jugador Único
          </h2>
          <p className="text-neutral-500 text-sm">
            Los colores y patrones se generan a partir del ID del jugador, creando una identidad visual única y consistente.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {Array.from({ length: 12 }, (_, i) => ({
              id: `demo-${i}`,
              tenant_id: "t1",
              first_name: ["Mateo", "Lucas", "Juan", "Pedro", "Pablo", "Tomás", "Felipe", "Nicolás", "Daniel", "Gabriel", "Samuel", "David"][i],
              last_name: ["Silva", "Martínez", "Rojas", "Vargas", "Castro", "Herrera", "Morales", "Ortega", "Ruiz", "Soto", "Vega", "Cruz"][i],
              jersey_number: Math.floor(Math.random() * 99) + 1,
              birth_date: `200${7 + (i % 3)}-0${(i % 9) + 1}-15`,
              dominant_foot: (["RIGHT", "LEFT", "BOTH"] as const)[i % 3],
              height_cm: 160 + Math.floor(Math.random() * 25),
              is_active: true,
            })).map((player) => (
              <PlayerCardMini
                key={player.id}
                player={player}
                positionName={["POR", "DEF", "MED", "DEL"][Math.floor(Math.random() * 4)]}
                variant="compact"
              />
            ))}
          </div>
        </section>

        {/* Usage Note */}
        <section className="bg-white/5 rounded-xl p-6 text-sm text-neutral-400 space-y-2">
          <h3 className="text-white font-medium">Uso</h3>
          <pre className="bg-black/30 rounded-lg p-4 overflow-x-auto text-xs">
{`import { PlayerCardMini } from "@/modules/sports/components/PlayerCardMini";

<PlayerCardMini 
  player={player} 
  positionName="Delantero"
  teamName="Sub-15"
  variant="default" // "default" | "compact" | "horizontal" | "badge" | "stats"
  showStats
  showTeamBadge
  isSelected={false}
  rating={4}
  onFavorite={() => {}}
  isFavorite={false}
/>`}
          </pre>
        </section>
      </div>
    </div>
  );
}
