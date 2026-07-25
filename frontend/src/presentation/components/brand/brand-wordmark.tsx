import { BrandMark } from "@/presentation/components/brand/brand-mark";
import { BRAND } from "@/presentation/config/brand";

type BrandWordmarkProps = {
  className?: string;
  markClassName?: string;
};

/** Icon + name lockup — replaces the old raster "logo-with-title.png". */
export function BrandWordmark({
  className = "",
  markClassName = "h-8 w-8",
}: BrandWordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <BrandMark className={`shrink-0 ${markClassName}`} />
      <span className="truncate text-lg font-semibold tracking-tight text-foreground">
        {BRAND.name}
      </span>
    </span>
  );
}
