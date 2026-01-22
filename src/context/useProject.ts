import { useContext } from "react";
import { ProjectContext } from "./projectContext";

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject deve ser usado dentro de um ProjectProvider");
  }
  return context;
}
