import type { MaterialCategory } from "../core/materials/materialPresets";
import { getPresetById } from "../core/materials/materialPresets";

export type ModelPart = "wood" | "metal" | "glass" | "panel" | "door" | "drawer";

export type MaterialCategoryConfig = {
  presetId: string;
  roughness: number;
  metalness: number;
  envMapIntensity: number;
  color: string;
};

export type MaterialSystemState = {
  categories: Record<MaterialCategory, MaterialCategoryConfig>;
  assignments: Record<ModelPart, MaterialCategory>;
};

export const MATERIAL_STORAGE_KEY = "pimo_material_system_v1";

export const defaultMaterialState: MaterialSystemState = {
  categories: {
    wood: {
      presetId: "wood_oak",
      roughness: 0.55,
      metalness: 0.05,
      envMapIntensity: 0.9,
      color: "#c9a27a",
    },
    metal: {
      presetId: "metal_steel",
      roughness: 0.2,
      metalness: 0.9,
      envMapIntensity: 1.2,
      color: "#cbd5f5",
    },
    glass: {
      presetId: "glass_clear",
      roughness: 0.05,
      metalness: 0.0,
      envMapIntensity: 1.2,
      color: "#e2e8f0",
    },
    plastic: {
      presetId: "plastic_matte",
      roughness: 0.7,
      metalness: 0.0,
      envMapIntensity: 0.4,
      color: "#e5e7eb",
    },
    marble: {
      presetId: "marble_white",
      roughness: 0.3,
      metalness: 0.0,
      envMapIntensity: 0.9,
      color: "#f8fafc",
    },
    stone: {
      presetId: "stone_granite",
      roughness: 0.75,
      metalness: 0.0,
      envMapIntensity: 0.4,
      color: "#9ca3af",
    },
  },
  assignments: {
    wood: "wood",
    metal: "metal",
    glass: "glass",
    panel: "wood",
    door: "wood",
    drawer: "wood",
  },
};

export const normalizeMaterialState = (value: unknown): MaterialSystemState => {
  if (!value || typeof value !== "object") return defaultMaterialState;
  const partial = value as Partial<MaterialSystemState>;
  const categories = { ...defaultMaterialState.categories };
  if (partial.categories) {
    (Object.keys(categories) as MaterialCategory[]).forEach((category) => {
      const incoming = partial.categories?.[category];
      if (!incoming) return;
      const preset = getPresetById(incoming.presetId);
      categories[category] = {
        presetId: preset?.id ?? categories[category].presetId,
        roughness: Number.isFinite(incoming.roughness)
          ? Number(incoming.roughness)
          : categories[category].roughness,
        metalness: Number.isFinite(incoming.metalness)
          ? Number(incoming.metalness)
          : categories[category].metalness,
        envMapIntensity: Number.isFinite(incoming.envMapIntensity)
          ? Number(incoming.envMapIntensity)
          : categories[category].envMapIntensity,
        color: typeof incoming.color === "string" ? incoming.color : categories[category].color,
      };
    });
  }
  const assignments = { ...defaultMaterialState.assignments, ...(partial.assignments ?? {}) };
  return { categories, assignments };
};

export const materialCategoryOptions: { id: MaterialCategory; label: string }[] = [
  { id: "wood", label: "Madeira" },
  { id: "metal", label: "Metal" },
  { id: "glass", label: "Vidro" },
  { id: "plastic", label: "Plástico" },
  { id: "marble", label: "Mármore" },
  { id: "stone", label: "Pedra" },
];

export const modelPartOptions: { id: ModelPart; label: string }[] = [
  { id: "wood", label: "Superfícies de madeira" },
  { id: "metal", label: "Superfícies metálicas" },
  { id: "glass", label: "Vidro" },
  { id: "panel", label: "Painéis" },
  { id: "door", label: "Portas" },
  { id: "drawer", label: "Gavetas" },
];
