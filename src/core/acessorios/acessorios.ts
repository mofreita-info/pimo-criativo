import type { Acessorio, AcessorioComPreco, Dimensoes, Material } from "../types";

/**
 * Gera acessórios básicos para qualquer projeto
 */
export function gerarAcessorios(
  _tipoProjeto: string,
  _material: Material,
  _dimensoes: Dimensoes,
  quantidade: number
): Acessorio[] {
  const base = [
    { id: "parafusos", nome: "Parafusos", quantidade: 20, precoUnitario: 0.05 },
    { id: "dobradiças", nome: "Dobradiças", quantidade: 4, precoUnitario: 1.2 },
  ];

  return base.map((acc) => ({
    ...acc,
    quantidade: acc.quantidade * quantidade,
    precoTotal: Number((acc.quantidade * acc.precoUnitario).toFixed(2)),
  }));
}

/**
 * Calcula preços dos acessórios
 */
export function calcularPrecosAcessorios(acessorios: Acessorio[]): AcessorioComPreco[] {
  return acessorios.map((acc) => ({
    ...acc,
    precoTotal: Number((acc.quantidade * acc.precoUnitario).toFixed(2)),
  }));
}