/**
 * Página de Progresso do Projeto - Project Progress & Documentation
 * Exibe explicação completa sobre construção do projeto, recursos completados, em andamento e planejados
 */

import { useMemo } from "react";
import { useProject } from "../context/useProject";
import { projectProgressStyles } from "./ProjectProgressStyles";

const PROJECT_SECTIONS = [
  {
    id: "core-foundation",
    title: "1. Fundação Principal do Projeto",
    description: "Infraestrutura básica do aplicativo",
    status: "completed" as const,
    items: [
      { label: "React 19 + TypeScript", status: "completed" },
      { label: "Vite como ferramenta de compilação", status: "completed" },
      { label: "Sistema de gestão de estado centralizado (Context API)", status: "completed" },
      { label: "Armazenamento de dados em localStorage", status: "completed" },
    ],
  },
  {
    id: "viewer-3d",
    title: "2. Motor de Visualização 3D (3D Viewer)",
    description: "Sistema de visualização e interação com modelos tridimensionais",
    status: "in-progress" as const,
    items: [
      { label: "Three.js como motor de renderização", status: "completed" },
      { label: "Exibição de modelos GLB", status: "completed" },
      { label: "Iluminação e sombras básicas", status: "completed" },
      { label: "Ferramentas de controle (Move, Rotate, Select)", status: "in-progress" },
      { label: "Sistema de materiais PBR (Physically Based Rendering)", status: "in-progress" },
      { label: "Simulação HDRI e iluminação avançada", status: "planned" },
      { label: "Vistas bidimensionais (2D Views)", status: "completed" },
    ],
  },
  {
    id: "layout-system",
    title: "3. Sistema de Layout Dinâmico (Layout System)",
    description: "Arranjo de caixas e componentes no espaço",
    status: "in-progress" as const,
    items: [
      { label: "Criação de novas caixas", status: "completed" },
      { label: "Cálculo automático de dimensões e posições", status: "completed" },
      { label: "Detecção de colisões entre objetos", status: "in-progress" },
      { label: "Otimização de layout inteligente", status: "planned" },
    ],
  },
  {
    id: "ui-components",
    title: "4. Interface do Usuário (UI Components)",
    description: "Interfaces, painéis e componentes visuais",
    status: "completed" as const,
    items: [
      { label: "Painel esquerdo (Left Panel) com abas", status: "completed" },
      { label: "Ferramentas direita (Right Tools Bar)", status: "completed" },
      { label: "Barra de ferramentas superior (Header/Toolbar)", status: "completed" },
      { label: "Cores e design (Dark Theme)", status: "completed" },
      { label: "Responsividade e adaptação (Responsive Design)", status: "in-progress" },
    ],
  },
  {
    id: "calculations",
    title: "5. Cálculos de Corte e Custos",
    description: "Cálculo de listas de corte, preços e materiais",
    status: "completed" as const,
    items: [
      { label: "Algoritmo de cálculo de peças", status: "completed" },
      { label: "Lista de corte (Cut List)", status: "completed" },
      { label: "Cálculo automático de preços", status: "completed" },
      { label: "Cálculo de desperdício e materiais", status: "in-progress" },
      { label: "Relatórios detalhados em PDF", status: "completed" },
    ],
  },
  {
    id: "catalog",
    title: "6. Sistema de Catálogo e Modelos",
    description: "Biblioteca de móveis, acessórios e modelos predefinidos",
    status: "in-progress" as const,
    items: [
      { label: "Índice de catálogo (Catalog Index)", status: "completed" },
      { label: "Tipos de dados para produtos", status: "completed" },
      { label: "Modelos de móveis prontos (Templates)", status: "completed" },
      { label: "Gestão de modelos personalizados", status: "in-progress" },
      { label: "Biblioteca avançada de acessórios", status: "planned" },
    ],
  },
  {
    id: "export-import",
    title: "7. Exportação e Importação",
    description: "Salvamento e carregamento de projetos e arquivos",
    status: "in-progress" as const,
    items: [
      { label: "Salvamento de projetos em localStorage", status: "completed" },
      { label: "Carregamento de projetos salvos", status: "completed" },
      { label: "Exportação PDF avançada", status: "planned" },
      { label: "Exportação de imagens (renderização 3D)", status: "in-progress" },
      { label: "Exportação de arquivos CAD", status: "planned" },
    ],
  },
  {
    id: "admin-deploy",
    title: "8. Sistema de Administração e Publicação",
    description: "Ferramentas de administração e atualizações automáticas",
    status: "completed" as const,
    items: [
      { label: "Painel de controle administrativo (Admin Panel)", status: "completed" },
      { label: "Sistema de versionamento (Versioning)", status: "completed" },
      { label: "Histórico de publicação (Deploy Log)", status: "completed" },
      { label: "Publicação automática (CI/CD)", status: "in-progress" },
      { label: "Monitoramento de erros e atualizações", status: "in-progress" },
    ],
  },
  {
    id: "documentation",
    title: "9. Documentação e Referências",
    description: "Referências abrangentes sobre o sistema e engenharia",
    status: "completed" as const,
    items: [
      { label: "Painel de referências (Painel de Referência)", status: "completed" },
      { label: "Explicação da arquitetura do programa", status: "completed" },
      { label: "Documentação da API do Viewer", status: "in-progress" },
      { label: "Exemplos práticos e casos de uso", status: "planned" },
    ],
  },
];

