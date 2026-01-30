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
  TipoBorda,
  TipoFundo,
  WorkspaceBox,
} from "../core/types";
import type { RuleViolation } from "../core/rules/types";
import type { LayoutWarnings } from "../core/layout/layoutWarnings";

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
  /** URL do modelo CAD selecionado (para preview). */
  selectedCaixaModelUrl: string | null;
  /** ID da instância do modelo selecionada na caixa (para edição). */
  selectedModelInstanceId: string | null;

  resultados: ResultadosCalculo | null;
  ultimaAtualizacao: Date | null;

  design: Design | null;
  cutList: CutListItem[] | null;
  cutListComPreco: CutListItemComPreco[] | null;
  /** Peças extraídas por caixa e por modelo: boxId → modelInstanceId → itens com preço. */
  extractedPartsByBoxId: Record<string, Record<string, CutListItemComPreco[]>>;
  /** Violações de regras dinâmicas por modelo (dimensão, material, compatibilidade). */
  ruleViolations: RuleViolation[];
  /** Posições dos modelos em espaço local da caixa (m): boxId → modelInstanceId → { x, y, z }. */
  modelPositionsByBoxId: Record<string, Record<string, { x: number; y: number; z: number }>>;
  /** Colisões e modelos fora dos limites da caixa. */
  layoutWarnings: LayoutWarnings;
  estrutura3D: Estrutura3D | null;
  acessorios: AcessorioComPreco[] | null;

  precoTotalPecas: number | null;
  precoTotalAcessorios: number | null;
  precoTotalProjeto: number | null;

  estaCarregando: boolean;
  erro: string | null;
  changelog: ChangelogEntry[];
}

export type SavedProjectInfo = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ViewerSnapshot = {
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    zoom: number;
    type: "perspective" | "orthographic" | "unknown";
  };
  objects: {
    id: string;
    name?: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }[];
  materials: {
    id: string;
    name?: string;
    preset: string;
    color?: string;
    roughness?: number;
    metalness?: number;
    envMapIntensity?: number;
    opacity?: number;
    transparent?: boolean;
  }[];
  scene: {
    hasFloor: boolean;
    hasGrid: boolean;
    environment: boolean;
    lights: {
      id: string;
      type: string;
      position: [number, number, number];
      intensity: number;
      color?: string;
    }[];
  };
};

export type Viewer2DAngle = "top" | "front" | "left" | "right";

export type ViewerRenderQuality = "low" | "medium" | "high";

export type ViewerRenderBackground = "white" | "transparent";

export type ViewerRenderOptions = {
  quality: ViewerRenderQuality;
  background: ViewerRenderBackground;
};

export type ViewerRenderResult = {
  dataUrl: string;
  width: number;
  height: number;
};

export type ViewerApi = {
  saveSnapshot: () => ViewerSnapshot | null;
  restoreSnapshot: (_snapshot: ViewerSnapshot | null) => void;
  enable2DView: (_angle: Viewer2DAngle) => void;
  disable2DView: () => void;
  renderScene: (_options: ViewerRenderOptions) => ViewerRenderResult | null;
};

export type ProjectSnapshot = {
  projectState: unknown;
  viewerSnapshot: ViewerSnapshot | null;
};

export type ViewerSync = {
  notifyChangeSignal: unknown;
  applyStateToViewer: () => void;
  extractStateFromViewer: () => void;
  saveViewerSnapshot: () => ViewerSnapshot | null;
  restoreViewerSnapshot: (_snapshot: ViewerSnapshot | null) => void;
  registerViewerApi: (_api: ViewerApi | null) => void;
  enable2DView: (_angle: Viewer2DAngle) => void;
  disable2DView: () => void;
  renderScene: (_options: ViewerRenderOptions) => ViewerRenderResult | null;
};

