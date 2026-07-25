import type { CSSProperties } from "react";
import {
  getStreakTier,
  STREAK_TIER_STYLE,
} from "@/presentation/components/shared/streak-flame/streak-flame.config";

type StreakFlameSize = "sm" | "md";

type StreakFlameProps = {
  streak: number;
  size?: StreakFlameSize;
  /** Localized accessible label, e.g. "12 day streak". Falls back to a plain string. */
  label?: string;
  className?: string;
};

const DIMENSIONS: Record<StreakFlameSize, number> = {
  sm: 16,
  md: 22,
};

const OUTER_FLAME_PATH =
  "M12 2C7 7 4 11 4 15.5 4 20.2 7.6 24 12 24S20 20.2 20 15.5C20 11 17 7 12 2Z";
const CORE_FLAME_PATH =
  "M12 8C9.5 11 8 13.2 8 16 8 19 9.8 21 12 21S16 19 16 16C16 13.2 14.5 11 12 8Z";

/**
 * Tiered, physics-inspired streak indicator: cooler orange embers at low
 * streaks, hottest blue-white flame at the top tier — see streak-flame.config.
 */
export function StreakFlame({
  streak,
  size = "md",
  label,
  className = "",
}: StreakFlameProps) {
  const tier = getStreakTier(streak);
  const style = STREAK_TIER_STYLE[tier];
  const px = DIMENSIONS[size];
  const isActive = tier > 0;
  const accessibleLabel = label ?? `${streak} day streak`;

  const flameStyle = {
    "--flame-glow": style.glow,
    "--flame-speed": style.speed,
  } as CSSProperties;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: px, height: px }}
      role="img"
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {style.hasRing ? (
        <span
          className="flame-ring absolute inset-[-40%] rounded-full opacity-70"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${style.glow}, transparent 60%)`,
          }}
          aria-hidden
        />
      ) : null}

      {style.hasSparks ? (
        <>
          <span
            className="flame-spark absolute bottom-[18%] left-[32%] h-[3px] w-[3px] rounded-full"
            style={{ background: style.core, animationDelay: "0s" }}
            aria-hidden
          />
          <span
            className="flame-spark absolute bottom-[22%] left-[58%] h-[2px] w-[2px] rounded-full"
            style={{ background: style.core, animationDelay: "0.5s" }}
            aria-hidden
          />
          <span
            className="flame-spark absolute bottom-[10%] left-[46%] h-[2px] w-[2px] rounded-full"
            style={{ background: style.outer, animationDelay: "1s" }}
            aria-hidden
          />
        </>
      ) : null}

      <svg
        viewBox="0 0 24 24"
        width={px}
        height={px}
        className={`relative ${
          isActive
            ? style.hasGlow
              ? "flame-flicker-glow"
              : "flame-flicker"
            : ""
        }`}
        style={flameStyle}
        aria-hidden
      >
        {isActive ? (
          <>
            <path d={OUTER_FLAME_PATH} fill={style.outer} />
            <path d={CORE_FLAME_PATH} fill={style.core} />
          </>
        ) : (
          <path
            d={OUTER_FLAME_PATH}
            fill="none"
            stroke={style.outer}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  );
}
