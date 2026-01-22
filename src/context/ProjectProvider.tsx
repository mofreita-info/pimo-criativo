import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { calcularProjeto } from "../core/calculator/woodCalculator";
import { generateDesign } from "../core/design/generateDesign";
import { buildFerragens } from "../core/design/ferragens";
import {
  calcularPrecoCutList,
  calcularPrecoTotalPecas,
  calcularPrecoTotalProjeto,
} from "../core/pricing/pricing";
import { calcularPrecosAcessorios } from "../core/acessorios/acessorios";
import { gerarPdfIndustrial } from "../core/export/pdfGenerator";
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
  ProjetoConfig,
  ResultadosCalculo,
  WorkspaceBox,
} from "../core/types";

// Interfaces
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

interface ProjectContextProps {
  project: ProjectState;
  actions: ProjectActions;
}

// Defaults
const defaultMaterial: Material = {
  tipo: "MDF",
  espessura: 19,
  precoPorM2: 25.0,
};

const defaultDimensoes: Dimensoes = {
  largura: 1800,
  altura: 2000,
  profundidade: 400,
};

const createBox = (
  id: string,
  nome: string,
  dimensoes: Dimensoes,
  espessura: number,
  modelId: string | null
): BoxModule => ({
  id,
  nome,
  dimensoes,
  espessura,
  modelId,
  prateleiras: 0,
  portaTipo: "porta_simples",
  gavetas: 1,
  alturaGaveta: 200,
  ferragens: [],
  cutList: [],
  cutListComPreco: [],
  estrutura3D: {
    pecas: [],
    dimensoesTotais: {
      largura: dimensoes.largura,
      altura: dimensoes.altura,
      profundidade: dimensoes.profundidade,
    },
    centro: {
      x: 0,
      y: dimensoes.altura / 2,
      z: 0,
    },
  },
  precoTotalPecas: 0,
});

const createWorkspaceBox = (
  id: string,
  nome: string,
  dimensoes: Dimensoes,
  espessura: number,
  posicaoX_mm: number,
  modelId: string | null
): WorkspaceBox => ({
  id,
  nome,
  dimensoes,
  espessura,
  modelId,
  prateleiras: 0,
  portaTipo: "sem_porta",
  gavetas: 0,
  alturaGaveta: 200,
  posicaoX_mm,
  posicaoY_mm: 0,
  rotacaoY_90: false,
});

const defaultWorkspaceBoxes: WorkspaceBox[] = [
  createWorkspaceBox(
    "box-1",
    "Caixa 1",
    defaultDimensoes,
    defaultMaterial.espessura,
    0,
    null
  ),
];

const defaultState: ProjectState = {
  projectName: "Novo Projeto",
  tipoProjeto: "Estante de Parede – 3 Portas",
  material: defaultMaterial,
  dimensoes: defaultDimensoes,
  quantidade: 1,
  boxes: [],
  selectedBoxId: "",
  workspaceBoxes: defaultWorkspaceBoxes,
  selectedWorkspaceBoxId: defaultWorkspaceBoxes[0].id,
  selectedCaixaId: defaultWorkspaceBoxes[0].id,
  selectedCaixaModelUrl: null,
  resultados: null,
  ultimaAtualizacao: null,
  design: null,
  cutList: null,
  cutListComPreco: null,
  estrutura3D: null,
  acessorios: null,
  precoTotalPecas: null,
  precoTotalAcessorios: null,
  precoTotalProjeto: null,
  estaCarregando: false,
  erro: null,
  changelog: [],
};

// Helpers
const buildConfig = (state: ProjectState): ProjetoConfig => {
  const selectedWorkspace = getSelectedWorkspaceBox(state);
  const selectedBox = getSelectedBox(state);
  return {
    tipo: state.tipoProjeto,
    material: state.material,
    dimensoes: selectedWorkspace?.dimensoes ?? selectedBox?.dimensoes ?? state.dimensoes,
    quantidade: state.quantidade,
  };
};

