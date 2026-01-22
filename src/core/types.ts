export interface Material {
  tipo: string;
  espessura: number;
  precoPorM2: number;
}

export interface Dimensoes {
  largura: number;
  altura: number;
  profundidade: number;
}

export interface CutListItem {
  id: string;
  nome: string;
  quantidade: number;
  dimensoes: {
    largura: number;
    altura: number;
    profundidade: number;
  };
  espessura: number;
  material: string;
  tipo: string;
}

export interface CutListItemComPreco extends CutListItem {
  precoUnitario: number;
  precoTotal: number;
  espessura: number;
}

export interface Peca {
  id: string;
  nome: string;
  tipo: string;
  dimensoes: {
    largura: number;
    altura: number;
    profundidade: number;
  };
  posicao: {
    x: number;
    y: number;
    z: number;
  };
  rotacao?: {
    x: number;
    y: number;
    z: number;
  };
  cor?: string;
}

export interface Estrutura3D {
  pecas: Peca[];
  dimensoesTotais: {
    largura: number;
    altura: number;
    profundidade: number;
  };
  centro: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Acessorio {
  id: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  tipo?: string;
  descricao?: string;
}

export interface AcessorioComPreco extends Acessorio {
  precoTotal: number;
}

export interface Design {
  cutList: CutListItem[];
  estrutura3D: Estrutura3D;
  acessorios: Acessorio[];
  timestamp: Date;
}

export interface BoxConfig {
  id: string;
  nome: string;
  dimensoes: Dimensoes;
}

export interface BoxDesign {
  boxId: string;
  cutList: CutListItem[];
  cutListComPreco: CutListItemComPreco[];
  estrutura3D: Estrutura3D;
  precoTotalPecas: number;
}

export interface BoxModule {
  id: string;
  nome: string;
  dimensoes: Dimensoes;
  espessura: number;
  material?: string;
  modelId: string | null;
  prateleiras: number;
  portaTipo: "sem_porta" | "porta_simples" | "porta_dupla" | "porta_correr";
  gavetas: number;
  alturaGaveta: number;
  ferragens: Acessorio[];
  cutList: CutListItem[];
  cutListComPreco: CutListItemComPreco[];
  estrutura3D: Estrutura3D;
  precoTotalPecas: number;
}

export interface WorkspaceBox {
  id: string;
  nome: string;
  dimensoes: Dimensoes;
  espessura: number;
  modelId: string | null;
  prateleiras: number;
  portaTipo: "sem_porta" | "porta_simples" | "porta_dupla" | "porta_correr";
  gavetas: number;
  alturaGaveta: number;
  posicaoX_mm: number;
  posicaoY_mm: number;
  rotacaoY_90: boolean;
}

export interface ProjetoConfig {
  tipo: string;
  material: Material;
  dimensoes: Dimensoes;
  quantidade: number;
}

export interface ResultadosCalculo {
  numeroPecas: number;
  numeroPaineis: number;
  areaTotal: number;
  desperdicio: number;
  desperdicioPercentual: number;
  precoMaterial: number;
  precoFinal: number;
}

export interface ChangelogEntry {
  id: string;
  timestamp: Date;
  type: "box" | "calc" | "doc";
  message: string;
}