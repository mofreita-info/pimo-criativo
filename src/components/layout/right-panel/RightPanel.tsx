import { useProject } from "../../../context/ProjectProvider";

export default function RightPanel() {
  const { project, actions } = useProject();

  return (
    <aside
      style={{
        width: 260,
        background: "rgba(10,16,30,0.98)",
        borderLeft: "1px solid var(--border)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100vh",
        overflowY: "auto",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Título da Secção */}
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          letterSpacing: 0.8,
        }}
      >
        Ações
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Botão Gerar */}
        <button
          onClick={() => actions.gerarDesign()}
          disabled={project.estaCarregando}
          style={{
            background: project.estaCarregando
              ? "rgba(59, 130, 246, 0.5)"
              : "var(--blue-light)",
            border: "none",
            color: "white",
            padding: "10px 14px",
            borderRadius: "var(--radius)",
            fontSize: 13,
            cursor: project.estaCarregando ? "not-allowed" : "pointer",
            fontWeight: 600,
            transition: "0.2s",
          }}
          onMouseOver={(e) => {
            if (!project.estaCarregando) {
              e.currentTarget.style.opacity = "0.85";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          {project.estaCarregando ? "A Calcular..." : "Gerar Design 3D"}
        </button>

        <button
          onClick={() => actions.addWorkspaceBox()}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-main)",
            padding: "10px 14px",
            borderRadius: "var(--radius)",
            fontSize: 13,
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
        >
          Adicionar caixote
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => actions.duplicateWorkspaceBox()}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-main)",
              padding: "8px 10px",
              borderRadius: "var(--radius)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Duplicar
          </button>
          <button
            onClick={() => actions.removeWorkspaceBox()}
            disabled={project.workspaceBoxes.length <= 1}
            style={{
              flex: 1,
              background:
                project.workspaceBoxes.length <= 1
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-main)",
              padding: "8px 10px",
              borderRadius: "var(--radius)",
              fontSize: 13,
              cursor: project.workspaceBoxes.length <= 1 ? "not-allowed" : "pointer",
              opacity: project.workspaceBoxes.length <= 1 ? 0.6 : 1,
            }}
          >
            Remover caixa
          </button>
        </div>

        {/* Botão Exportar */}
        <button
          onClick={() => actions.exportarPDF()}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-main)",
            padding: "10px 14px",
            borderRadius: "var(--radius)",
            fontSize: 13,
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
        >
          Exportar Cut List (PDF)
        </button>
      </div>

      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* Caixa de informações */}
    </aside>
  );
}