const calcularResultadosBoxes = (state: ProjectState): ResultadosCalculo | null => {
  if (!state.boxes || state.boxes.length === 0) {
    return null;
  }
  const totals = state.boxes.reduce(
    (acc, box) => {
      const resultados = calcularProjeto({
        tipo: state.tipoProjeto,
        material: state.material,
        dimensoes: box.dimensoes,
        quantidade: state.quantidade,
      });
      return {
        numeroPecas: acc.numeroPecas + resultados.numeroPecas,
        numeroPaineis: acc.numeroPaineis + resultados.numeroPaineis,
        areaTotal: acc.areaTotal + resultados.areaTotal,
        desperdicio: acc.desperdicio + resultados.desperdicio,
        precoMaterial: acc.precoMaterial + resultados.precoMaterial,
        precoFinal: acc.precoFinal + resultados.precoFinal,
      };
    },
    {
      numeroPecas: 0,
      numeroPaineis: 0,
      areaTotal: 0,
      desperdicio: 0,
      precoMaterial: 0,
      precoFinal: 0,
    }
  );
  const desperdicioPercentual =
    totals.areaTotal > 0 ? (totals.desperdicio / totals.areaTotal) * 100 : 0;
  return { ...totals, desperdicioPercentual };
};

const applyResultados = (state: ProjectState): ProjectState => {
  try {
    const resultados =
      state.boxes && state.boxes.length > 0
        ? calcularResultadosBoxes(state)
        : calcularProjeto(buildConfig(state));
    return {
      ...state,
      resultados,
      ultimaAtualizacao: new Date(),
      estaCarregando: false,
      erro: null,
    };
  } catch (error) {
    return {
      ...state,
      resultados: null,
      estaCarregando: false,
      erro: error instanceof Error ? error.message : "Erro ao calcular projeto",
    };
  }
};

const appendChangelog = (
  prev: ChangelogEntry[],
  entry: Omit<ChangelogEntry, "id">
): ChangelogEntry[] => {
  return [
    {
      ...entry,
      id: `${entry.type}-${entry.timestamp.getTime()}-${prev.length + 1}`,
    },
    ...prev,
  ].slice(0, 100);
};

const recomputeState = (
  prev: ProjectState,
  partial: Partial<ProjectState>,
  withLoading: boolean
): ProjectState => {
  const nextState: ProjectState = {
    ...prev,
    ...partial,
    ...(withLoading ? { estaCarregando: true } : null),
  };

  return applyResultados(nextState);
};

const buildBoxDesign = (prev: ProjectState, box: BoxModule): BoxModule => {
  const design = generateDesign(
    prev.tipoProjeto,
    prev.material,
    box.dimensoes,
    prev.quantidade,
    box.espessura,
    box.prateleiras,
    box.portaTipo,
    box.gavetas,
    box.alturaGaveta
  );

  const cutListComPreco = calcularPrecoCutList(design.cutList);
  const precoTotalPecas = calcularPrecoTotalPecas(cutListComPreco);
  const ferragens = buildFerragens(box.prateleiras, box.portaTipo, box.gavetas);

  return {
    ...box,
    ferragens,
    cutList: design.cutList,
    cutListComPreco,
    estrutura3D: design.estrutura3D,
    precoTotalPecas,
  };
};

const getSelectedBox = (state: ProjectState): BoxModule | undefined => {
  return state.boxes.find((box) => box.id === state.selectedBoxId) ?? state.boxes[0];
};

const getSelectedWorkspaceBox = (state: ProjectState): WorkspaceBox | undefined => {
  return (
    state.workspaceBoxes.find((box) => box.id === state.selectedWorkspaceBoxId) ??
    state.workspaceBoxes[0]
  );
};

const getModelUrlFromStorage = (modelId?: string | null): string | null => {
  if (!modelId) return null;
  const stored = localStorage.getItem("pimo_admin_cad_models");
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as { id?: string; arquivo?: string }[];
    const found = parsed.find((item) => item.id === modelId);
    return found?.arquivo ?? null;
  } catch {
    return null;
  }
};

const convertWorkspaceToBox = (box: WorkspaceBox): BoxModule => ({
  ...createBox(box.id, box.nome, box.dimensoes, box.espessura, box.modelId),
  prateleiras: box.prateleiras,
  portaTipo: box.portaTipo,
  gavetas: box.gavetas,
  alturaGaveta: box.alturaGaveta,
});

