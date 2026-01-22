import Panel from "./Panel";
import { useProject } from "../../context/useProject";

type CutListRow = {
  id: string;
  nome: string;
  largura: number;
  altura: number;
  profundidade: number;
  espessura: number;
  quantidade: number;
  precoUnitario?: number;
  precoTotal?: number;
};

export default function CutListView() {
  const { project, actions } = useProject();
  const microTextStyle = { fontSize: 12, lineHeight: 1.4, color: "var(--text-muted)" };
  const doorLabels: Record<string, string> = {
    sem_porta: "Sem porta",
    porta_simples: "Porta simples",
    porta_dupla: "Porta dupla",
    porta_correr: "Porta de correr",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {project.boxes.map((box, index) => {
        const isSelected = box.id === project.selectedBoxId;
        const rows: CutListRow[] =
          box.cutListComPreco.length > 0
            ? box.cutListComPreco.map((item) => ({
                id: item.id,
                nome: item.nome,
                largura: item.dimensoes.largura,
                altura: item.dimensoes.altura,
                profundidade: item.dimensoes.profundidade,
                espessura: item.espessura,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                precoTotal: item.precoTotal,
              }))
            : box.cutList.map((item) => ({
                id: item.id,
                nome: item.nome,
                largura: item.dimensoes.largura,
                altura: item.dimensoes.altura,
                profundidade: item.dimensoes.profundidade,
                espessura: item.espessura,
                quantidade: item.quantidade,
              }));

        const title = box.nome || `Caixa ${index + 1}`;

        return (
          <Panel key={box.id} title={title}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => actions.selectBox(box.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  actions.selectBox(box.id);
                }
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                cursor: "pointer",
                padding: "8px",
                borderRadius: "var(--radius)",
                border: isSelected
                  ? "1px solid rgba(59,130,246,0.45)"
                  : "1px solid rgba(255,255,255,0.06)",
                background: isSelected ? "rgba(59,130,246,0.08)" : "transparent",
                outline: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {doorLabels[box.portaTipo] ?? "Sem porta"} · {box.prateleiras} prateleiras ·{" "}
                  {box.gavetas} gavetas
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      actions.selectBox(box.id);
                      setTimeout(() => actions.duplicateBox(), 0);
                    }}
                    style={{
                      width: 28,
                      height: 24,
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--text-main)",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                    aria-label="Duplicar caixote"
                    title="Duplicar"
                  >
                    📄
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      actions.selectBox(box.id);
                      setTimeout(() => actions.removeBox(), 0);
                    }}
                    style={{
                      width: 28,
                      height: 24,
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--text-main)",
                      cursor: project.boxes.length <= 1 ? "not-allowed" : "pointer",
                      opacity: project.boxes.length <= 1 ? 0.5 : 1,
                      fontSize: 12,
                    }}
                    aria-label="Remover caixote"
                    title="Remover"
                    disabled={project.boxes.length <= 1}
                  >
                    🗑
                  </button>
                </div>
              </div>

              {isSelected ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={microTextStyle}>Ferragens</div>
                    {box.ferragens.length === 0 ? (
                      <div style={microTextStyle}>Sem ferragens associadas.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {box.ferragens.map((item) => (
                          <div
                            key={item.id}
                            style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}
                          >
                            <span style={{ color: "var(--text-main)" }}>{item.nome}</span>
                            <span style={{ color: "var(--text-muted)" }}>x{item.quantidade}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {rows.length === 0 ? (
                    <div style={microTextStyle}>Nenhuma peça calculada para este caixote.</div>
                  ) : (
                    <div
                      style={{
                        maxHeight: 260,
                        overflowY: "auto",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: 12,
                        }}
                      >
                        <thead
                          style={{
                            position: "sticky",
                            top: 0,
                            background: "rgba(15,23,42,0.98)",
                            zIndex: 1,
                          }}
                        >
                          <tr>
                            <th style={{ padding: "6px 4px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>
                              Peça
                            </th>
                            <th style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>
                              Largura
                            </th>
                            <th style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>
                              Altura
                            </th>
                            <th style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>
                              Prof.
                            </th>
                            <th style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>
                              Esp.
                            </th>
                            <th style={{ padding: "6px 4px", textAlign: "center", color: "var(--text-muted)", fontWeight: 600 }}>
                              Qtd
                            </th>
                            <th style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>
                              Preço
                            </th>
                            <th style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((item) => (
                            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td style={{ padding: "6px 4px", color: "var(--text-main)", fontWeight: 600 }}>
                                {item.nome}
                              </td>
                              <td style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-main)" }}>
                                {item.largura} mm
                              </td>
                              <td style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-main)" }}>
                                {item.altura} mm
                              </td>
                              <td style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-main)" }}>
                                {item.profundidade} mm
                              </td>
                              <td style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-main)" }}>
                                {item.espessura} mm
                              </td>
                              <td style={{ padding: "6px 4px", textAlign: "center", color: "var(--text-main)" }}>
                                {item.quantidade}
                              </td>
                              <td style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-main)" }}>
                                {item.precoUnitario !== undefined ? `${item.precoUnitario.toFixed(2)} €` : "-"}
                              </td>
                              <td style={{ padding: "6px 4px", textAlign: "right", color: "var(--text-main)" }}>
                                {item.precoTotal !== undefined ? `${item.precoTotal.toFixed(2)} €` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div style={microTextStyle}>Clique para ver peças, ferragens e detalhes.</div>
              )}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
