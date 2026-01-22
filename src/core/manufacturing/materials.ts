export type MaterialIndustrial = {
  nome: string;
  espessuraPadrao: number;
  custo_m2: number;
  cor?: string;
};

export const MATERIAIS_INDUSTRIAIS: MaterialIndustrial[] = [
  { nome: "MDF Branco", espessuraPadrao: 19, custo_m2: 35 },
  { nome: "Carvalho", espessuraPadrao: 20, custo_m2: 45 },
  { nome: "Lacado", espessuraPadrao: 20, custo_m2: 90 },
  { nome: "Contraplacado", espessuraPadrao: 19, custo_m2: 68 },
  { nome: "Melamina", espessuraPadrao: 19, custo_m2: 22 },
];

export const getMaterial = (nome?: string): MaterialIndustrial => {
  if (nome) {
    const found = MATERIAIS_INDUSTRIAIS.find((material) => material.nome === nome);
    if (found) return found;
  }
  return MATERIAIS_INDUSTRIAIS[0];
};
