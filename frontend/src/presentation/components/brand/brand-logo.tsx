import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/presentation/config/brand";

type BrandLogoVariant = "mark" | "full";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  href?: string | null;
  className?: string;
  priority?: boolean;
  /** Accessible label; defaults to brand name */
  label?: string;
};

const sizes: Record<
  BrandLogoVariant,
  { width: number; height: number; className: string; src: string }
> = {
  mark: {
    width: 192,
    height: 192,
    className: "h-8 w-8",
    src: BRAND.logoMarkUiSrc,
  },
  full: {
    width: 480,
    height: 160,
    className: "h-14 w-auto max-w-[240px]",
    src: BRAND.logoFullSrc,
  },
};

export function BrandLogo({
  variant = "mark",
  href = "/",
  className = "",
  priority = false,
  label = BRAND.name,
}: BrandLogoProps) {
  const size = sizes[variant];

  const image = (
    <Image
      src={size.src}
      alt={label}
      width={size.width}
      height={size.height}
      priority={priority}
      className={`${size.className} object-contain ${className}`}
    />
  );

  if (href === null) {
    return image;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label={label}
    >
      {image}
    </Link>
  );
}