export interface ProjectActions {
  setProjectName: (_name: string) => void;
  setTipoProjeto: (_tipo: string) => void;
  setMaterial: (_material: Material) => void;
  setEspessura: (_espessura: number) => void;
  setDimensoes: (_dimensoes: Partial<Dimensoes>) => void;
  setQuantidade: (_quantidade: number) => void;
  addBox: () => void;
  addWorkspaceBox: () => void;
  duplicateBox: () => void;
  duplicateWorkspaceBox: () => void;
  removeBox: () => void;
  removeWorkspaceBox: () => void;
  removeWorkspaceBoxById: (_boxId: string) => void;
  selectBox: (_boxId: string) => void;
  /** Adiciona um modelo CAD (por id do catálogo) à caixa. */
  addModelToBox: (_caixaId: string, _cadModelId: string) => void;
  /** Cria uma nova caixa no workspace com o modelo CAD (modelo = Box completo). */
  addCadModelAsNewBox: (_cadModelId: string) => void;
  /** Remove uma instância de modelo da caixa. */
  removeModelFromBox: (_caixaId: string, _modelInstanceId: string) => void;
  /** Atualiza nome, material ou categoria de uma instância de modelo na caixa. */
  updateModelInBox: (_caixaId: string, _modelInstanceId: string, _updates: { nome?: string; material?: string; categoria?: string }) => void;
  /** (Legado) Atualiza o único modelo da caixa; migra para models[]. */
  updateCaixaModelId: (_caixaId: string, _modelId: string | null) => void;
  selectModelInstance: (_boxId: string, _modelInstanceId: string | null) => void;
  renameBox: (_nome: string) => void;
  setPrateleiras: (_quantidade: number) => void;
  setPortaTipo: (_portaTipo: BoxModule["portaTipo"]) => void;
  setTipoBorda: (_tipoBorda: TipoBorda) => void;
  setTipoFundo: (_tipoFundo: TipoFundo) => void;
  setExtractedPartsForBox: (_boxId: string, _modelInstanceId: string, _parts: CutListItemComPreco[]) => void;
  clearExtractedPartsForBox: (_boxId: string, _modelInstanceId?: string) => void;
  setModelPositionInBox: (_boxId: string, _modelInstanceId: string, _position: { x: number; y: number; z: number }) => void;
  setLayoutWarnings: (_warnings: LayoutWarnings) => void;
  updateWorkspacePosition: (_boxId: string, _posicaoX_mm: number) => void;
  updateWorkspaceBoxPosition: (_boxId: string, _posicaoX_mm: number) => void;
  /** Atualiza posição/rotação/manual da caixa no viewer (manipulação visual; não altera cut list). */
  updateWorkspaceBoxTransform: (
    _boxId: string,
    _partial: { x_mm?: number; y_mm?: number; z_mm?: number; rotacaoY_rad?: number; manualPosition?: boolean }
  ) => void;
  /** Atualiza dimensões da caixa a partir do bbox do GLB (caixas CAD-only). */
  setWorkspaceBoxDimensoes: (_boxId: string, _dimensoes: { largura: number; altura: number; profundidade: number }) => void;
  /** Atualiza o nome da caixa (ex.: nome do modelo CAD). */
  setWorkspaceBoxNome: (_boxId: string, _nome: string) => void;
  toggleWorkspaceRotation: (_boxId: string) => void;
  rotateWorkspaceBox: (_boxId: string) => void;
  gerarDesign: () => void;
  exportarPDF: () => void;
  logChangelog: (_message: string) => void;
  undo: () => void;
  redo: () => void;
  saveProjectSnapshot: () => void;
  loadProjectSnapshot: (_id: string) => void;
  listSavedProjects: () => SavedProjectInfo[];
  createNewProject: () => void;
  renameProject: (_id: string, _name: string) => void;
  deleteProject: (_id: string) => void;
}

export interface ProjectContextProps {
  project: ProjectState;
  actions: ProjectActions;
  viewerSync: ViewerSync;
}
