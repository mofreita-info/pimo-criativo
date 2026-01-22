import { createContext } from "react";
import type { ThemeId } from "./themes";

interface ThemeContextProps {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
