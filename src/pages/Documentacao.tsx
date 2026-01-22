import Panel from "../components/ui/Panel";
import { changelog } from "../core/docs/changelog";
import { specs } from "../core/docs/specs";
import { howItWorks } from "../core/docs/howItWorks";
import { features } from "../core/docs/features";

const sectionTitleStyle = {
  fontSize: 16,
  fontWeight: 700,
  color: "var(--text-main)",
  marginBottom: 10,
};

const bodyTextStyle = {
  fontSize: 12,
  color: "var(--text-main)",
  lineHeight: 1.7,
  whiteSpace: "pre-wrap" as const,
};

export default function Documentacao() {
  return (
    <main
      style={{
        flex: 1,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        background: "radial-gradient(circle at top, #1e293b, #0b0f17 60%)",
        overflowY: "auto",
        scrollBehavior: "smooth",
      }}
    >
      <Panel title="Documentação do Sistema">
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Referência interna do PIMO‑Criativo
        </div>
      </Panel>

      <Panel>
        <div style={sectionTitleStyle}>Changelog</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {changelog.map((item, index) => (
            <div key={`${item.data}-${index}`} style={{ fontSize: 12, color: "var(--text-main)" }}>
              <span style={{ color: "var(--text-muted)" }}>[{item.data}]</span> {item.descricao}
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div style={sectionTitleStyle}>Especificações Técnicas</div>
        <div style={bodyTextStyle}>{specs}</div>
      </Panel>

      <Panel>
        <div style={sectionTitleStyle}>Como o Sistema Funciona</div>
        <div style={bodyTextStyle}>{howItWorks}</div>
      </Panel>

      <Panel>
        <div style={sectionTitleStyle}>O que o Sistema Oferece</div>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 12,
            color: "var(--text-main)",
          }}
        >
          {features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Panel>
    </main>
  );
}
