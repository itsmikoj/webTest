"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useThemeSafe() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme: mounted ? theme : "system",
    setTheme: mounted ? setTheme : () => {},
    resolvedTheme: mounted ? resolvedTheme : "system",
    systemTheme: mounted ? systemTheme : "light",
    isMounted: mounted,
  };
}
