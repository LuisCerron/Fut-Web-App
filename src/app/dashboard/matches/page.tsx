import { MatchList } from "@/modules/matches/components/MatchList";
import { LineupTemplateList } from "@/modules/matches/components/LineupTemplateList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Partidos</h1>
      </div>

      <Tabs defaultValue="matches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matches">Partidos</TabsTrigger>
          <TabsTrigger value="templates">Plantillas de Alineación</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches">
           <MatchList />
        </TabsContent>
        
        <TabsContent value="templates">
           <LineupTemplateList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
