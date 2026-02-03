import type { WoodMaterialOptions } from "./WoodMaterial";

export type MaterialPreset = {
  name: string;
  options?: WoodMaterialOptions;
};

export type MaterialSet = Record<string, MaterialPreset>;

/** IDs dos materiais (cor sólida, sem texturas). */
export const MATERIAIS_PBR_IDS = [
  "carvalho_natural",
  "carvalho_escuro",
  "nogueira",
  "mdf_branco",
  "mdf_cinza",
  "mdf_preto",
] as const;

export type MaterialPbrId = (typeof MATERIAIS_PBR_IDS)[number];

export const MATERIAIS_PBR_LABELS: Record<MaterialPbrId, string> = {
  carvalho_natural: "Carvalho Natural",
  carvalho_escuro: "Carvalho Escuro",
  nogueira: "Nogueira",
  mdf_branco: "MDF Branco",
  mdf_cinza: "MDF Cinza",
  mdf_preto: "MDF Preto",
};

export function resolveMaterialId(nome: string): MaterialPbrId {
  const lower = nome.toLowerCase().trim();
  const map: Record<string, MaterialPbrId> = {
    "carvalho natural": "carvalho_natural",
    "carvalho_natural": "carvalho_natural",
    carvalho: "carvalho_natural",
    "carvalho escuro": "carvalho_escuro",
    "carvalho_escuro": "carvalho_escuro",
    nogueira: "nogueira",
    "mdf branco": "mdf_branco",
    "mdf_branco": "mdf_branco",
    mdf: "mdf_branco",
    "mdf cinza": "mdf_cinza",
    "mdf_cinza": "mdf_cinza",
    "mdf preto": "mdf_preto",
    "mdf_preto": "mdf_preto",
    preto: "mdf_preto",
  };
  return (map[lower] as MaterialPbrId) ?? "mdf_branco";
}

/** Materiais sólidos (cor, roughness, metalness, envMapIntensity). Sem texturas. */
export const defaultMaterialSet: MaterialSet = {
  carvalho_natural: {
    name: "carvalho_natural",
    options: {
      color: "#c9a27a",
      metalness: 0,
      roughness: 0.52,
      envMapIntensity: 0.42,
    },
  },
  carvalho_escuro: {
    name: "carvalho_escuro",
    options: {
      color: "#5c3d2e",
      metalness: 0,
      roughness: 0.58,
      envMapIntensity: 0.38,
    },
  },
  nogueira: {
    name: "nogueira",
    options: {
      color: "#8a5a2b",
      metalness: 0,
      roughness: 0.55,
      envMapIntensity: 0.4,
    },
  },
  mdf_branco: {
    name: "mdf_branco",
    options: {
      color: "#f2f0eb",
      metalness: 0,
      roughness: 0.52,
      envMapIntensity: 0.4,
    },
  },
  mdf_cinza: {
    name: "mdf_cinza",
    options: {
      color: "#9ca3af",
      metalness: 0,
      roughness: 0.55,
      envMapIntensity: 0.38,
    },
  },
  mdf_preto: {
    name: "mdf_preto",
    options: {
      color: "#1f2937",
      metalness: 0,
      roughness: 0.58,
      envMapIntensity: 0.35,
    },
  },
};

export function getMaterialPreset(materialSet: MaterialSet, idOrName: string): MaterialPreset | null {
  const resolved = resolveMaterialId(idOrName);
  return materialSet[resolved] ?? materialSet.mdf_branco ?? null;
}

export const mergeMaterialSet = (base: MaterialSet, incoming?: MaterialSet) => {
  if (!incoming) return base;
  return { ...base, ...incoming };
};
