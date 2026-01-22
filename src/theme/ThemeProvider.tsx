import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_THEME_ID } from "./themes";
import type { ThemeId } from "./themes";

interface ThemeContextProps {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME_ID);
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}
