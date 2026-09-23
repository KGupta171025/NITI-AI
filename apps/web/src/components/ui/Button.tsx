import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef } from "react";

// ─── Variants ────────────────────────────────────────────────────────────────
const variants = {
  primary:
    "bg-brand-500 hover:bg-brand-400 text-white shadow-glow-sm hover:shadow-glow-md hover:scale-[1.01] active:scale-[0.99]",
  secondary:
    "bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700/80 hover:border-slate-500 hover:shadow-glass hover:scale-[1.01] active:scale-[0.99]",
  ghost:
    "text-slate-300 hover:text-white hover:bg-white/10 hover:shadow-sm",
  danger:
    "bg-red-600 hover:bg-red-500 text-white hover:shadow-md",
  outline:
    "border border-brand-500/50 text-brand-400 hover:bg-brand-500/15 hover:border-brand-400 hover:shadow-glow-sm",
  glass:
    "glass-card text-slate-100 hover:border-brand-500/40 hover:bg-white/[0.12] hover:shadow-glow-sm hover:scale-[1.01] active:scale-[0.99]",
};

const sizes = {
  xs:  "h-7  px-2.5 text-xs  rounded-lg  gap-1",
  sm:  "h-9  px-3   text-sm  rounded-xl  gap-1.5",
  md:  "h-11 px-5   text-sm  rounded-xl  gap-2",
  lg:  "h-12 px-7   text-base rounded-xl gap-2",
  xl:  "h-14 px-9   text-lg  rounded-2xl gap-2.5",
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled ?? loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "select-none relative",
          // Variant
          variants[variant],
          // Size
          sizes[size],
          // Width
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
