import Link from "next/link";
import { BrandMark } from "@/presentation/components/brand/brand-mark";
import { BrandWordmark } from "@/presentation/components/brand/brand-wordmark";
import { BRAND } from "@/presentation/config/brand";

type BrandLogoVariant = "mark" | "full";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  href?: string | null;
  className?: string;
  onClick?: () => void;
  /** Accessible label; defaults to brand name */
  label?: string;
};

const MARK_SIZE_CLASS = "h-8 w-8";

export function BrandLogo({
  variant = "mark",
  href = "/",
  className = "",
  onClick,
  label = BRAND.name,
}: BrandLogoProps) {
  const content =
    variant === "full" ? (
      <BrandWordmark className={className} markClassName={MARK_SIZE_CLASS} />
    ) : (
      <BrandMark className={`${MARK_SIZE_CLASS} shrink-0 ${className}`} />
    );

  if (href === null) {
    return (
      <span role="img" aria-label={label}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-2 rounded-sm p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={label}
    >
      {content}
    </Link>
  );
}
