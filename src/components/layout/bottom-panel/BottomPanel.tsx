import { useProject } from "../../../context/useProject";
import Panel from "../../ui/Panel";

export default function BottomPanel() {
  const { project } = useProject();
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--text-muted)" };
  const microTextStyle = { fontSize: 12, lineHeight: 1.4, color: "var(--text-muted)" };

  const formatarData = (data: Date | null): string => {
    if (!data) return "Nunca";
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffSeg = Math.floor(diffMs / 1000);

    if (diffSeg < 5) return "Agora";
    if (diffSeg < 60) return `Há ${diffSeg}s`;
    if (diffSeg < 3600) return `Há ${Math.floor(diffSeg / 60)}min`;
    return data.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resultados = project.resultados;

  return (
    <div
      style={{
        height: 120,
        background: "rgba(15,23,42,0.98)",
        borderTop: "1px solid var(--border)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Secção Esquerda: Resultados */}
      <div style={{ maxWidth: "70%" }}>
        <Panel title="Resultados Atuais">
          {resultados ? (
            <div style={{ fontSize: 14, color: "var(--text-main)" }}>
              <span style={labelStyle}>Preço estimado:</span>{" "}
              <strong>{resultados.precoFinal.toFixed(2)} €</strong>
              <span style={{ ...labelStyle, marginLeft: 10 }}>Peças:</span>{" "}
              <strong>{resultados.numeroPecas}</strong>
              <span style={{ ...labelStyle, marginLeft: 10 }}>Painéis:</span>{" "}
              <strong>{resultados.numeroPaineis}</strong>
              {resultados.desperdicioPercentual > 0 && (
                <>
                  {" "}
                  <span style={{ ...labelStyle, marginLeft: 10 }}>Desperdício:</span>{" "}
                  <strong>{resultados.desperdicioPercentual.toFixed(1)}%</strong>
                </>
              )}
              {project.estrutura3D && project.estrutura3D.pecas.length > 0 && (
                <>
                  {" "}
                  <span style={{ ...labelStyle, marginLeft: 10 }}>Elementos 3D:</span>{" "}
                  <strong>{project.estrutura3D.pecas.length}</strong>
                </>
              )}
            </div>
          ) : (
            <div style={{ ...microTextStyle, fontSize: 13 }}>
              A calcular resultados...
            </div>
          )}
        </Panel>
      </div>

      {/* Secção Direita: Estado da Atualização */}
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: 12,
          textAlign: "right",
          minWidth: 160,
        }}
      >
        Última Atualização: {formatarData(project.ultimaAtualizacao)}
      </div>
    </div>
  );
}
