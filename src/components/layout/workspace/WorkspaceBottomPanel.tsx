import { useProject } from "../../../context/useProject";
import Panel from "../../ui/Panel";
import CutListView from "../../ui/CutListView";
import CutlistPanel from "../../panels/CutlistPanel";

export default function WorkspaceBottomPanel() {
  const { project } = useProject();
  const microTextStyle = { fontSize: 12, lineHeight: 1.4, color: "var(--text-muted)" };

  return (
    <section
      style={{
        width: "100%",
        background: "rgba(10,16,30,0.96)",
        borderTop: "1px solid var(--border)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxHeight: 360,
        overflowY: "auto",
      }}
    >
      <Panel title="Estado do Sistema">
        <div style={{ lineHeight: 1.4 }}>
          {project.estaCarregando
            ? "A calcular..."
            : project.erro
            ? project.erro
            : project.design
            ? `Design Gerado (${project.estrutura3D?.pecas.length || 0} peças)`
            : "Pronto para Gerar"}
        </div>
      </Panel>

      <CutListView />
      <CutlistPanel />

      {project.acessorios && project.acessorios.length > 0 && (
        <Panel title="Ferragens">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {project.acessorios.map((acessorio) => (
              <div
                key={acessorio.id}
                style={{
                  padding: "6px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "var(--text-main)", fontWeight: 600, fontSize: 12 }}>
                      {acessorio.nome}
                    </div>
                    <div style={{ ...microTextStyle, marginTop: 4 }}>
                      {acessorio.quantidade} un. × {acessorio.precoUnitario.toFixed(2)}€
                    </div>
                  </div>
                  <div style={{ color: "var(--text-main)", fontWeight: 600, fontSize: 12 }}>
                    {acessorio.precoTotal.toFixed(2)}€
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {project.precoTotalProjeto !== null && (
        <Panel title="Preço por caixa">
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--blue-light)" }}>
            {project.precoTotalProjeto.toFixed(2)}€
          </div>
          {project.precoTotalPecas !== null && project.precoTotalAcessorios !== null && (
            <div style={{ ...microTextStyle, marginTop: 6 }}>
              Peças: {project.precoTotalPecas.toFixed(2)}€ + Acessórios:{" "}
              {project.precoTotalAcessorios.toFixed(2)}€ + Margem 10%
            </div>
          )}
        </Panel>
      )}
    </section>
  );
}
