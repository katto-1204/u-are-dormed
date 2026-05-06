import logo from "@/assets/uad-logo.png";
import { cn } from "@/lib/utils";

export const Logo = ({ className, size = 36 }: { className?: string; size?: number }) => (
  <img
    src={logo}
    alt="U Are Dormed"
    width={size}
    height={size}
    loading="lazy"
    className={cn("object-contain", className)}
    style={{ width: size, height: size }}
  />
);
