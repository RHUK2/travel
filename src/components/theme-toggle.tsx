"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden h-4 w-4 fill-yellow-400 stroke-yellow-400 dark:block" />
      <Moon className="block h-4 w-4 fill-slate-700 stroke-slate-700 dark:hidden" />
    </Button>
  );
}
