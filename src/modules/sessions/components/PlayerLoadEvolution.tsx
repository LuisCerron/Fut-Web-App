"use client";

import { useEffect, useState } from "react";
import { PlayerLoad, Session } from "@/modules/core/types/db.types";
import { sessionsService } from "@/modules/sessions/services/sessions.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface PlayerLoadEvolutionProps {
  playerId: string;
}

export function PlayerLoadEvolution({ playerId }: PlayerLoadEvolutionProps) {
  const [loads, setLoads] = useState<PlayerLoad[]>([]);
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [playerId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [playerLoadsData, sessionsData] = await Promise.all([
        sessionsService.getPlayerLoadsForPlayer(playerId),
        sessionsService.getSessions(),
      ]);

      setLoads(playerLoadsData);
      const sessionsMap = sessionsData.reduce((acc, s) => ({ ...acc, [s.id]: s }), {} as Record<string, Session>);
      setSessions(sessionsMap);

    } catch (error) {
      console.error("Error loading player load evolution:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    return loads
      .map(load => {
        const session = sessions[load.session_id];
        if (!session) return null;
        return {
          date: new Date(session.start_time).toLocaleDateString(),
          fullDate: session.start_time,
          load: (load.real_duration_min || 0) * (load.rpe || 0),
          rpe: load.rpe,
          duration: load.real_duration_min,
          sessionType: session.session_type
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => new Date(a!.fullDate).getTime() - new Date(b!.fullDate).getTime());
  };

  const chartData = getChartData();

  if (loading) {
    return <div>Cargando evolución de carga...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Carga Física</CardTitle>
          <CardDescription>Carga calculada (Duración x RPE) por sesión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded p-2 shadow-md text-sm">
                          <p className="font-bold">{label}</p>
                          <p>Tipo: {data.sessionType}</p>
                          <p>Carga: {data.load}</p>
                          <p>RPE: {data.rpe}</p>
                          <p>Duración: {data.duration} min</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="load" stroke="#8884d8" name="Carga (UA)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>RPE Promedio</CardTitle>
            <CardDescription>Percepción Subjetiva del Esfuerzo (1-10)</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="rpe" fill="#82ca9d" name="RPE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duración de Sesiones</CardTitle>
            <CardDescription>Minutos por sesión</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="duration" fill="#ffc658" name="Duración (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
