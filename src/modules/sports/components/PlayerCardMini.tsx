"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Player } from "@/modules/core/types/db.types";
import { User, Star, TrendingUp, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface PlayerCardMiniProps extends React.HTMLAttributes<HTMLDivElement> {
  player: Player;
  positionName?: string;
  teamName?: string;
  teamColor?: string;
  variant?: "default" | "compact" | "horizontal" | "badge" | "stats";
  showStats?: boolean;
  isSelected?: boolean;
  showTeamBadge?: boolean;
  rating?: number;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

// ========== Generative Utilities ==========
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateColors(seed: string) {
  const hash = hashString(seed);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 30 + (hash % 60)) % 360;
  const saturation = 60 + (hash % 30);
  const lightness = 45 + (hash % 15);

  return {
    primary: `hsl(${hue1}, ${saturation}%, ${lightness}%)`,
    secondary: `hsl(${hue2}, ${saturation - 10}%, ${lightness + 10}%)`,
    accent: `hsl(${(hue1 + 180) % 360}, ${saturation}%, ${lightness + 20}%)`,
    dark: `hsl(${hue1}, ${saturation - 20}%, 12%)`,
    glow: `hsl(${hue1}, ${saturation}%, ${lightness}%)`,
  };
}

function generatePattern(seed: string, colors: ReturnType<typeof generateColors>): React.ReactNode {
  const hash = hashString(seed);
  const patternType = hash % 6;

  const patterns: Record<number, React.ReactNode> = {
    0: ( // Diagonal lines
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <defs>
          <pattern id={`diag-${seed}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform={`rotate(${45 + (hash % 45)})`}>
            <line x1="0" y1="0" x2="0" y2="8" stroke={colors.accent} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#diag-${seed})`} />
      </svg>
    ),
    1: ( // Dots
      <svg className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="none">
        <defs>
          <pattern id={`dots-${seed}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="1.5" fill={colors.accent} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${seed})`} />
      </svg>
    ),
    2: ( // Hexagons
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
        <defs>
          <pattern id={`hex-${seed}`} width="20" height="17.32" patternUnits="userSpaceOnUse">
            <polygon points="10,0 20,5 20,13 10,17.32 0,13 0,5" fill="none" stroke={colors.accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hex-${seed})`} />
      </svg>
    ),
    3: ( // Waves
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M0,${30 + i * 15} Q25,${25 + i * 15 + (hash % 10)} 50,${30 + i * 15} T100,${30 + i * 15}`}
            fill="none"
            stroke={colors.accent}
            strokeWidth="0.5"
            opacity={0.5 - i * 0.1}
          />
        ))}
      </svg>
    ),
    4: ( // Grid
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
        <defs>
          <pattern id={`grid-${seed}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke={colors.accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${seed})`} />
      </svg>
    ),
    5: ( // Triangles
      <svg className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="none">
        <defs>
          <pattern id={`tri-${seed}`} width="16" height="14" patternUnits="userSpaceOnUse">
            <polygon points="8,0 16,14 0,14" fill="none" stroke={colors.accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#tri-${seed})`} />
      </svg>
    ),
  };

  return patterns[patternType];
}

function generateGeometricAccent(seed: string, colors: ReturnType<typeof generateColors>): React.ReactNode {
  const hash = hashString(seed);
  const shapeType = hash % 5;
  const rotation = hash % 360;

  const shapes: Record<number, React.ReactNode> = {
    0: (
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-40"
        style={{ background: `radial-gradient(circle, ${colors.primary}, transparent)` }}
      />
    ),
    1: (
      <div
        className="absolute -right-4 -bottom-4 w-20 h-20 opacity-30"
        style={{
          background: `linear-gradient(${rotation}deg, ${colors.primary}, transparent)`,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      />
    ),
    2: (
      <div
        className="absolute right-2 top-2 w-16 h-16 opacity-20"
        style={{
          background: colors.accent,
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          transform: `rotate(${rotation}deg)`,
        }}
      />
    ),
    3: (
      <div
        className="absolute -left-8 top-1/2 -translate-y-1/2 w-16 h-32 opacity-25 blur-xl"
        style={{ background: `linear-gradient(180deg, ${colors.primary}, ${colors.secondary})` }}
      />
    ),
    4: (
      <div
        className="absolute right-0 top-0 w-full h-1/2 opacity-20"
        style={{ 
          background: `linear-gradient(180deg, ${colors.primary}40, transparent)`,
        }}
      />
    ),
  };

  return shapes[shapeType];
}

// ========== Helper Functions ==========
function getAge(dateString?: string): number | null {
  if (!dateString) return null;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function getFootLabel(foot?: string): string {
  switch (foot) {
    case "RIGHT": return "D";
    case "LEFT": return "I";
    case "BOTH": return "A";
    default: return "–";
  }
}

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
}

// ========== Sub-Components ==========
const PlayerAvatar: React.FC<{
  player: Player;
  colors: ReturnType<typeof generateColors>;
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ player, colors, size = "md", className }) => {
  const initials = getInitials(player.first_name, player.last_name);
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-xl",
    lg: "w-24 h-24 text-3xl",
  };

  return (
    <div
      className={cn(
        "rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/10",
        sizeClasses[size],
        className
      )}
      style={{
        background: `linear-gradient(145deg, ${colors.primary}40, ${colors.secondary}40)`,
      }}
    >
      {player.photo_url ? (
        <img src={player.photo_url} alt="" className="w-full h-full object-cover rounded-xl" />
      ) : (
        initials || <User className={cn(size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-10 h-10", "text-white/60")} />
      )}
    </div>
  );
};

const JerseyNumber: React.FC<{
  number?: number;
  colors: ReturnType<typeof generateColors>;
  size?: "sm" | "md" | "lg";
}> = ({ number, colors, size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "px-2.5 py-1.5 text-xl",
    lg: "px-3 py-2 text-3xl",
  };

  return (
    <div
      className={cn(
        "rounded-lg font-black leading-none flex items-center justify-center",
        sizeClasses[size]
      )}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        color: colors.dark,
        boxShadow: `0 4px 12px ${colors.primary}40`,
      }}
    >
      {number ?? "00"}
    </div>
  );
};

