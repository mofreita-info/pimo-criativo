import { createContext } from "react";
import type { ThemeId } from "./themes";

interface ThemeContextProps {
  theme: ThemeId;
  setTheme: (_t: ThemeId) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
