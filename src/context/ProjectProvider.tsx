import { useState } from "react";
import type { ReactNode } from "react";
import { gerarPdfIndustrial } from "../core/export/pdfGenerator";
import type { WorkspaceBox } from "../core/types";
import { ProjectContext } from "./projectContext";
import type { ProjectActions, ProjectState } from "./projectTypes";
import {
  applyResultados,
  appendChangelog,
  buildBoxesFromWorkspace,
  buildDesignState,
  createWorkspaceBox,
  defaultState,
  getModelUrlFromStorage,
  getSelectedWorkspaceBox,
  recomputeState,
} from "./projectState";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<ProjectState>(() => applyResultados(defaultState));

  const recalcular = (newState: Partial<ProjectState>, withLoading: boolean) => {
    setProject((prev) => recomputeState(prev, newState, withLoading));
  };

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
