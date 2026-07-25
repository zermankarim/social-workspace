import type { ComponentType, CSSProperties } from "react";
import {
  CheckCircle2,
  Flame,
  Lock,
  MessageSquare,
  ThumbsUp,
  Coins,
  FileText,
  Heart,
  Star,
  Users,
} from "lucide-react";
import type {
  BadgeCategory,
  BadgeTier,
} from "@/core/domain/entities/badge-catalog.entity";

const CATEGORY_ICON: Record<
  BadgeCategory,
  ComponentType<{ className?: string; style?: CSSProperties }>
> = {
  streak: Flame,
  connections: Users,
  followers: Star,
  posts: FileText,
  likesReceived: Heart,
  commentsReceived: MessageSquare,
  endorsementsReceived: ThumbsUp,
  points: Coins,
  profile: CheckCircle2,
};

const TIER_GRADIENT: Record<
  BadgeTier,
  { from: string; to: string; ring: string }
> = {
  bronze: { from: "#D89A61", to: "#8B5A2B", ring: "#F0C089" },
  silver: { from: "#E4E9F0", to: "#9AA5B1", ring: "#FFFFFF" },
  gold: { from: "#FFE08A", to: "#D69A1F", ring: "#FFF3C4" },
  platinum: { from: "#EAF4FF", to: "#9FB8D9", ring: "#FFFFFF" },
};

const SIZE_PX = { sm: 32, md: 44, lg: 72 } as const;

type BadgeIconProps = {
  category: BadgeCategory;
  tier: BadgeTier;
  earned: boolean;
  size?: keyof typeof SIZE_PX;
  className?: string;
};

export function BadgeIcon({
  category,
  tier,
  earned,
  size = "md",
  className,
}: BadgeIconProps) {
  const Icon = CATEGORY_ICON[category];
  const gradient = TIER_GRADIENT[tier];
  const px = SIZE_PX[size];
  const gradientId = `badge-gradient-${category}-${tier}-${size}`;
  const iconPx = px * 0.42;
  const lockPx = px * 0.32;

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className ?? ""}`}
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 40 40"
        width={px}
        height={px}
        aria-hidden
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={earned ? gradient.from : "#CBD0D8"} />
            <stop offset="100%" stopColor={earned ? gradient.to : "#9DA4AE"} />
          </linearGradient>
        </defs>
        <circle
          cx="20"
          cy="20"
          r="18"
          fill={`url(#${gradientId})`}
          stroke={earned ? gradient.ring : "#DDE1E6"}
          strokeWidth="1.5"
          opacity={earned ? 1 : 0.6}
        />
        <circle
          cx="20"
          cy="20"
          r="14"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
      </svg>
      <Icon
        className={earned ? "relative text-white" : "relative text-white/70"}
        style={{ width: iconPx, height: iconPx }}
      />
      {!earned ? (
        <Lock
          className="absolute -right-0.5 -bottom-0.5 rounded-full bg-surface p-0.5 text-muted ring-1 ring-border"
          style={{ width: lockPx, height: lockPx }}
        />
      ) : null}
    </div>
  );
}