const buildBoxesFromWorkspace = (state: ProjectState): BoxModule[] => {
  return state.workspaceBoxes.map((box) => convertWorkspaceToBox(box));
};

const buildDesignState = (prev: ProjectState): Partial<ProjectState> => {
  const boxes = prev.boxes.map((box) => buildBoxDesign(prev, box));
  const selectedBox = getSelectedBox(prev);
  if (!selectedBox) {
    return {
      design: null,
      cutList: null,
      cutListComPreco: null,
      estrutura3D: null,
      acessorios: null,
      precoTotalPecas: null,
      precoTotalAcessorios: null,
      precoTotalProjeto: null,
      ultimaAtualizacao: new Date(),
      estaCarregando: false,
      erro: "Nenhum caixote disponível para cálculo",
    };
  }
  const selectedDesign =
    boxes.find((design) => design.id === selectedBox.id) ?? boxes[0];
  const resultados = calcularResultadosBoxes({ ...prev, boxes });

  const ferragensAtivas = selectedDesign.ferragens.filter((item) => item.quantidade > 0);
  const acessoriosComPreco = calcularPrecosAcessorios(ferragensAtivas);
  const precoTotalAcessorios = acessoriosComPreco.reduce(
    (total, acc) => total + acc.precoTotal,
    0
  );

  const precoProjetoBase = selectedDesign.precoTotalPecas + precoTotalAcessorios;
  const precoTotalProjeto = calcularPrecoTotalProjeto(precoProjetoBase);

  return {
    boxes,
    design: {
      cutList: selectedDesign.cutList,
      estrutura3D: selectedDesign.estrutura3D,
      acessorios: selectedDesign.ferragens,
      timestamp: new Date(),
    },
    cutList: selectedDesign.cutList,
    cutListComPreco: selectedDesign.cutListComPreco,
    estrutura3D: selectedDesign.estrutura3D,
    acessorios: acessoriosComPreco,
    precoTotalPecas: selectedDesign.precoTotalPecas,
    precoTotalAcessorios,
    precoTotalProjeto,
    resultados,
    ultimaAtualizacao: new Date(),
    estaCarregando: false,
    erro: null,
  };
};

// Context
const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

