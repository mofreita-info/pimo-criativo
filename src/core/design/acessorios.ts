import type { Acessorio, AcessorioComPreco, Dimensoes, Material } from "../types";

/**
 * Base de dados de preços de acessórios
 */
const PRECOS_ACESSORIOS: Record<string, number> = {
  "Parafuso 4×50": 0.15,
  "Parafuso 5×60": 0.20,
  "Cantoneira": 2.50,
  "Dobradiça 35mm": 1.80,
  "Dobradiça 40mm": 2.20,
  "Corrediça 350mm": 8.50,
  "Corrediça 400mm": 10.00,
  "Maçaneta Simples": 3.50,
  "Maçaneta Premium": 12.00,
  "Puxador Gaveta": 2.00,
  "Trinco Magnético": 1.20,
};

/**
 * Gera lista de acessórios necessários baseado no tipo de projeto
 */
export function gerarAcessorios(
  tipoProjeto: string,
  _material: Material,
  _dimensoes: Dimensoes,
  quantidade: number
): Acessorio[] {
  const acessorios: Acessorio[] = [];

  if (tipoProjeto.includes("Estante de Parede")) {
    const numPortas = tipoProjeto.includes("3 Portas") ? 3 : 2;

    // Parafusos para montagem
    // Baseado em: 4 cantoneiras × 4 parafusos + fixações laterais e traseiras
    const parafusosNecessarios = (4 * 4 + 20) * quantidade; // 4 cantoneiras + fixações
    acessorios.push({
      id: "parafuso-4x50",
      nome: "Parafuso 4×50",
      tipo: "parafuso",
      quantidade: parafusosNecessarios,
      precoUnitario: PRECOS_ACESSORIOS["Parafuso 4×50"],
      descricao: "Para fixação de estruturas",
    });

    // Cantoneiras para reforço
    const cantoneiras = 4 * quantidade; // 4 cantoneiras por unidade
    acessorios.push({
      id: "cantoneira",
      nome: "Cantoneira",
      tipo: "cantoneira",
      quantidade: cantoneiras,
      precoUnitario: PRECOS_ACESSORIOS["Cantoneira"],
      descricao: "Reforço de cantos",
    });

    // Dobradiças para portas
    const dobradicasPorPorta = 2; // 2 dobradiças por porta
    const dobradicas = numPortas * dobradicasPorPorta * quantidade;
    acessorios.push({
      id: "dobradica-35mm",
      nome: "Dobradiça 35mm",
      tipo: "dobradica",
      quantidade: dobradicas,
      precoUnitario: PRECOS_ACESSORIOS["Dobradiça 35mm"],
      descricao: "Para portas",
    });

    // Maçanetas para portas
    const macanetas = numPortas * quantidade;
    acessorios.push({
      id: "macaneta-simples",
      nome: "Maçaneta Simples",
      tipo: "maçaneta",
      quantidade: macanetas,
      precoUnitario: PRECOS_ACESSORIOS["Maçaneta Simples"],
      descricao: "Para abertura de portas",
    });
  } else {
    // Projeto genérico - itens básicos
    const parafusosNecessarios = 16 * quantidade;
    acessorios.push({
      id: "parafuso-4x50",
      nome: "Parafuso 4×50",
      tipo: "parafuso",
      quantidade: parafusosNecessarios,
      precoUnitario: PRECOS_ACESSORIOS["Parafuso 4×50"],
      descricao: "Para fixação de estruturas",
    });

    const cantoneiras = 4 * quantidade;
    acessorios.push({
      id: "cantoneira",
      nome: "Cantoneira",
      tipo: "cantoneira",
      quantidade: cantoneiras,
      precoUnitario: PRECOS_ACESSORIOS["Cantoneira"],
      descricao: "Reforço de cantos",
    });
  }

  return acessorios;
}

/**
 * Calcula o preço total de uma lista de acessórios
 */
export function calcularPrecoTotalAcessorios(acessorios: Acessorio[]): number {
  return acessorios.reduce(
    (total, acessorio) => total + acessorio.precoUnitario * acessorio.quantidade,
    0
  );
}

/**
 * Adiciona preço total a cada acessório
 */
export function calcularPrecosAcessorios(acessorios: Acessorio[]): AcessorioComPreco[] {
  return acessorios.map((acessorio) => ({
    ...acessorio,
    precoTotal: Number((acessorio.precoUnitario * acessorio.quantidade).toFixed(2)),
  }));
}
