export const THEMES = [
  { id: "dark", label: "Escuro", mode: "dark" },
  { id: "light", label: "Claro", mode: "light" },
  { id: "terminal", label: "Terminal", mode: "dark" },
  { id: "blueprint", label: "Plantilha", mode: "dark" },
  { id: "neon", label: "Néon", mode: "dark" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export type ThemeMode = (typeof THEMES)[number]["mode"];

export const DEFAULT_THEME_ID: ThemeId = "dark";
export const HEADER_THEME_IDS: ThemeId[] = ["dark", "blueprint", "neon"];
