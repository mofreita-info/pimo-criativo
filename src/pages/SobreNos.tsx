export default function SobreNos() {
  return (
    <main
      style={{
        flex: 1,
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "radial-gradient(circle at top, #1e293b, #0b0f17 60%)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 820,
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--radius)",
          padding: "22px 26px",
          color: "var(--text-main)",
          lineHeight: 1.7,
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>Sobre Nós</h1>

        <p>
          O PIMO Studio é uma plataforma inovadora desenvolvida para simplificar e modernizar o
          processo de criação, planeamento e produção de mobiliário modular. A aplicação permite
          gerar caixas, estruturas e módulos de forma rápida, precisa e totalmente adaptada às
          necessidades de cada utilizador.
        </p>

        <p>
          Com foco na eficiência e na clareza, o PIMO Studio combina cálculo automático,
          visualização 3D em tempo real e ferramentas de organização que facilitam o trabalho de
          marceneiros, designers, fabricantes e criadores independentes.
        </p>

        <p style={{ marginTop: 14, marginBottom: 8 }}>
          A plataforma está a evoluir continuamente, com várias funcionalidades planeadas para o
          futuro, incluindo:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>• Sistema completo de gestão de projetos</span>
          <span>• Biblioteca de módulos pré‑definidos</span>
          <span>• Importação de ficheiros técnicos (como SLDASM)</span>
          <span>• Ferramentas de montagem e agrupamento de caixas</span>
          <span>• Geração automática de listas de corte e ferragens</span>
          <span>• Integração com sistemas de produção e CNC</span>
          <span>• Visualização 3D avançada com materiais realistas</span>
          <span>• Exportação de projetos para PDF e formatos técnicos</span>
        </div>

        <p style={{ marginTop: 14 }}>
          O objetivo do PIMO Studio é tornar o processo de criação mais rápido, intuitivo e
          profissional, oferecendo uma experiência moderna e poderosa para quem trabalha com
          mobiliário e design.
        </p>
      </div>
    </main>
  );
}
