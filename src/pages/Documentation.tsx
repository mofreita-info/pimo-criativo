import { useEffect, useMemo, useState } from "react";
import Panel from "../components/ui/Panel";
import { useProject } from "../context/ProjectProvider";

type DocStat = {
  label: string;
  value: number;
};

type DocSection = {
  title: string;
  description: string;
  internals: string;
  files: string[];
  interactions: string;
  notes?: string;
};

const rawFiles = import.meta.glob("/src/**/*.{ts,tsx,css,html}", {
  eager: true,
  as: "raw",
}) as Record<string, string>;

const computeStats = (boxCount: number): DocStat[] => {
  const filePaths = Object.keys(rawFiles);
  const totalFiles = filePaths.length;
  const totalLines = filePaths.reduce((sum, path) => {
    const content = rawFiles[path] ?? "";
    return sum + content.split(/\r?\n/).length;
  }, 0);
  const totalComponents = filePaths.filter(
    (path) => path.includes("/src/components/") && path.endsWith(".tsx")
  ).length;
  const totalCoreModules = filePaths.filter(
    (path) => path.includes("/src/core/") && path.endsWith(".ts")
  ).length;

  return [
    { label: "Linhas de código", value: totalLines },
    { label: "Arquivos", value: totalFiles },
    { label: "Componentes", value: totalComponents },
    { label: "Módulos core", value: totalCoreModules },
    { label: "Caixotes", value: boxCount },
  ];
};

const sections: DocSection[] = [
  {
    title: "Sistema de múltiplos caixotes",
    description: "Gerencia vários módulos independentes por projeto.",
    internals: "Cada caixote é um BoxModule com dimensões, espessura, prateleiras e cut list próprias.",
    files: ["src/core/types.ts", "src/context/ProjectProvider.tsx"],
    interactions: "UI seleciona caixote ativo e recalcula dados por módulo.",
  },
  {
    title: "Nome editável por caixote",
    description: "Permite renomear cada módulo.",
    internals: "O nome é armazenado no BoxModule e atualizado no ProjectProvider.",
    files: ["src/context/ProjectProvider.tsx", "src/components/layout/left-panel/LeftPanel.tsx"],
    interactions: "UI atualiza o estado e mantém seleção.",
  },
  {
    title: "Cálculo do caixote (costa fixa 10mm)",
    description: "Aplica espessura fixa de 10mm apenas no fundo.",
    internals: "As laterais e tampo/fundo usam a espessura do caixote; costa usa 10mm.",
    files: ["src/core/design/generateDesign.ts"],
    interactions: "Cut list alimenta pricing e exportação.",
  },
  {
    title: "Prateleiras com cálculo automático",
    description: "Permite qualquer número de prateleiras por caixote.",
    internals: "Cada prateleira gera uma peça com largura interna e espessura do caixote.",
    files: ["src/core/design/generateDesign.ts", "src/components/layout/left-panel/LeftPanel.tsx"],
    interactions: "Altera cut list e preço.",
  },
  {
    title: "Ferragens dinâmicas",
    description: "Suportes de prateleira são adicionados automaticamente.",
    internals: "Cada prateleira adiciona 4 suportes na lista de ferragens do caixote.",
    files: ["src/core/design/ferragens.ts", "src/context/ProjectProvider.tsx"],
    interactions: "Ferragens alimentam precificação e changelog.",
  },
  {
    title: "Cut list por caixote",
    description: "Cada módulo tem sua própria lista de cortes.",
    internals: "A geração ocorre por BoxModule e o PDF é gerado por caixote.",
    files: ["src/context/ProjectProvider.tsx", "src/core/pricing/pricing.ts"],
    interactions: "UI e exportação usam a cut list do caixote selecionado.",
  },
  {
    title: "Duplicar / remover / renomear caixotes",
    description: "Operações básicas de gestão de módulos.",
    internals: "ProjectProvider cria, duplica, remove e renomeia BoxModule.",
    files: ["src/context/ProjectProvider.tsx", "src/components/layout/left-panel/LeftPanel.tsx"],
    interactions: "Recalcula dados após cada ação.",
  },
  {
    title: "UI do LeftPanel e RightPanel",
    description: "Entradas de configuração e ações principais.",
    internals: "LeftPanel controla dados, RightPanel aciona geração e exibe resultados.",
    files: ["src/components/layout/left-panel/LeftPanel.tsx", "src/components/layout/right-panel/RightPanel.tsx"],
    interactions: "Conectado ao ProjectProvider.",
  },
  {
    title: "Theme system",
    description: "Troca de temas com context e seletor.",
    internals: "ThemeProvider expõe tema atual via hook.",
    files: ["src/theme/ThemeProvider.tsx", "src/hooks/useTheme.ts"],
    interactions: "Header e ThemeSwitcher controlam o tema.",
  },
  {
    title: "Estrutura 3D",
    description: "Cena 3D com câmera, luzes e controles separados.",
    internals: "ThreeScene orquestra conteúdo com subcomponentes.",
    files: ["src/components/3d/ThreeScene.tsx", "src/components/3d/SceneContent.tsx"],
    interactions: "Exibe estrutura gerada por caixote.",
  },
  {
    title: "Exportação PDF",
    description: "Gera relatório de cut list por caixote.",
    internals: "Itera pelos caixotes e monta páginas.",
    files: ["src/context/ProjectProvider.tsx"],
    interactions: "Usa jsPDF + autoTable.",
  },
  {
    title: "Painel de Referência",
    description: "Página de documentação interna com estatísticas e changelog.",
    internals: "Calcula métricas via import.meta.glob e registra eventos no ProjectProvider.",
    files: ["src/pages/Documentation.tsx", "src/context/ProjectProvider.tsx"],
    interactions: "Atualiza com botão de documentação e eventos do projeto.",
  },
];

export default function Documentation() {
  const { project, actions } = useProject();
  const [stats, setStats] = useState(() => computeStats(project.boxes.length));

  const formatDateTime = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const formattedChangelog = useMemo(
    () =>
      project.changelog
        .slice()
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .map((entry) => ({
          ...entry,
          time: formatDateTime(entry.timestamp),
        })),
    [project.changelog]
  );

  useEffect(() => {
    setStats(computeStats(project.boxes.length));
  }, [project.boxes, project.changelog.length]);

  const refreshDocumentation = () => {
    setStats(computeStats(project.boxes.length));
    actions.logChangelog("Documentação atualizada");
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)" }}>
          Painel de Referência
        </div>
        <button
          onClick={refreshDocumentation}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-main)",
            padding: "8px 12px",
            borderRadius: "var(--radius)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Atualizar Documentação
        </button>
      </div>

      <Panel title="Estatísticas do Projeto">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{stat.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Índice de Funcionalidades">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sections.map((section) => (
            <div key={section.title}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main)" }}>
                {section.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {section.description}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-main)", marginTop: 8 }}>
                {section.internals}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                Arquivos: {section.files.join(", ")}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                Interações: {section.interactions}
              </div>
              {section.notes && (
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  Observações: {section.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Changelog Automático">
        {formattedChangelog.length === 0 ? (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Nenhum evento registrado ainda.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {formattedChangelog.map((entry) => (
              <div key={entry.id} style={{ fontSize: 12, color: "var(--text-main)" }}>
                <span style={{ color: "var(--text-muted)" }}>[{entry.time}]</span> {entry.message}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