const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  completed: {
    label: "✓ Concluído",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  "in-progress": {
    label: "⚙ Em Andamento",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  planned: {
    label: "→ Planejado",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
};

export default function ProjectProgress() {
  const { project } = useProject();

  const stats = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let planned = 0;

    PROJECT_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        if (item.status === "completed") completed++;
        else if (item.status === "in-progress") inProgress++;
        else if (item.status === "planned") planned++;
      });
    });

    const total = completed + inProgress + planned;
    const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, inProgress, planned, total, completionPercent };
  }, []);

  const formattedChangelog = useMemo(
    () =>
      project.changelog
        .slice(0, 15)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .map((entry) => ({
          ...entry,
          time: new Date(entry.timestamp).toLocaleString("pt-PT"),
        })),
    [project.changelog]
  );

  return (
    <main style={projectProgressStyles.main}>
      {/* Header Section */}
      <section style={projectProgressStyles.header}>
        <div style={projectProgressStyles.headerContent}>
          <h1 style={projectProgressStyles.title}>Progresso do Projeto</h1>
          <p style={projectProgressStyles.subtitle}>
            Acompanhamento abrangente da construção e desenvolvimento do PIMO Studio
          </p>
        </div>

        {/* Progress Stats */}
        <div style={projectProgressStyles.statsContainer}>
          <div style={projectProgressStyles.statBox}>
            <div style={{ ...projectProgressStyles.statNumber, color: "#22c55e" }}>
              {stats.completed}
            </div>
            <div style={projectProgressStyles.statLabel}>Concluído</div>
          </div>
          <div style={projectProgressStyles.statBox}>
            <div style={{ ...projectProgressStyles.statNumber, color: "#3b82f6" }}>
              {stats.inProgress}
            </div>
            <div style={projectProgressStyles.statLabel}>Em Andamento</div>
          </div>
          <div style={projectProgressStyles.statBox}>
            <div style={{ ...projectProgressStyles.statNumber, color: "#f59e0b" }}>
              {stats.planned}
            </div>
            <div style={projectProgressStyles.statLabel}>Planejado</div>
          </div>
          <div style={projectProgressStyles.statBox}>
            <div style={{ ...projectProgressStyles.statNumber, color: "#8b5cf6" }}>
              {stats.completionPercent}%
            </div>
            <div style={projectProgressStyles.statLabel}>Conclusão</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={projectProgressStyles.progressBar}>
          <div
            style={{
              ...projectProgressStyles.progressFill,
              width: `${stats.completionPercent}%`,
            }}
          />
        </div>
      </section>

      {/* Sections */}
      <section style={projectProgressStyles.sectionsContainer}>
        {PROJECT_SECTIONS.map((section) => (
          <div key={section.id} style={projectProgressStyles.sectionCard}>
            <div style={projectProgressStyles.sectionHeader}>
              <h2 style={projectProgressStyles.sectionTitle}>{section.title}</h2>
              <p style={projectProgressStyles.sectionDesc}>{section.description}</p>
            </div>

            <div style={projectProgressStyles.itemsList}>
              {section.items.map((item, idx) => {
                const config = STATUS_CONFIG[item.status];
                return (
                  <div
                    key={idx}
                    style={{
                      ...projectProgressStyles.item,
                      borderLeftColor: config.color,
                      backgroundColor: config.bgColor,
                    }}
                  >
                    <div style={projectProgressStyles.itemContent}>
                      <div style={projectProgressStyles.itemLabel}>{item.label}</div>
                      <div
                        style={{
                          ...projectProgressStyles.itemStatus,
                          color: config.color,
                        }}
                      >
                        {config.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Changelog Section */}
      <section style={projectProgressStyles.changelogSection}>
        <h2 style={projectProgressStyles.changelogTitle}>Últimas Atualizações Automáticas</h2>
        <div style={projectProgressStyles.changelogList}>
          {formattedChangelog.length > 0 ? (
            formattedChangelog.map((entry, idx) => (
              <div key={idx} style={projectProgressStyles.changelogItem}>
                <div style={projectProgressStyles.changelogTime}>{entry.time}</div>
                <div style={projectProgressStyles.changelogMessage}>{entry.message}</div>
              </div>
            ))
          ) : (
            <div style={projectProgressStyles.noChangelog}>Nenhuma atualização ainda</div>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <section style={projectProgressStyles.footerInfo}>
        <div style={projectProgressStyles.infoBox}>
          <h3 style={projectProgressStyles.infoTitle}>🚀 Sobre o Projeto</h3>
          <p style={projectProgressStyles.infoText}>
            PIMO Studio é um sistema integrado para design e planejamento de móveis tridimensionais com cálculos detalhados de custos e materiais.
            Foi construído usando as tecnologias mais modernas como React 19, Three.js e TypeScript, com foco em desempenho e facilidade de uso.
          </p>
        </div>
        <div style={projectProgressStyles.infoBox}>
          <h3 style={projectProgressStyles.infoTitle}>📊 Estatísticas</h3>
          <p style={projectProgressStyles.infoText}>
            Total de recursos: {stats.total} | Funcional: {stats.completed} | Em desenvolvimento: {stats.inProgress} |
            Planejado: {stats.planned}
          </p>
        </div>
      </section>
    </main>
  );
}
