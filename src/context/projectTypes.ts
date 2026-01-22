import type {
  AcessorioComPreco,
  BoxModule,
  ChangelogEntry,
  CutListItem,
  CutListItemComPreco,
  Design,
  Dimensoes,
  Estrutura3D,
  Material,
  ResultadosCalculo,
  WorkspaceBox,
} from "../core/types";

export interface ProjectState {
  projectName: string;
  tipoProjeto: string;
  material: Material;
  dimensoes: Dimensoes;
  quantidade: number;
  boxes: BoxModule[];
  selectedBoxId: string;
  workspaceBoxes: WorkspaceBox[];
  selectedWorkspaceBoxId: string;
  selectedCaixaId: string;
  selectedCaixaModelUrl: string | null;

  resultados: ResultadosCalculo | null;
  ultimaAtualizacao: Date | null;

  design: Design | null;
  cutList: CutListItem[] | null;
  cutListComPreco: CutListItemComPreco[] | null;
  estrutura3D: Estrutura3D | null;
  acessorios: AcessorioComPreco[] | null;

  precoTotalPecas: number | null;
  precoTotalAcessorios: number | null;
  precoTotalProjeto: number | null;

  estaCarregando: boolean;
  erro: string | null;
  changelog: ChangelogEntry[];
}

export interface ProjectActions {
  setProjectName: (name: string) => void;
  setTipoProjeto: (tipo: string) => void;
  setMaterial: (material: Material) => void;
  setEspessura: (espessura: number) => void;
  setDimensoes: (dimensoes: Partial<Dimensoes>) => void;
  setQuantidade: (quantidade: number) => void;
  addBox: () => void;
  addWorkspaceBox: () => void;
  duplicateBox: () => void;
  duplicateWorkspaceBox: () => void;
  removeBox: () => void;
  removeWorkspaceBox: () => void;
  selectBox: (boxId: string) => void;
  updateCaixaModelId: (caixaId: string, modelId: string | null) => void;
  renameBox: (nome: string) => void;
  setPrateleiras: (quantidade: number) => void;
  setPortaTipo: (portaTipo: BoxModule["portaTipo"]) => void;
  updateWorkspacePosition: (boxId: string, posicaoX_mm: number) => void;
  updateWorkspaceBoxPosition: (boxId: string, posicaoX_mm: number) => void;
  toggleWorkspaceRotation: (boxId: string) => void;
  rotateWorkspaceBox: (boxId: string) => void;
  gerarDesign: () => void;
  exportarPDF: () => void;
  logChangelog: (message: string) => void;
}

export interface ProjectContextProps {
  project: ProjectState;
  actions: ProjectActions;
}