const PositionBadge: React.FC<{
  position: string;
  colors: ReturnType<typeof generateColors>;
}> = ({ position, colors }) => (
  <div
    className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
    style={{
      background: `${colors.primary}20`,
      color: colors.primary,
    }}
  >
    {position.slice(0, 3)}
  </div>
);

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn(
          "w-3 h-3",
          star <= rating ? "fill-amber-400 text-amber-400" : "text-white/20"
        )}
      />
    ))}
  </div>
);

// ========== Main Component ==========
export function PlayerCardMini({
  player,
  positionName = "JUG",
  teamName,
  teamColor,
  variant = "default",
  showStats = true,
  isSelected = false,
  showTeamBadge = false,
  rating,
  onFavorite,
  isFavorite,
  className,
  onClick,
  ...props
}: PlayerCardMiniProps) {
  const seed = player.id || `${player.first_name}${player.last_name}${player.jersey_number}`;
  const colors = generateColors(seed);
  const age = getAge(player.birth_date);

  // ===== Badge Variant =====
  if (variant === "badge") {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all",
          isSelected && "ring-2 ring-primary ring-offset-2",
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${colors.dark}, hsl(0,0%,10%))`,
          border: `1px solid ${colors.primary}30`,
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: colors.dark }}
        >
          {player.jersey_number ?? "–"}
        </div>
        <span className="text-white text-sm font-medium truncate max-w-[100px]">
          {player.first_name} {player.last_name?.charAt(0)}.
        </span>
        <span className="text-white/50 text-xs uppercase">{positionName.slice(0, 3)}</span>
      </motion.div>
    );
  }

  // ===== Horizontal Variant =====
  if (variant === "horizontal") {
    return (
      <motion.div
        whileHover={{ scale: 1.02, x: 4 }}
        onClick={onClick}
        className={cn(
          "relative group w-full max-w-sm h-20 rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-lg",
          isSelected && "ring-2 ring-primary",
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, hsl(0,0%,8%) 100%)`,
        }}
      >
        {generatePattern(seed, colors)}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />
        
        <div className="relative z-10 h-full flex items-center gap-3 px-3">
          <PlayerAvatar player={player} colors={colors} size="md" className="shrink-0" />
          
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {player.first_name} {player.last_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white/60 text-xs">{positionName}</span>
              {teamName && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 text-xs truncate">{teamName}</span>
                </>
              )}
            </div>
            {rating && <RatingStars rating={rating} />}
          </div>

          <JerseyNumber number={player.jersey_number} colors={colors} size="sm" />
        </div>

        {/* Hover indicator */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TrendingUp className="w-4 h-4 text-white/40" />
        </div>
      </motion.div>
    );
  }

  // ===== Compact Variant =====
  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "relative group w-32 h-44 rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-xl",
          isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          className
        )}
        style={{
          background: `linear-gradient(160deg, ${colors.dark} 0%, hsl(0,0%,6%) 100%)`,
        }}
      >
        {generatePattern(seed, colors)}
        {generateGeometricAccent(seed, colors)}

        <div className="relative z-10 h-full flex flex-col p-2.5">
          {/* Number badge */}
          <div className="absolute top-2 right-2">
            <JerseyNumber number={player.jersey_number} colors={colors} size="sm" />
          </div>

          {/* Team indicator */}
          {showTeamBadge && teamColor && (
            <div 
              className="absolute top-2 left-2 w-2 h-8 rounded-full"
              style={{ background: teamColor }}
            />
          )}

          {/* Avatar */}
          <div className="flex-1 flex items-center justify-center pt-4">
            <PlayerAvatar player={player} colors={colors} size="md" />
          </div>

          {/* Name */}
          <div className="text-center mt-auto">
            <p className="text-white font-semibold text-xs truncate">{player.first_name}</p>
            <p className="text-white/50 text-[10px] truncate uppercase tracking-wider">{positionName}</p>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
          <span className="text-white/80 text-[10px] font-medium">Ver perfil</span>
        </div>
      </motion.div>
    );
  }

  // ===== Stats Variant =====
  if (variant === "stats") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={cn(
          "relative group w-64 rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-xl",
          isSelected && "ring-2 ring-primary",
          className
        )}
        style={{
          background: `linear-gradient(165deg, ${colors.dark} 0%, hsl(0,0%,6%) 100%)`,
        }}
      >
        {generatePattern(seed, colors)}
        
        <div className="relative z-10 p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <PlayerAvatar player={player} colors={colors} size="md" />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm truncate">{player.first_name} {player.last_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <PositionBadge position={positionName} colors={colors} />
                <span className="text-white/40 text-xs">#{player.jersey_number}</span>
              </div>
              {rating && <RatingStars rating={rating} />}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: <Zap className="w-3 h-3" />, value: age ?? "–", label: "Edad" },
              { icon: <TrendingUp className="w-3 h-3" />, value: player.height_cm ?? "–", label: "Altura" },
              { icon: <Shield className="w-3 h-3" />, value: player.weight_kg ?? "–", label: "Peso" },
              { icon: <Star className="w-3 h-3" />, value: getFootLabel(player.dominant_foot), label: "Pie" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-2 rounded-lg"
                style={{ background: `${colors.primary}10` }}
              >
                <span className="text-white/60 mb-1">{stat.icon}</span>
                <span className="text-white font-bold text-sm">{stat.value}</span>
                <span className="text-white/40 text-[8px] uppercase">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Team badge */}
          {teamName && (
            <div className="mt-3 flex items-center justify-center gap-2 py-2 rounded-lg" style={{ background: `${colors.primary}10` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: teamColor || colors.primary }} />
              <span className="text-white/70 text-xs">{teamName}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ===== Default Variant =====
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative group w-48 rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-2xl",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
      style={{
        background: `linear-gradient(165deg, ${colors.dark} 0%, hsl(0,0%,6%) 100%)`,
      }}
    >
      {generatePattern(seed, colors)}
      {generateGeometricAccent(seed, colors)}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <JerseyNumber number={player.jersey_number} colors={colors} size="md" />
          <PositionBadge position={positionName} colors={colors} />
        </div>

        {/* Favorite button */}
        {onFavorite && (
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(); }}
            className="absolute top-3 right-3 z-20"
          >
            <Star className={cn(
              "w-4 h-4 transition-colors",
              isFavorite ? "fill-amber-400 text-amber-400" : "text-white/30 hover:text-white/60"
            )} />
          </button>
        )}

        {/* Avatar */}
        <div className="flex justify-center my-4">
          <PlayerAvatar 
            player={player} 
            colors={colors} 
            size="lg" 
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Name */}
        <div className="text-center space-y-1">
          <h3 className="text-white font-bold text-base truncate">{player.first_name}</h3>
          <p className="text-white/70 font-medium text-sm truncate uppercase tracking-wide">{player.last_name}</p>
        </div>

        {/* Stats bar */}
        {showStats && (
          <div
            className="mt-4 flex items-center justify-center gap-4 py-2 px-3 rounded-xl"
            style={{ background: `${colors.primary}10` }}
          >
            {age && (
              <div className="text-center">
                <p className="text-white font-bold text-sm">{age}</p>
                <p className="text-white/40 text-[9px] uppercase">Años</p>
              </div>
            )}
            {player.height_cm && (
              <div className="text-center">
                <p className="text-white font-bold text-sm">{player.height_cm}</p>
                <p className="text-white/40 text-[9px] uppercase">cm</p>
              </div>
            )}
            {player.dominant_foot && (
              <div className="text-center">
                <p className="text-white font-bold text-sm">{getFootLabel(player.dominant_foot)}</p>
                <p className="text-white/40 text-[9px] uppercase">Pie</p>
              </div>
            )}
          </div>
        )}

        {/* Team badge */}
        {showTeamBadge && teamName && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: teamColor || colors.primary }} />
            <span className="text-white/50 text-xs">{teamName}</span>
          </div>
        )}
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${colors.primary}20, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

// Export utilities for external use
export { generateColors, hashString };
export type { PlayerCardMiniProps };
