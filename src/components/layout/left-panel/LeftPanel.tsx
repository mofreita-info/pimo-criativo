import { useEffect, useState } from "react";
import { useProject } from "../../../context/ProjectProvider";
import Panel from "../../ui/Panel";

export default function LeftPanel() {
  const { project, actions } = useProject();
  const selectedBox = project.workspaceBoxes.find(
    (box) => box.id === project.selectedWorkspaceBoxId
  );
  const selectedEspessura = selectedBox?.espessura ?? project.material.espessura;
  const selectedPrateleiras = selectedBox?.prateleiras ?? 0;
  const tipoProjeto = project.tipoProjeto;
  const [cadModels, setCadModels] = useState<{ id: string; nome: string; categoria: string }[]>(
    []
  );
  const [materialTipo, setMaterialTipo] = useState(project.material.tipo);
  const [espessuraUI, setEspessuraUI] = useState(selectedEspessura);

  useEffect(() => {
    setMaterialTipo(project.material.tipo);
  }, [project.material.tipo]);

  useEffect(() => {
    setEspessuraUI(selectedEspessura);
  }, [selectedEspessura]);

  const reloadCadModels = () => {
    const stored = localStorage.getItem("pimo_admin_cad_models");
    if (!stored) {
      setCadModels([]);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as { id: string; nome: string; categoria: string }[];
      if (Array.isArray(parsed)) setCadModels(parsed);
      else setCadModels([]);
    } catch {
      setCadModels([]);
    }
  };

  useEffect(() => {
    reloadCadModels();
  }, []);

  return (
    <aside
      style={{
        width: 260,
        background: "rgba(15,23,42,0.96)",
        borderRight: "1px solid var(--border)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Título da Secção */}
      <div
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          letterSpacing: 0.8,
        }}
      >
        Definições
      </div>

      <Panel title="NOME DE PROJETO">
        <input
          type="text"
          value={project.projectName}
          onChange={(e) => actions.setProjectName(e.target.value)}
          placeholder="Nome do projeto"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            padding: "6px 8px",
            borderRadius: "var(--radius)",
            fontSize: 13,
          }}
        />
      </Panel>

      <Panel title="Tipo de Projeto">
        <select
          value={tipoProjeto}
          onChange={(e) => {
            const value = e.target.value;
            actions.setTipoProjeto(value);
            if (value === "Caixa com porta") {
              actions.setPortaTipo("porta_simples");
            } else if (value === "Guarda-roupa com porta de correr") {
              actions.setPortaTipo("porta_correr");
            } else if (value === "Caixa sem porta") {
              actions.setPortaTipo("sem_porta");
            }
          }}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            fontSize: 13,
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: "var(--radius)",
          }}
        >
          {[
            "Caixa sem porta",
            "Caixa com porta",
            "Guarda-roupa com porta de correr",
            "Caixa de canto esquerda",
            "Caixa de canto direita",
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Panel>

      <Panel title="Selecionar Caixa do Projeto">
        <select
          value={project.selectedCaixaId}
          onChange={(e) => actions.selectBox(e.target.value)}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            fontSize: 13,
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: "var(--radius)",
            marginBottom: 8,
          }}
        >
          {project.workspaceBoxes.map((box) => (
            <option key={box.id} value={box.id}>
              {box.nome || box.id}
            </option>
          ))}
        </select>
      </Panel>

      <Panel title="Modelo 3D (lista de cadModels)">
        <select
          value={selectedBox?.modelId ?? ""}
          onChange={(e) =>
            actions.updateCaixaModelId(
              project.selectedCaixaId,
              e.target.value === "" ? null : e.target.value
            )
          }
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            fontSize: 13,
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: "var(--radius)",
          }}
        >
          <option value="">Nenhum modelo</option>
          {cadModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.nome} — {model.categoria}
            </option>
          ))}
        </select>
        <button
          onClick={reloadCadModels}
          style={{
            marginTop: 8,
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-main)",
            padding: "6px 8px",
            borderRadius: "var(--radius)",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Recarregar modelos
        </button>
      </Panel>

      {/* Material */}
      <Panel title="Material">
        <div style={{ marginBottom: 8 }}>
          <select
            value={materialTipo}
            onChange={(e) => setMaterialTipo(e.target.value)}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              fontSize: 13,
              cursor: "pointer",
              padding: "6px 8px",
              borderRadius: "var(--radius)",
            }}
          >
            <option value="MDF">MDF</option>
            <option value="Contraplacado">Contraplacado</option>
            <option value="Carvalho">Carvalho</option>
            <option value="Faia">Faia</option>
            <option value="Pinho">Pinho</option>
          </select>
        </div>
        <select
          value={espessuraUI}
          onChange={(e) => setEspessuraUI(Number(e.target.value))}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            fontSize: 13,
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: "var(--radius)",
          }}
        >
          <option value={15}>15mm</option>
          <option value={18}>18mm</option>
          <option value={19}>19mm</option>
          <option value={25}>25mm</option>
        </select>
      </Panel>

      {/* Dimensões */}
      <Panel title="Dimensões" description="Valores em milímetros">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", width: 88 }}>
              Largura:
            </span>
            <input
              type="number"
              value={project.dimensoes.largura}
              onChange={(e) =>
                actions.setDimensoes({ largura: Number(e.target.value) })
              }
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                padding: "4px 8px",
                borderRadius: "var(--radius)",
                fontSize: 12,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", width: 88 }}>
              Altura:
            </span>
            <input
              type="number"
              value={project.dimensoes.altura}
              onChange={(e) =>
                actions.setDimensoes({ altura: Number(e.target.value) })
              }
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                padding: "4px 8px",
                borderRadius: "var(--radius)",
                fontSize: 12,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", width: 88 }}>
              Profundidade:
            </span>
            <input
              type="number"
              value={project.dimensoes.profundidade}
              onChange={(e) =>
                actions.setDimensoes({ profundidade: Number(e.target.value) })
              }
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                color: "var(--text-main)",
                padding: "4px 8px",
                borderRadius: "var(--radius)",
                fontSize: 12,
              }}
            />
          </div>
        </div>
      </Panel>

      <Panel title="Prateleiras" description="Quantidade por caixote">
        <input
          type="number"
          min="0"
          value={selectedPrateleiras}
          onChange={(e) => actions.setPrateleiras(Number(e.target.value))}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            color: "var(--text-main)",
            padding: "6px 8px",
            borderRadius: "var(--radius)",
            fontSize: 13,
          }}
        />
      </Panel>

    </aside>
  );
}