// Provider
export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<ProjectState>(defaultState);

  const recalcular = (newState: Partial<ProjectState>, withLoading: boolean) => {
    setProject((prev) => recomputeState(prev, newState, withLoading));
  };

  useEffect(() => {
    recalcular({}, false);
  }, []);

  // Actions
  const actions: ProjectActions = {
    setProjectName: (name) => {
      recalcular({ projectName: name }, true);
    },
    setTipoProjeto: (tipo) => {
      recalcular({ tipoProjeto: tipo }, true);
    },

    setMaterial: (material) => {
      recalcular({ material }, true);
    },

    setEspessura: (espessura) => {
      setProject((prev) => {
        const workspaceBoxes = prev.workspaceBoxes.map((box) =>
          box.id === prev.selectedWorkspaceBoxId ? { ...box, espessura } : box
        );
        return recomputeState(prev, { workspaceBoxes }, true);
      });
    },

    setDimensoes: (dimensoes) => {
      setProject((prev) => {
        const workspaceBoxes = prev.workspaceBoxes.map((box) =>
          box.id === prev.selectedWorkspaceBoxId
            ? { ...box, dimensoes: { ...box.dimensoes, ...dimensoes } }
            : box
        );
        return recomputeState(
          prev,
          {
            dimensoes: { ...prev.dimensoes, ...dimensoes },
            workspaceBoxes,
          },
          true
        );
      });
    },

    setQuantidade: (quantidade) => {
      if (quantidade < 1) return;
      recalcular({ quantidade }, true);
    },

    addBox: () => {
      setProject((prev) => {
        const nextIndex = prev.workspaceBoxes.length + 1;
        const baseEspessura =
          prev.workspaceBoxes.find((box) => box.id === prev.selectedWorkspaceBoxId)
            ?.espessura ?? prev.material.espessura;
        const dimensoes = prev.dimensoes;
        const newBox = createWorkspaceBox(
          `box-${nextIndex}`,
          `Caixa ${nextIndex}`,
          dimensoes,
          baseEspessura,
          0,
          null
        );
        return recomputeState(
          prev,
          {
            workspaceBoxes: [...prev.workspaceBoxes, newBox],
            selectedWorkspaceBoxId: newBox.id,
            selectedCaixaId: newBox.id,
            selectedCaixaModelUrl: null,
            changelog: appendChangelog(prev.changelog, {
              timestamp: new Date(),
              type: "box",
              message: `Caixote criado: ${newBox.nome}`,
            }),
          },
          true
        );
      });
    },

    addWorkspaceBox: () => {
      actions.addBox();
    },

    duplicateBox: () => {
      setProject((prev) => {
        const selected = getSelectedWorkspaceBox(prev);
        if (!selected) return prev;
        const nextIndex = prev.workspaceBoxes.length + 1;
        const newBox: WorkspaceBox = {
          ...selected,
          id: `box-${nextIndex}`,
          nome: `${selected.nome} (cópia)`,
          posicaoX_mm: 0,
          modelId: selected.modelId ?? null,
        };
        return recomputeState(
          prev,
          {
            workspaceBoxes: [...prev.workspaceBoxes, newBox],
            selectedWorkspaceBoxId: newBox.id,
            selectedCaixaId: newBox.id,
            selectedCaixaModelUrl: null,
            changelog: appendChangelog(prev.changelog, {
              timestamp: new Date(),
              type: "box",
              message: `Caixote duplicado: ${selected.nome} → ${newBox.nome}`,
            }),
          },
          true
        );
      });
    },

    duplicateWorkspaceBox: () => {
      actions.duplicateBox();
    },

    removeBox: () => {
      setProject((prev) => {
        if (prev.workspaceBoxes.length <= 1) {
          return prev;
        }
        const removed = getSelectedWorkspaceBox(prev);
        const filtered = prev.workspaceBoxes.filter(
          (box) => box.id !== prev.selectedWorkspaceBoxId
        );
        const nextSelected = filtered[0];
        return recomputeState(
          prev,
          {
            workspaceBoxes: filtered,
            selectedWorkspaceBoxId: nextSelected.id,
            selectedCaixaId: nextSelected.id,
            selectedCaixaModelUrl: getModelUrlFromStorage(nextSelected.modelId),
            dimensoes: nextSelected.dimensoes,
            changelog: appendChangelog(prev.changelog, {
              timestamp: new Date(),
              type: "box",
              message: `Caixote removido: ${removed?.nome ?? "Caixa"}`,
            }),
          },
          true
        );
      });
    },

    removeWorkspaceBox: () => {
      actions.removeBox();
    },

    selectBox: (boxId) => {
      setProject((prev) => {
        const selected = prev.workspaceBoxes.find((box) => box.id === boxId);
        if (!selected) return prev;
        return recomputeState(
          prev,
          {
            selectedWorkspaceBoxId: boxId,
            selectedBoxId: prev.boxes.find((box) => box.id === boxId)
              ? boxId
              : prev.selectedBoxId,
            selectedCaixaId: boxId,
            selectedCaixaModelUrl: getModelUrlFromStorage(selected.modelId),
            dimensoes: selected.dimensoes,
          },
          true
        );
      });
    },

    updateCaixaModelId: (caixaId, modelId) => {
      setProject((prev) => {
        const workspaceBoxes = prev.workspaceBoxes.map((box) =>
          box.id === caixaId ? { ...box, modelId } : box
        );
        const boxes = prev.boxes.map((box) =>
          box.id === caixaId ? { ...box, modelId } : box
        );
        const selectedCaixaModelUrl = getModelUrlFromStorage(modelId);
        return {
          ...prev,
          workspaceBoxes,
          boxes,
          selectedCaixaId: caixaId,
          selectedCaixaModelUrl,
        };
      });
    },

    renameBox: (nome) => {
      setProject((prev) => {
        const selected = getSelectedWorkspaceBox(prev);
        const workspaceBoxes = prev.workspaceBoxes.map((box) =>
          box.id === prev.selectedWorkspaceBoxId ? { ...box, nome } : box
        );
        return recomputeState(
          prev,
          {
            workspaceBoxes,
            changelog: appendChangelog(prev.changelog, {
              timestamp: new Date(),
              type: "box",
              message: `Caixote renomeado: ${selected?.nome ?? "Caixa"} → ${nome}`,
            }),
          },
          true
        );
      });
    },

    setPrateleiras: (quantidade) => {
      const valor = Math.max(0, Math.floor(quantidade));
      setProject((prev) => {
        const workspaceBoxes = prev.workspaceBoxes.map((box) =>
          box.id === prev.selectedWorkspaceBoxId ? { ...box, prateleiras: valor } : box
        );
        return recomputeState(
          prev,
          {
            workspaceBoxes,
            changelog: appendChangelog(prev.changelog, {
              timestamp: new Date(),
              type: "box",
              message: `Prateleiras ajustadas para ${valor}`,
            }),
          },
          true
        );
      });
    },

    setPortaTipo: (portaTipo) => {
      setProject((prev) => {
        const workspaceBoxes = prev.workspaceBoxes.map((box) =>
          box.id === prev.selectedWorkspaceBoxId ? { ...box, portaTipo } : box
        );
        return recomputeState(prev, { workspaceBoxes }, true);
      });
    },

    updateWorkspacePosition: (boxId, posicaoX_mm) => {
      setProject((prev) => {
        const workspaceBoxes = prev.workspaceBoxes.map((box) =>
          box.id === boxId ? { ...box, posicaoX_mm } : box
        );
        return { ...prev, workspaceBoxes };
      });
    },

    updateWorkspaceBoxPosition: (boxId, posicaoX_mm) => {
      actions.updateWorkspacePosition(boxId, posicaoX_mm);
    },

    toggleWorkspaceRotation: (boxId) => {
      setProject((prev) => {
        const workspaceBoxes = prev.workspaceBoxes.map((box) =>
          box.id === boxId ? { ...box, rotacaoY_90: !box.rotacaoY_90 } : box
        );
        return { ...prev, workspaceBoxes };
      });
    },

    rotateWorkspaceBox: (boxId) => {
      actions.toggleWorkspaceRotation(boxId);
    },

    gerarDesign: () => {
      setProject((prev) => {
        try {
          if (!prev.workspaceBoxes || prev.workspaceBoxes.length === 0) {
            return {
              ...prev,
              erro: "Nenhum caixote disponível para cálculo",
              estaCarregando: false,
            };
          }
          const boxes = buildBoxesFromWorkspace(prev);
          const selectedWorkspace = getSelectedWorkspaceBox(prev);
          const selectedBoxId =
            boxes.find((box) => box.id === selectedWorkspace?.id)?.id ?? boxes[0].id;
          const nextState = {
            ...prev,
            boxes,
            selectedBoxId,
            dimensoes:
              selectedWorkspace?.dimensoes ??
              boxes.find((box) => box.id === selectedBoxId)?.dimensoes ??
              prev.dimensoes,
          };
          return {
            ...nextState,
            ...buildDesignState(nextState),
            changelog: appendChangelog(prev.changelog, {
              timestamp: new Date(),
              type: "calc",
              message: "Caixotes recalculados",
            }),
          };
        } catch (error) {
          return {
            ...prev,
            design: null,
            cutList: null,
            cutListComPreco: null,
            estrutura3D: null,
            acessorios: null,
            precoTotalPecas: null,
            precoTotalAcessorios: null,
            precoTotalProjeto: null,
            estaCarregando: false,
            erro: error instanceof Error ? error.message : "Erro ao gerar design",
          };
        }
      });
    },

    exportarPDF: () => {
      if (!project.boxes || project.boxes.length === 0) {
        alert("Nenhuma cut list disponível para exportar.");
        return;
      }

      const doc = gerarPdfIndustrial(project.boxes);
      doc.save("cutlist-industrial.pdf");
    },

    logChangelog: (message) => {
      setProject((prev) => ({
        ...prev,
        changelog: appendChangelog(prev.changelog, {
          timestamp: new Date(),
          type: "doc",
          message,
        }),
      }));
    },
  };

  return (
    <ProjectContext.Provider value={{ project, actions }}>
      {children}
    </ProjectContext.Provider>
  );
}

// Hook
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject deve ser usado dentro de um ProjectProvider");
  }
  return context;
}
