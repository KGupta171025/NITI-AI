import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  as?: "div" | "article" | "section" | "li";
}

export function Card({
  children,
  className,
  glass = false,
  hover = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border",
        glass
          ? "glass-card"
          : "bg-slate-900/80 border-slate-800/60",
        hover &&
          "cursor-pointer hover:border-slate-600 transition-all duration-200 hover:shadow-glass",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-5 pb-0", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-5", className)}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-5 pt-0 flex items-center gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
