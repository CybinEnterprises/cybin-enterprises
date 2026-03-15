import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/shared/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolved, setTheme } = useTheme();

  const toggle = () => {
    setTheme(resolved === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      {resolved === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}

export default ThemeToggle;
