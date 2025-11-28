"use client"

import { PlayerDetailPage } from "@/modules/sports/components/PlayerDetailPage"
import { use } from "react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PlayerDetailPageRoute({ params }: PageProps) {
  const resolvedParams = use(params)
  return <PlayerDetailPage playerId={resolvedParams.id} />
}
