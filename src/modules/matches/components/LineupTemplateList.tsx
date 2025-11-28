"use client";

import { useState, useEffect } from "react";
import { LineupTemplate } from "@/modules/core/types/db.types";
import { matchesService } from "@/modules/matches/services/matches.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LineupTemplateList() {
  const [templates, setTemplates] = useState<LineupTemplate[]>([]);

  useEffect(() => {
    matchesService.getLineupTemplates().then(setTemplates);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <Badge variant="outline">{template.formation}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{template.category}</p>
            <Button variant="secondary" className="w-full">Usar Plantilla</Button>
          </CardContent>
        </Card>
      ))}
      <Card className="flex items-center justify-center min-h-[150px] border-dashed cursor-pointer hover:bg-accent/50">
        <div className="text-center">
          <p className="font-medium">Crear Nueva Plantilla</p>
        </div>
      </Card>
    </div>
  );
}
