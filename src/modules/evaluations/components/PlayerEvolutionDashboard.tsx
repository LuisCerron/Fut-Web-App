"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Player, Evaluation, EvaluationDetail, Attribute } from "@/modules/core/types/db.types";
import { sportsService } from "@/modules/sports/services/sports.service";
import { evaluationsService } from "@/modules/evaluations/services/evaluations.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  User, 
  Calendar,
  Activity,
  Target,
  Award,
  Loader2
} from "lucide-react";
import { PlayerLoadEvolution } from "@/modules/sessions/components/PlayerLoadEvolution";
import { MotionWrapper, MotionList, MotionItem } from "@/components/ui/motion-wrapper";

interface EvaluationWithDetails extends Evaluation {
  details: EvaluationDetail[];
}

export function PlayerEvolutionDashboard() {
  const params = useParams();
  const router = useRouter();
  const playerId = params?.id as string;

  const [player, setPlayer] = useState<Player | null>(null);
  const [evaluations, setEvaluations] = useState<EvaluationWithDetails[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [playerId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [playersData, evaluationsData, attributesData] = await Promise.all([
        sportsService.getPlayers(),
        evaluationsService.getEvaluations(),
        evaluationsService.getAttributes(),
      ]);

      const foundPlayer = playersData.find(p => p.id === playerId);
      setPlayer(foundPlayer || null);
      setAttributes(attributesData);

      // Get evaluations for this player with their details
      const playerEvaluations = evaluationsData
        .filter(e => e.player_id === playerId)
        .sort((a, b) => new Date(a.evaluation_date).getTime() - new Date(b.evaluation_date).getTime());

      const evaluationsWithDetails: EvaluationWithDetails[] = await Promise.all(
        playerEvaluations.map(async (evaluation) => {
          const details = await evaluationsService.getEvaluationDetailsForEvaluation(evaluation.id);
          return { ...evaluation, details };
        })
      );

      setEvaluations(evaluationsWithDetails);
      
      if (attributesData.length > 0) {
        setSelectedAttribute(attributesData[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for line chart (evolution over time)
  const getLineChartData = () => {
    return evaluations.map(evaluation => {
      const dataPoint: Record<string, any> = {
        date: new Date(evaluation.evaluation_date).toLocaleDateString("es-ES", { 
          month: "short", 
          year: "2-digit" 
        }),
        fullDate: evaluation.evaluation_date,
        type: evaluation.evaluation_type,
      };

      evaluation.details.forEach(detail => {
        const attr = attributes.find(a => a.id === detail.attribute_id);
        if (attr && detail.numeric_value !== undefined) {
          dataPoint[attr.name] = detail.numeric_value;
        }
      });

      return dataPoint;
    });
  };

  // Prepare data for radar chart (latest evaluation snapshot)
  const getRadarChartData = () => {
    if (evaluations.length === 0) return [];
    
    const latestEvaluation = evaluations[evaluations.length - 1];
    return latestEvaluation.details
      .filter(d => d.numeric_value !== undefined)
      .map(detail => {
        const attr = attributes.find(a => a.id === detail.attribute_id);
        return {
          attribute: attr?.name || "Desconocido",
          value: detail.numeric_value || 0,
          fullMark: attr?.max_value || 10,
        };
      });
  };

  // Calculate trend for each attribute
  const getAttributeTrend = (attributeId: string) => {
    const values: number[] = [];
    evaluations.forEach(e => {
      const detail = e.details.find(d => d.attribute_id === attributeId);
      if (detail?.numeric_value !== undefined) {
        values.push(detail.numeric_value);
      }
    });

    if (values.length < 2) return { trend: "neutral", change: 0 };
    
    const lastValue = values[values.length - 1];
    const previousValue = values[values.length - 2];
    const change = lastValue - previousValue;

    if (change > 0) return { trend: "up", change };
    if (change < 0) return { trend: "down", change };
    return { trend: "neutral", change: 0 };
  };

  // Get latest value for an attribute
  const getLatestValue = (attributeId: string) => {
    for (let i = evaluations.length - 1; i >= 0; i--) {
      const detail = evaluations[i].details.find(d => d.attribute_id === attributeId);
      if (detail?.numeric_value !== undefined) {
        return detail.numeric_value;
      }
    }
    return null;
  };

  const lineChartData = getLineChartData();
  const radarChartData = getRadarChartData();

  // Color palette for attributes
  const COLORS = ["#50941c", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando datos del jugador...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <MotionWrapper className="text-center py-16">
        <div className="bg-muted/50 p-8 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <User className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Jugador no encontrado</h3>
        <p className="text-muted-foreground mb-6">No se pudo cargar la información del jugador.</p>
        <Button variant="outline" onClick={() => router.back()} className="h-11 gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              {player.first_name} {player.last_name}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">Dashboard de Evolución</p>
          </div>
        </div>
        <Badge variant="outline" className="text-base md:text-lg px-4 py-2 self-start sm:self-auto">
          #{player.jersey_number}
        </Badge>
      </div>

      {/* Stats Overview */}
      <MotionList className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MotionItem>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardDescription className="text-xs md:text-sm">Total Evaluaciones</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <span className="text-2xl md:text-3xl font-bold">{evaluations.length}</span>
              </div>
            </CardContent>
          </Card>
        </MotionItem>
        <MotionItem>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardDescription className="text-xs md:text-sm">Atributos Evaluados</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Target className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                </div>
                <span className="text-2xl md:text-3xl font-bold">
                  {new Set(evaluations.flatMap(e => e.details.map(d => d.attribute_id))).size}
                </span>
              </div>
            </CardContent>
          </Card>
        </MotionItem>
        <MotionItem>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardDescription className="text-xs md:text-sm">Última Evaluación</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                </div>
                <span className="text-sm md:text-lg font-medium">
                  {evaluations.length > 0 
                    ? new Date(evaluations[evaluations.length - 1].evaluation_date).toLocaleDateString("es-ES")
                    : "N/A"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </MotionItem>
        <MotionItem>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardDescription className="text-xs md:text-sm">Promedio General</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Award className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                </div>
                <span className="text-2xl md:text-3xl font-bold">
                  {evaluations.length > 0
                    ? (
                        evaluations[evaluations.length - 1].details
                          .filter(d => d.numeric_value !== undefined)
                          .reduce((sum, d) => sum + (d.numeric_value || 0), 0) /
                        evaluations[evaluations.length - 1].details.filter(d => d.numeric_value !== undefined).length
                      ).toFixed(1)
                    : "N/A"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </MotionItem>
      </MotionList>

      <Tabs defaultValue="evolution" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex h-auto p-1">
          <TabsTrigger value="evolution" className="text-xs md:text-sm px-2 md:px-4 py-2.5 md:py-2">📈 Evolución</TabsTrigger>
          <TabsTrigger value="radar" className="text-xs md:text-sm px-2 md:px-4 py-2.5 md:py-2">🎯 Perfil</TabsTrigger>
          <TabsTrigger value="attributes" className="text-xs md:text-sm px-2 md:px-4 py-2.5 md:py-2">📊 Atributos</TabsTrigger>
          <TabsTrigger value="load" className="text-xs md:text-sm px-2 md:px-4 py-2.5 md:py-2">🏋️ Carga</TabsTrigger>
        </TabsList>

        {/* Evolution Tab - Line Chart */}
        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Atributos</CardTitle>
              <CardDescription>
                Progreso del jugador a lo largo del tiempo en todas las evaluaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    {attributes.map((attr, index) => (
                      <Line
                        key={attr.id}
                        type="monotone"
                        dataKey={attr.name}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No hay evaluaciones registradas para mostrar la evolución
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Radar Tab - Current Profile */}
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Perfil de Habilidades Actual</CardTitle>
              <CardDescription>
                Snapshot de la última evaluación realizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              {radarChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarChartData}>
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis 
                      dataKey="attribute" 
                      className="text-xs"
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 10]} 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <Radar
                      name="Valor"
                      dataKey="value"
                      stroke="#50941c"
                      fill="#50941c"
                      fillOpacity={0.5}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No hay evaluaciones registradas
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attributes Tab - Individual Cards */}
        <TabsContent value="attributes">
          <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {attributes.map((attr, index) => {
              const { trend, change } = getAttributeTrend(attr.id);
              const latestValue = getLatestValue(attr.id);

              return (
                <MotionItem key={attr.id}>
                  <Card className="hover:shadow-md active:scale-[0.99] transition-all duration-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm md:text-base">{attr.name}</CardTitle>
                        <Badge 
                          variant="outline" 
                          style={{ 
                            borderColor: COLORS[index % COLORS.length],
                            color: COLORS[index % COLORS.length]
                          }}
                        >
                          {attr.type}
                        </Badge>
                      </div>
                      <CardDescription>{attr.scale_type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl md:text-4xl font-bold">
                            {latestValue !== null ? latestValue : "—"}
                          </span>
                          <span className="text-muted-foreground">
                            /{attr.max_value || 10}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          trend === "up" ? "text-green-500" : 
                          trend === "down" ? "text-red-500" : "text-muted-foreground"
                        }`}>
                          {trend === "up" && <TrendingUp className="h-5 w-5" />}
                          {trend === "down" && <TrendingDown className="h-5 w-5" />}
                          {trend === "neutral" && <Minus className="h-5 w-5" />}
                          <span className="font-medium">
                            {change > 0 ? `+${change}` : change === 0 ? "=" : change}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </MotionItem>
              );
            })}
          </MotionList>
        </TabsContent>

        {/* Load Tab */}
        <TabsContent value="load">
          <PlayerLoadEvolution playerId={playerId} />
        </TabsContent>
      </Tabs>

      {/* Evaluation History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Evaluaciones</CardTitle>
          <CardDescription>Todas las evaluaciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          {evaluations.length > 0 ? (
            <div className="space-y-4">
              {[...evaluations].reverse().map((evaluation) => (
                <div 
                  key={evaluation.id} 
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {new Date(evaluation.evaluation_date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                      <Badge variant={evaluation.status === "Completada" ? "default" : "secondary"}>
                        {evaluation.status}
                      </Badge>
                      <Badge variant="outline">{evaluation.evaluation_type}</Badge>
                    </div>
                    {evaluation.general_comments && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {evaluation.general_comments}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {evaluation.details.slice(0, 5).map((detail) => {
                        const attr = attributes.find(a => a.id === detail.attribute_id);
                        return (
                          <Badge key={detail.id} variant="secondary" className="text-xs">
                            {attr?.name}: {detail.numeric_value ?? detail.text_value}
                          </Badge>
                        );
                      })}
                      {evaluation.details.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{evaluation.details.length - 5} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay evaluaciones registradas para este jugador</p>
              <Button variant="outline" className="mt-4 h-11" onClick={() => router.push("/dashboard/evaluations")}>
                Crear Primera Evaluación
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </MotionWrapper>
  );
}
