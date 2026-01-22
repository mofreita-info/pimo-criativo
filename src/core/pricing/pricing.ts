import type { CutListItem, CutListItemComPreco } from "../types";

// Interface para preço de material
interface PrecoMaterial {
  material: string;
  espessura: number;
  precoPorM2: number; // euros por m²
}

// Base de dados de preços por material e espessura
const PRECOS_MATERIAIS: PrecoMaterial[] = [
  // MDF
  { material: "MDF", espessura: 12, precoPorM2: 18.0 },
  { material: "MDF", espessura: 16, precoPorM2: 22.0 },
  { material: "MDF", espessura: 18, precoPorM2: 25.0 },
  { material: "MDF", espessura: 19, precoPorM2: 26.0 },
  { material: "MDF", espessura: 25, precoPorM2: 32.0 },
  
  // Plywood
  { material: "Plywood", espessura: 12, precoPorM2: 24.0 },
  { material: "Plywood", espessura: 16, precoPorM2: 28.0 },
  { material: "Plywood", espessura: 18, precoPorM2: 32.0 },
  { material: "Plywood", espessura: 25, precoPorM2: 42.0 },
  
  // Pinho
  { material: "Pinho", espessura: 16, precoPorM2: 30.0 },
  { material: "Pinho", espessura: 18, precoPorM2: 35.0 },
  { material: "Pinho", espessura: 25, precoPorM2: 48.0 },
  
  // Carvalho
  { material: "Carvalho", espessura: 18, precoPorM2: 65.0 },
  { material: "Carvalho", espessura: 25, precoPorM2: 85.0 },
];

/**
 * Obtém o preço por m² de um material e espessura específicos
 */
export function getPrecoPorMaterial(material: string, espessura: number): number {
  const preco = PRECOS_MATERIAIS.find(
    (p) => p.material === material && p.espessura === espessura
  );

  if (preco) {
    return preco.precoPorM2;
  }

  // Se não encontrar, retorna um preço padrão baseado no material
  const precoPadrao = PRECOS_MATERIAIS.find((p) => p.material === material);
  if (precoPadrao) {
    // Ajusta o preço proporcionalmente à espessura
    const fatorEspessura = espessura / precoPadrao.espessura;
    return precoPadrao.precoPorM2 * fatorEspessura;
  }

  // Preço padrão se material não encontrado
  return 25.0;
}

/**
 * Calcula o preço de uma peça individual baseado nas suas dimensões e material
 */
export function calcularPrecoPeca(
  largura: number, // mm
  altura: number, // mm
  espessura: number, // mm
  material: string
): number {
  // Converter mm para metros
  const larguraM = largura / 1000;
  const alturaM = altura / 1000;
  
  // Área em m²
  const areaM2 = larguraM * alturaM;
  
  // Preço por m²
  const precoPorM2 = getPrecoPorMaterial(material, espessura);
  
  // Preço da peça
  return areaM2 * precoPorM2;
}

/**
 * Calcula preços para toda a cut list
 */
export function calcularPrecoCutList(
  cutList: CutListItem[]
): CutListItemComPreco[] {
  return cutList.map((item) => {
    const precoUnitario = calcularPrecoPeca(
      item.dimensoes.largura,
      item.dimensoes.altura,
      item.espessura,
      item.material
    );

    const precoTotal = precoUnitario * item.quantidade;

    return {
      ...item,
      precoUnitario: Number(precoUnitario.toFixed(2)),
      precoTotal: Number(precoTotal.toFixed(2)),
      espessura: item.espessura,
    };
  });
}

/**
 * Calcula o preço total de todas as peças
 */
export function calcularPrecoTotalPecas(cutListComPreco: CutListItemComPreco[]): number {
  return cutListComPreco.reduce((total, item) => total + item.precoTotal, 0);
}

/**
 * Calcula o preço total do projeto (peças + margem de segurança)
 */
export function calcularPrecoTotalProjeto(
  precoPecas: number,
  margemSeguranca: number = 0.1 // 10% padrão
): number {
  return precoPecas * (1 + margemSeguranca);
}
