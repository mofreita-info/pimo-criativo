import type { Acessorio } from "../types";

const PRECO_FERRAGENS: Record<string, number> = {
  parafuso: 0.15,
  dobradica: 1.8,
  corrediça: 8.5,
  suporte: 0,
  trilho: 12.0,
};

const FERRAGENS_BASE: Acessorio[] = [
  { id: "parafuso-4x50", nome: "Parafuso 4×50", tipo: "parafuso", quantidade: 0, precoUnitario: PRECO_FERRAGENS.parafuso },
  { id: "dobradica-35mm", nome: "Dobradiça 35mm", tipo: "dobradica", quantidade: 0, precoUnitario: PRECO_FERRAGENS.dobradica },
  { id: "corredica-350mm", nome: "Corrediça 350mm", tipo: "corrediça", quantidade: 0, precoUnitario: PRECO_FERRAGENS.corrediça },
  { id: "suporte-prateleira", nome: "Suporte Prateleira", tipo: "suporte", quantidade: 0, precoUnitario: PRECO_FERRAGENS.suporte },
  { id: "trilho-superior", nome: "Trilho Superior", tipo: "trilho", quantidade: 0, precoUnitario: PRECO_FERRAGENS.trilho },
  { id: "trilho-inferior", nome: "Trilho Inferior", tipo: "trilho", quantidade: 0, precoUnitario: PRECO_FERRAGENS.trilho },
];

export function buildFerragens(
  prateleiras: number,
  portaTipo: "sem_porta" | "porta_simples" | "porta_dupla" | "porta_correr",
  gavetas: number
): Acessorio[] {
  return FERRAGENS_BASE.map((item) => {
    if (item.tipo === "suporte") {
      return { ...item, quantidade: prateleiras * 4 };
    }
    if (item.tipo === "dobradica") {
      const qtd = portaTipo === "porta_simples" ? 2 : portaTipo === "porta_dupla" ? 4 : 0;
      return { ...item, quantidade: qtd };
    }
    if (item.tipo === "corrediça") {
      return { ...item, quantidade: gavetas };
    }
    if (item.tipo === "trilho") {
      const qtd = portaTipo === "porta_correr" ? 1 : 0;
      return { ...item, quantidade: qtd };
    }
    return item;
  });
}
