"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Player } from "@/modules/core/types/db.types"
import { Badge } from "@/components/ui/badge"
import { Trophy, User, Calendar, Footprints } from "lucide-react"

interface PlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  player: Player
  positionName?: string
  teamName?: string
  className?: string
}

export function PlayerCard({ 
  player, 
  positionName = "Jugador", 
  teamName = "Academia FC",
  className,
  ...props 
}: PlayerCardProps) {
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = React.useState(false)

  // Random background selection
  const [bgImage, setBgImage] = React.useState("/fondo_cards/fondo_MedioCampo.png")

  React.useEffect(() => {
    const backgrounds = [
      "/fondo_cards/fondo_Portero.png",
      "/fondo_cards/fondo_Defensa.png",
      "/fondo_cards/fondo_MedioCampo.png",
      "/fondo_cards/fondo_Delantero.png",
      "/fondo_cards/fondo_Externo.png",
      "/fondo_cards/image-Photoroom.png"
    ]
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)]
    setBgImage(randomBg)
  }, [])

  // Calculate age
  const getAge = (dateString?: string) => {
    if (!dateString) return "N/A"
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Handle 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left
    const y = e.clientY - box.top
    const centerX = box.width / 2
    const centerY = box.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      className={cn(
        "relative group w-[300px] h-[450px] transition-all duration-200 ease-out perspective-[1000px]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        className={cn(
          "relative w-full h-full rounded-xl overflow-hidden shadow-xl transition-all duration-200 ease-out border-4 border-yellow-500/20",
          isHovering ? "shadow-2xl shadow-yellow-500/20" : ""
        )}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>

        {/* Shine Effect */}
        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{
            background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.2) 25%, transparent 30%)`,
            transform: `translateX(${rotate.y * 5}px) translateY(${rotate.x * 5}px)`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-20 h-full flex flex-col justify-between p-4 text-white">
          
          {/* Top Header: Rating & Position */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-yellow-400 drop-shadow-lg">
                {player.jersey_number || "99"}
              </span>
              <span className="text-lg font-bold uppercase tracking-wider drop-shadow-md">
                {positionName.substring(0, 3).toUpperCase()}
              </span>
              
              {/* Team Logo Placeholder */}
              <div className="mt-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Trophy className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               <Badge variant="outline" className="bg-black/40 border-yellow-500/50 text-yellow-400 backdrop-blur-md">
                 {teamName}
               </Badge>
            </div>
          </div>

          {/* Player Image Area */}
          <div className="flex-1 relative flex items-center justify-center my-2">
            <div className="relative w-48 h-48 rounded-full border-4 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.3)] overflow-hidden bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm">
              {player.photo_url ? (
                <Image
                  src={player.photo_url}
                  alt={`${player.first_name} ${player.last_name}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <User className="w-24 h-24 text-white/50" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-white drop-shadow-sm">
                {player.first_name} {player.last_name}
              </h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase">Edad</span>
                  <span className="text-sm font-bold">{getAge(player.birth_date)} años</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase">Pie</span>
                  <span className="text-sm font-bold">
                    {player.dominant_foot === 'RIGHT' ? 'Derecho' : 
                     player.dominant_foot === 'LEFT' ? 'Izquierdo' : 'Ambos'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
