import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "glass" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2.5 rounded-full font-medium tracking-[-0.01em] transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-[54px] px-7 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[#f3f5ff] text-[#070912] shadow-[0_12px_50px_-16px_rgba(255,255,255,0.65)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_70px_-16px_rgba(167,139,250,0.85)] active:translate-y-0 active:scale-[0.99]",
  glass:
    "glass text-white/90 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white active:translate-y-0 active:scale-[0.99]",
  outline:
    "border border-white/15 text-white/85 hover:border-white/35 hover:bg-white/[0.05] hover:text-white active:scale-[0.99]",
  ghost: "text-white/60 hover:bg-white/[0.05] hover:text-white",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ActionButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ActionLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
