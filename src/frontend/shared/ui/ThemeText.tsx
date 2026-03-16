import { forwardRef, ElementType } from "react";
import { cn } from "@/lib/utils";

interface ThemeTextProps {
  as?: ElementType;
  variant?: "default" | "display" | "muted";
  className?: string;
  children: React.ReactNode;
}

export const ThemeText = forwardRef<HTMLElement, ThemeTextProps>(
  ({ as: Component = "span", variant = "default", className, children }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          variant === "display" && "text-4xl md:text-5xl font-bold",
          variant === "muted" && "text-muted-foreground",
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

ThemeText.displayName = "ThemeText";