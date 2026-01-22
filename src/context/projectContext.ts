import { createContext } from "react";
import type { ProjectContextProps } from "./projectTypes";

export const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);
