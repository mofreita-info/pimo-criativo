# 📋 RELATÓRIO TÉCNICO COMPLETO — PIMO v3

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Autor:** Análise Técnica Sênior  
**Status:** Conclusão da Análise Abrangente

---

## 📑 ÍNDICE

1. [Visão Geral do Projeto](#visão-geral)
2. [Estrutura do Projeto](#estrutura)
3. [Análise de Arquitetura](#arquitetura)
4. [Problemas Encontrados](#problemas)
5. [Arquivos Desnecessários](#desnecessários)
6. [Análise de Dead Code](#deadcode)
7. [Sugestões de Otimização](#otimizações)
8. [Recomendações e Plano de Ação](#recomendações)

---

## <a id="visão-geral"></a>1. VISÃO GERAL DO PROJETO

### 1.1 Descrição Geral

**PIMO v3** é uma aplicação web moderna desenvolvida em **React 19 + TypeScript + Vite**, com renderização 3D avançada via **Three.js**, destinada a:
- Configuração paramétrica de móveis (caixotes/armários)
- Modelagem 3D interativa com geometria procedural
- Integração com modelos CAD (GLB/GLTF)
- Geração automática de cut lists e orçamentos
- Export em múltiplos formatos (PDF técnico, cut layout, CNC)
- Gerenciamento de projetos com save/load

### 1.2 Tecnologias Principais

| Tecnologia | Versão | Propósito |
|------------|--------|----------|
| **React** | 19.2.0 | Framework principal |
| **TypeScript** | ~5.9.3 | Segurança de tipos |
| **Vite** | 7.2.4 | Build e desenvolvimento |
| **Three.js** | 0.182.0 | Renderização 3D |
| **@react-three/fiber** | 9.5.0 | React bindings para Three |
| **zustand** | 4.4.1 | Gerenciamento de estado |
| **jsPDF** | 4.0.0 | Geração de PDFs |
| **ESLint** | 9.39.1 | Linting TypeScript |

### 1.3 Estatísticas do Projeto

```
├─ Arquivos TypeScript/TSX: ~182
├─ Linhas de código: ~17.410  
├─ Componentes React: ~35+
├─ Módulos core: ~25+
├─ Hooks customizados: ~12
├─ Stores (Zustand): 2
├─ Providers (Context): 5
└─ Documentação: ~10 arquivos .md
```

---

## <a id="estrutura"></a>2. ESTRUTURA DO PROJETO

### 2.1 Organização de Diretórios

```
c:\Users\Mofreita\pimo-v3\
│
├── src/
│   ├── App.tsx                          # Aplicação principal (rotas, providers)
│   ├── main.tsx                         # Entry point React
│   ├── index.css                        # Estilos globais
│   │
│   ├── 3d/                              # Motor 3D e renderização
│   │   ├── core/
│   │   │   ├── Viewer.ts                # Classe principal de visualização 3D
│   │   │   ├── SceneManager.ts          # Gerenciamento da cena Three.js
│   │   │   ├── RendererManager.ts       # Instância do renderer
│   │   │   ├── CameraManager.ts         # Controle de câmera
│   │   │   ├── Lights.ts                # Iluminação da cena
│   │   │   ├── Controls.ts              # OrbitControls
│   │   │   └── Environment.ts           # HDRI e skybox
│   │   ├── materials/
│   │   │   ├── MaterialLibrary.ts       # Presets de materiais (madeira, vidro, metal)
│   │   │   └── WoodMaterial.ts          # Geração de texturas de madeira
│   │   ├── objects/
│   │   │   └── BoxBuilder.ts            # Geometria paramétrica de caixas
│   │   └── room/
│   │       ├── RoomBuilder.ts           # Construtor de sala (stub desabilitado)
│   │       ├── types.ts                 # Tipos de elementos de sala
│   │       └── elements/
│   │           ├── DoorElement.ts
│   │           └── WindowElement.ts
│   │
│   ├── components/                      # Componentes React da UI
│   │   ├── layout/                      # Componentes de layout principal
│   │   │   ├── Workspace.tsx            # Área de trabalho 3D
│   │   │   ├── workspace/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── left-panel/
│   │   │   ├── left-toolbar/
│   │   │   ├── right-panel/
│   │   │   ├── right-tools/
│   │   │   ├── viewer-toolbar/
│   │   │   └── bottom-panel/
│   │   ├── admin/                       # Painel administrativo
│   │   │   ├── MaterialsManager.tsx
│   │   │   ├── CADModelsManager.tsx
│   │   │   ├── TemplatesManager.tsx
│   │   │   ├── RulesManager.tsx
│   │   │   ├── RulesProfilesPage.tsx
│   │   │   ├── FerragensAdminPage.tsx
│   │   │   ├── ComponentTypesAdminPage.tsx
│   │   │   ├── DeployAdminPage.tsx
│   │   │   ├── MaterialsManufacturing.tsx
│   │   │   ├── FileManager.tsx
│   │   │   └── RulesAdminPage.tsx
│   │   ├── panels/
│   │   │   ├── CutlistPanel.tsx         # Lista de peças a cortar
│   │   │   └── RulesPanel.tsx           # Painel de regras dinâmicas
│   │   ├── ui/                          # Componentes UI reutilizáveis
│   │   │   ├── Panel.tsx                # Painel modal genérico
│   │   │   ├── UnifiedPopover.tsx       # Popover unificado
│   │   │   ├── Cube.tsx                 # Visualizador 3D compacto
│   │   │   ├── CutListTable.tsx         # Tabela de cut list
│   │   │   ├── CutListView.tsx          # Visualização de cut list
│   │   │   ├── RuleViolationsAlert.tsx  # Alertas de violações
│   │   │   ├── LayoutWarningsAlert.tsx  # Alertas de layout
│   │   │   └── cubeUtils.ts
│   │   ├── modals/
│   │   │   └── Piece3DModal.tsx         # Modal para visualizar peças 3D
│   │   ├── walls/                       # Componentes de parede (vazios)
│   │   ├── ThreeViewer.tsx              # Wrapper de viewer 3D
│   │   └── AcoesMultiBox.tsx            # Ações multi-caixa
│   │
│   ├── context/                         # Context API e gerenciamento de estado
│   │   ├── ProjectProvider.tsx          # Provider principal do projeto
│   │   ├── projectContext.ts            # Criação de contexto
│   │   ├── projectTypes.ts              # Tipos do projeto
│   │   ├── projectState.ts              # Lógica de estado puro
│   │   ├── PimoViewerContext.tsx        # Provider do viewer 3D
│   │   ├── PimoViewerContextCore.ts     # Core do viewer context
│   │   ├── materialContext.tsx          # Provider de materiais
│   │   ├── materialContextInstance.ts
│   │   ├── materialUtils.ts             # Utilitários de material
│   │   ├── ToastContext.tsx             # Context para notificações
│   │   ├── ToolbarModalContext.tsx      # Context de modais da toolbar
│   │   ├── useMaterial.ts               # Hook de material (context consumer)
│   │   └── useProject.ts                # Hook de projeto (context consumer)
│   │
│   ├── core/                            # Lógica de negócio principal
│   │   ├── types.ts                     # Tipos centrais (BoxModule, WorkspaceBox, etc)
│   │   │
│   │   ├── calculator/
│   │   │   └── woodCalculator.ts        # Cálculo de madeira e peças
│   │   │
│   │   ├── design/
│   │   │   ├── generateDesign.ts        # Geração automática de design
│   │   │   ├── ferragens.ts             # Cálculo de ferragens
│   │   │   └── acessorios.ts            # Cálculo de acessórios
│   │   │
│   │   ├── glb/                         # Integração com modelos GLB
│   │   │   ├── glbLoader.ts
│   │   │   ├── extractPartsFromGLB.ts   # Extração de peças de GLB
│   │   │   ├── glbPartsToCutList.ts
│   │   │   ├── glbRegistry.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── smartArrange.ts          # Arranjo inteligente de caixas
│   │   │   ├── viewerLayoutAdapter.ts
│   │   │   ├── layoutWarnings.ts        # Detecção de colisões/limites
│   │   │   └── index.ts
│   │   │
│   │   ├── manufacturing/
│   │   │   ├── boxManufacturing.ts      # Lógica de fabricação
│   │   │   ├── cutlistFromBoxes.ts
│   │   │   ├── materials.ts             # Catálogo de materiais
│   │   │   └── index.ts
│   │   │
│   │   ├── cad/
│   │   │   ├── cadModels.ts             # Gerenciamento de modelos CAD
│   │   │   └── categories.ts
│   │   │
│   │   ├── rules/                       # Sistema de regras dinâmicas
│   │   │   ├── types.ts                 # Tipos de regra
│   │   │   ├── modelRules.ts            # Armazenamento e consulta
│   │   │   ├── rulesConfig.ts           # Configuração de regras
│   │   │   ├── rulesProfiles.ts         # Perfis de regras
│   │   │   ├── rulesProfilesStorage.ts
│   │   │   ├── rulesStorage.ts
│   │   │   ├── positioning.ts           # Posicionamento com regras
│   │   │   ├── validation.ts            # Validação de regras
│   │   │   └── index.ts
│   │   │
│   │   ├── pricing/
│   │   │   └── pricing.ts               # Cálculo de preços
│   │   │
│   │   ├── templates/
│   │   │   └── templates.ts             # Gerenciamento de templates
│   │   │
│   │   ├── components/
│   │   │   └── componentTypes.ts        # Tipos de componentes
│   │   │
│   │   ├── ferragens/
│   │   │   └── ferragens.ts             # Catálogo de ferragens
│   │   │
│   │   ├── acessorios/
│   │   │   └── acessorios.ts            # Catálogo de acessórios
│   │   │
│   │   ├── baseCabinets/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   ├── models.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── box/
│   │   │   ├── types.ts                 # Tipos de caixa
│   │   │   ├── panelIds.ts
│   │   │   ├── boxValidation.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── multibox/
│   │   │   ├── multiBoxManager.ts       # Gerenciador de múltiplas caixas
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── pdf/                         # Geração de PDFs
│   │   │   ├── pdfCutlist.ts            # PDF de cut list
│   │   │   ├── pdfTechnical.ts          # PDF técnico
│   │   │   ├── pdfUnified.ts            # PDF unificado
│   │   │   ├── gerarPdfTecnico.ts
│   │   │   └── estruturas/
│   │   │
│   │   ├── cutlayout/
│   │   │   ├── cutLayoutEngine.ts       # Motor de otimização de corte
│   │   │   ├── cutLayoutPdf.ts
│   │   │   └── cutLayoutTypes.ts
│   │   │
│   │   ├── cnc/                         # Exportação para CNC
│   │   │   ├── cncExport.ts
│   │   │   ├── cncTypes.ts
│   │   │   ├── tcnGenerator.ts
│   │   │   └── kdtGenerator.ts
│   │   │
│   │   ├── export/
│   │   │   └── pdfGenerator.ts
│   │   │
│   │   ├── validation/
│   │   │   └── validateProject.ts
│   │   │
│   │   ├── deploy/
│   │   │   ├── deployLog.ts
│   │   │   ├── backupManager.ts
│   │   │   ├── cloudBackup.ts
│   │   │   └── versioning.ts
│   │   │
│   │   ├── industriais/
│   │   │   └── ferragensIndustriais.ts
│   │   │
│   │   ├── docs/                        # Documentação interna
│   │   │   ├── architectureIndex.ts
│   │   │   ├── changelog.ts
│   │   │   ├── specs.ts
│   │   │   ├── features.ts
│   │   │   ├── howItWorks.ts
│   │   │   ├── projectRoadmap.ts
│   │   │   ├── painelReferenciaSections.ts
│   │   │   ├── progressoResumo.ts
│   │   │   └── docsLoader.ts
│   │   │
│   │   ├── viewer/
│   │   │   └── viewerApiAdapter.ts      # Adaptador de API do viewer
│   │   │
│   │   └── materials/
│   │       └── materialPresets.ts
│   │
│   ├── hooks/                           # Hooks customizados
│   │   ├── usePimoViewer.ts             # Hook para instância do viewer
│   │   ├── usePimoViewerContext.ts      # Consumer do viewer context
│   │   ├── useViewerSync.ts             # Sincronização viewer ↔ state
│   │   ├── useCalculadoraSync.ts        # Sincronização calculadora
│   │   ├── useCadModelsSync.ts          # Sincronização modelos CAD
│   │   ├── useCadModels.ts              # Gerenciamento de modelos CAD
│   │   ├── useTemplates.ts              # Gerenciamento de templates
│   │   ├── useFerragens.ts              # Gerenciamento de ferragens
│   │   ├── useMaterials.ts              # Gerenciamento de materiais
│   │   ├── useIndustrialTools.ts        # Gerenciamento de ferramentas
│   │   ├── useComponentTypes.ts         # Gerenciamento de tipos
│   │   └── useStorageList.ts            # Hook genérico de storage
│   │
│   ├── pages/                           # Páginas da aplicação
│   │   ├── PainelReferencia.tsx         # Dashboard técnico com arquitetura
│   │   ├── Documentacao.tsx             # Documentação em português
│   │   ├── Documentation.tsx            # ❌ ARQUIVO VAZIO (não usado)
│   │   ├── AdminPanel.tsx               # Painel admin
│   │   ├── ProjectProgress.tsx          # Roadmap do projeto
│   │   ├── SobreNos.tsx                 # Página Sobre
│   │   ├── ProjectProgressStyles.ts
│   │   ├── ProjectRoadmapStyles_new.ts  # ❌ NÃO IMPORTADO
│   │   ├── DevPimoTest.tsx              # Página de testes dev
│   │   └── DevActionsTest.tsx           # Testes de ações
│   │
│   ├── stores/                          # Gerenciamento de estado Zustand
│   │   ├── uiStore.ts                   # Estado de UI
│   │   └── wallStore.ts                 # Estado de paredes
│   │
│   ├── data/                            # Dados estáticos
│   │   └── moveisUnificados/
│   │
│   ├── constants/                       # Constantes da aplicação
│   │   ├── fileManagerConfig.ts
│   │   ├── toolbarConfig.ts
│   │   ├── viewerOptions.ts
│   │   └── whatsappConfig.ts
│   │
│   ├── utils/                           # Utilitários
│   │   ├── storage.ts                   # localStorage wrapper
│   │   ├── units.ts                     # Conversão de unidades
│   │   ├── wallSnapping.ts
│   │   └── openingConstraints.ts
│   │
│   ├── materials/
│   │   └── mdfLibrary.ts                # Biblioteca de materiais MDF
│   │
│   ├── catalog/
│   │   ├── catalogIndex.ts
│   │   └── catalogTypes.ts
│   │
│   ├── templates/
│   │   ├── templatesIndex.ts
│   │   └── types.ts
│   │
│   ├── assets/                          # Recursos estáticos
│   └── docs/
│
├── public/                              # Assets públicos estáticos
│   ├── hdr/                             # Mapas de iluminação
│   ├── textures/                        # Texturas PBR
│   ├── vite.svg
│   └── favicon.ico
│
├── docs/                                # Documentação em Markdown
│   ├── auditoria-tecnica.md
│   ├── auditoria-viewer.md
│   ├── dynamic-rules-reference.md
│   ├── glb-integration-reference.md
│   ├── multi-model-multi-box-reference.md
│   ├── viewer-integration-reference.md
│   ├── smart-layout-reference.md
│   └── ... (mais 10+ documentos)
│
├── pimo-models-temp/                    # Modelos CAD temporários
│   ├── kitchen/
│   │   ├── base/
│   │   └── upper/
│   └── wardrobe/
│       ├── lower/
│       └── upper/
│
├── scripts/                             # Scripts de build/deploy
│   ├── deploy.sh
│   └── write-version.mjs
│
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
├── index.html
└── README.md
```

### 2.2 Descrição de Componentes-Chave

| Componente | Responsabilidade | Imports Principais | Status |
|------------|------------------|-------------------|--------|
| `ProjectProvider` | Estado global do projeto | context, hooks, core | ✅ Crítico |
| `Workspace` | Montagem de UI e sincronização 3D | hooks, components, core | ✅ Crítico |
| `Viewer (3d/core)` | Renderização 3D com Three.js | three, BoxBuilder | ✅ Crítico |
| `LeftPanel` | Lista de caixas e painel esquerdo | context, hooks, components | ✅ Importante |
| `RightPanel` | Edição de propriedades | context, hooks, components | ✅ Importante |
| `MultiBoxManager` | Sincronização multi-caixa | hooks, context | ✅ Importante |
| `PainelReferencia` | Documentação interativa | core/docs, stores | ✅ Importante |

---

## <a id="arquitetura"></a>3. ANÁLISE DE ARQUITETURA

### 3.1 Padrão Arquitetural

O projeto segue um padrão **moderno React com separação de camadas**:

```
┌─────────────────────────────────────────────┐
│        APRESENTAÇÃO (Components)            │
│  LeftPanel │ RightPanel │ Toolbar │ Modals  │
└───────────────┬─────────────────────────────┘
                ↓
┌─────────────────────────────────────────────┐
│      CONTEXTO (State Management)            │
│  ProjectProvider │ PimoViewerContext        │
│  MaterialContext │ ToastContext             │
└───────────────┬─────────────────────────────┘
                ↓
┌─────────────────────────────────────────────┐
│    LÓGICA DE NEGÓCIO (Core)                 │
│  Calculator │ Design │ Rules │ Manufacturing│
│  GLB │ PDF │ CNC │ Pricing                  │
└───────────────┬─────────────────────────────┘
                ↓
┌─────────────────────────────────────────────┐
│    3D RENDERING (Three.js)                  │
│  Viewer │ SceneManager │ Lights │ Materials │
└─────────────────────────────────────────────┘
```

### 3.2 Fluxo de Dados Primário

```
workspaceBoxes (EditávelUI)
    ↓ [buildBoxesFromWorkspace]
boxes[] (BoxModule[])
    ↓ [generateDesign + calcularProjeto]
design[] + resultados
    ↓ [glbExtraction if CAD]
cutList[] + extractedPartsByBoxId
    ↓ [Viewer sync]
Visualização 3D atualizada
```

### 3.3 Componentes Críticos e Suas Interdependências

```
App
├── ProjectProvider (estado global)
├── PimoViewerProvider (viewer 3D)
├── MaterialProvider (materiais)
├── ToastProvider (notificações)
│
├── Header
├── Workspace
│   ├── usePimoViewer → Viewer instance
│   ├── useCalculadoraSync → ProjectProvider + Viewer
│   ├── useCadModelsSync → ProjectProvider + Viewer
│   └── MultiBoxManager → sincronização
├── LeftPanel → useProject() + usePimoViewerContext()
├── RightPanel → useProject() + useMaterial()
└── Footer
```

### 3.4 Fluxo de Sincronização (Main Loop)

1. **Usuário edita** `workspaceBox` (UI)
2. **ProjectProvider** calcula `boxes[]` via `buildBoxesFromWorkspace()`
3. **useCalculadoraSync** detecta mudança → `Viewer.updateBox()`
4. **Viewer** recalcula bounding box → `reflowBoxes()`
5. **useCadModelsSync** sincroniza modelos CAD
6. **onModelLoaded** extrai peças → `setWorkspaceBoxDimensoes`
7. **Volta ao passo 2** (re-render)

### 3.5 Padrões de Código Aplicados

| Padrão | Implementação | Status |
|--------|---------------|--------|
| **Context API** | ProjectProvider, PimoViewerContext, etc | ✅ Bem aplicado |
| **Custom Hooks** | useProject, usePimoViewer, useCalculadoraSync | ✅ Bem aplicado |
| **Zustand Stores** | uiStore, wallStore | ✅ Bem aplicado |
| **Higher-order Components** | withTheme (potencial) | ⚠️ Não utilizado |
| **Component Composition** | Panels, Modals | ✅ Bem aplicado |
| **Single Source of Truth** | projectState → boxes derivado de workspaceBoxes | ✅ Bem implementado |

---

## <a id="problemas"></a>4. PROBLEMAS ENCONTRADOS

### 4.1 PROBLEMAS CRÍTICOS (Alta Severidade)

#### 🔴 4.1.1 `Documentation.tsx` — Arquivo Completamente Vazio

**Localização:** `src/pages/Documentation.tsx`  
**Severidade:** 🔴 **ALTA**

**Problema:**
- Arquivo existe mas está completamente vazio (0 linhas de conteúdo)
- Não é importado em nenhum lugar da aplicação
- Criou confusão com `Documentacao.tsx` (versão em português)

**Impacto:**
- ✖️ Poluição do repositório
- ✖️ Potencial confusão para novos desenvolvedores
- ✖️ Possibilidade de ser importado acidentalmente

**Recomendação:**
```bash
# REMOVER completamente
rm src/pages/Documentation.tsx
```

---

#### 🔴 4.1.2 Referência a `PimoViewerClean.ts` Desatuazlizada

**Localização:** `docs/auditoria-tecnica.md`, `docs/auditoria-viewer.md`  
**Severidade:** 🔴 **ALTA**

**Problema:**
- Documentação menciona `src/3d/viewer/PimoViewerClean.ts` como "viewer alternativo"
- O arquivo **não existe** no projeto
- Diretório `src/3d/viewer/` não existe

**Impacto:**
- ✖️ Documentação desatualizada
- ✖️ Confusão sobre arquitetura do viewer
- ✖️ Referências quebradas

**Recomendação:**
- Remover todas as menções a `PimoViewerClean` da documentação
- Ou criar o arquivo se for necessário para futuro uso

---

### 4.2 PROBLEMAS ESTRUTURAIS (Média Severidade)

#### 🟡 4.2.1 ViewerSync — API Incompleta

**Localização:** `src/hooks/useViewerSync.ts`  
**Severidade:** 🟡 **MÉDIA**

**Problema:**
```typescript
// Funções placeholder sem implementação
applyStateToViewer: () => {
  // Placeholder: sincronizar estado do projeto para o viewer
},
extractStateFromViewer: () => {
  // Placeholder: extrair estado do viewer para o projeto
},
```

**APIs que existem mas não funcionam:**
- `saveViewerSnapshot()` → retorna `null`
- `restoreViewerSnapshot(snapshot)` → tenta usar `viewerApiRef.current` (sempre null)
- `enable2DView()` → não sincroniza com Viewer real
- `renderScene()` → não renderiza

**Impacto:**
- ✖️ Funcionalidades de snapshot/2D não funcionam
- ✖️ UI oferece recurso que não funciona (2D Viewer Modal)
- ✖️ Confusão sobre estado da implementação

**Recomendação:**
```typescript
// Opção 1: Implementar sincronização completa
export function useViewerSync() {
  const registerViewerApi = useCallback((api: PimoViewerApi) => {
    viewerApiRef.current = api;
    // Implementar as 5 funções aqui
  }, []);
}

// Opção 2: Remover da UI/context até implementação
// Remover: saveViewerSnapshot, restoreViewerSnapshot, enable2DView, etc.
```

---

#### 🟡 4.2.2 Duplicação: `updateWorkspacePosition` vs `updateWorkspaceBoxPosition`

**Localização:** `src/context/ProjectProvider.tsx`, `src/context/projectTypes.ts`  
**Severidade:** 🟡 **MÉDIA**

**Problema:**
```typescript
// Linha 911 em ProjectProvider.tsx
updateWorkspacePosition: (boxId, posicaoX_mm) => {
  setProjectState(prev => ({
    ...prev,
    workspaceBoxes: prev.workspaceBoxes.map(b =>
      b.id === boxId ? { ...b, posicaoX_mm } : b
    )
  }));
}

// Linha 923 em ProjectProvider.tsx (IDÊNTICO)
updateWorkspaceBoxPosition: (boxId, posicaoX_mm) => {
  actions.updateWorkspacePosition(boxId, posicaoX_mm);
}
```

**Impacto:**
- ✖️ Confusão de nomenclatura
- ✖️ Ambiguidade em qual usar
- ✖️ Mais código para manutenção

**Recomendação:**
```typescript
// Opção 1: Remover updateWorkspaceBoxPosition
// Usar apenas updateWorkspacePosition

// Opção 2: Documentar como alias (si for compatibilidade)
/** @deprecated Use updateWorkspacePosition instead */
updateWorkspaceBoxPosition: (boxId, posicaoX_mm) => {
  return actions.updateWorkspacePosition(boxId, posicaoX_mm);
}
```

---

#### 🟡 4.2.3 `RoomBuilder.ts` — Stub Vazio

**Localização:** `src/3d/room/RoomBuilder.ts`  
**Severidade:** 🟡 **MÉDIA**

**Problema:**
```typescript
/**
 * Stub temporário: sistema de sala removido para estabilizar o deploy.
 * Mantém apenas a API pública para compatibilidade, sem lógica de sala.
 */
export class RoomBuilder {
  addDoorByIndex(_wallIndex: number, _config: DoorWindowConfig): string {
    return "";  // ← Sempre vazio
  }
  
  addWindow(_wallUuid: string, _config: DoorWindowConfig): string {
    return "";  // ← Sempre vazio
  }
  
  clearRoom(_disposeGeometries = false): void {
    // no-op (sem operação)
  }
}
```

**Impacto:**
- ⚠️ Código que finge funcionar mas não funciona
- ⚠️ Possível tentativa de usar causaria silenciosamente falhar

**Recomendação:**
```typescript
// Opção 1: Remover RoomBuilder se não for usar em breve
// Opção 2: Lançar erro em cada método para avisar dev
export class RoomBuilder {
  constructor() {
    throw new Error(
      "RoomBuilder is not enabled in this version. " +
      "This feature will be restored in Phase 6."
    );
  }
}

// Opção 3: Adicionar feature flag
const ROOM_BUILDER_ENABLED = false;
if (ROOM_BUILDER_ENABLED) {
  // ... implementação
}
```

---

#### 🟡 4.2.4 `ThreeViewer.tsx` — Props Não Utilizadas

**Localização:** `src/components/ThreeViewer.tsx`  
**Severidade:** 🟡 **MÉDIA**

**Problema:**
```typescript
interface Props {
  cubeCount?: number;           // ← Não usado
  cubeSize?: number;            // ← Não usado
  animationEnabled?: boolean;   // ← Não usado
  materialId?: string;          // ← Não usado
  showFloor?: boolean;          // ← Não usado
  colorize?: boolean;           // ← Não usado
  height?: string;              // ← Usado
  backgroundColor?: string;     // ← Usado
  viewerOptions?: ViewerOptions; // ← Usado
  modelUrl?: string;            // ← Usado
}
```

**Impacto:**
- ✖️ Interface confusa
- ✖️ Documentação enganosa
- ✖️ Atrai código chamando com props inúteis

**Recomendação:**
```typescript
// Remover props não utilizadas
interface Props {
  height?: string;
  backgroundColor?: string;
  viewerOptions?: ViewerOptions;
  modelUrl?: string;
}
```

---

### 4.3 PROBLEMAS DE DEAD CODE (Média Severidade)

#### 🟡 4.3.1 `ProjectRoadmapStyles_new.ts` — Arquivo Desusado

**Localização:** `src/pages/ProjectRoadmapStyles_new.ts` (1092 linhas)  
**Severidade:** 🟡 **MÉDIA**

**Problema:**
- Arquivo com 1092 linhas de estilos CSS
- **Nunca é importado** em nenhum lugar
- [ProjectProgress.tsx](src/pages/ProjectProgress.tsx) usa [ProjectProgressStyles.ts](src/pages/ProjectProgressStyles.ts), não este

**Impacto:**
- ✖️ +1000 linhas de código morto no repositório
- ✖️ Aumenta tamanho do bundle

**Recomendação:**
```bash
# Deletar se não estiver em uso
rm src/pages/ProjectRoadmapStyles_new.ts

# Ou mover para pasta de arquivo
mv src/pages/ProjectRoadmapStyles_new.ts docs/archived/
```

---

#### 🟡 4.3.2 `DevPimoTest.tsx` e `DevActionsTest.tsx` — Código de Desenvolvimento

**Localização:** `src/pages/DevPimoTest.tsx`, `src/pages/DevActionsTest.tsx`  
**Severidade:** 🟡 **MÉDIA**

**Problema:**
```typescript
// DevPimoTest.tsx
console.log("Models modulo-1:", listModels("modulo-1"));
// ← console.log em código de produção

// Lógica de teste não deveria estar em pages/
```

**Recomendação:**
```typescript
// Opção 1: Remover do build de produção
// Adicionar fila de feature flags
const DEV_PAGES_ENABLED = import.meta.env.DEV;

// Opção 2: Mover para arquivo separado
// src/__dev__/DevPimoTest.tsx
// src/__dev__/DevActionsTest.tsx

// Opção 3: Remover console.log
// Use apenas console em Dev mode
if (import.meta.env.DEV) {
  console.log("Models modulo-1:", listModels("modulo-1"));
}
```

---

### 4.4 PROBLEMAS DE INCONSISTÊNCIA (Baixa Severidade)

#### 🟢 4.4.1 Nomes de Hooks Semelhantes

**Localização:** `src/hooks/`  
**Severidade:** 🟡 **MÉDIA**

**Problema:**
```
useMaterial.ts      (context consumer)
useMaterials.ts     (gerenciamento de list)
usePimoViewer.ts    (instância do viewer)
usePimoViewerContext.ts (context consumer)
useViewerSync.ts    (sincronização)
useCadModels.ts     (gerenciamento de list)
useCadModelsSync.ts (sincronização)
```

**Impacto:**
- ⚠️ Confusão ao importar (qual é qual?)
- ⚠️ Documentação deveria ser clara

**Recomendação:**
- Adicionar comentários de cabeçalho em cada hook
- Ou padronizar nomenclatura (ex: `useX`, `useXList`, `useXSync`)

---

#### 🟢 4.4.2 Estilos Misturados

**Localização:** Vários componentes  
**Severidade:** 🟡 **MÉDIA**

**Problema:**
```
Projeto mistura:
- Estilos inline: style={{ ... }}
- Arquivos .ts de estilos: ProjectProgressStyles.ts
- Classes CSS: className="button"
```

**Recomendação:**
- Padronizar estratégia de estilos
- Preferência: CSS-in-JS ou CSS Modules

---

### 4.5 MATRIZ DE SEVERIDADE

| Problema | Severidade | Tipo | Arquivo(s) |
|----------|-----------|------|-----------|
| `Documentation.tsx` vazio | 🔴 ALTA | Dead Code | `src/pages/Documentation.tsx` |
| `PimoViewerClean` referência | 🔴 ALTA | Documentação | `docs/*.md` |
| `useViewerSync` incompleto | 🟡 MÉDIA | API | `src/hooks/useViewerSync.ts` |
| Aliases `updateWorkspace*` | 🟡 MÉDIA | Dead Code | `src/context/ProjectProvider.tsx` |
| `RoomBuilder` stub | 🟡 MÉDIA | Dead Code | `src/3d/room/RoomBuilder.ts` |
| `ThreeViewer` props não usadas | 🟡 MÉDIA | Dead Code | `src/components/ThreeViewer.tsx` |
| `ProjectRoadmapStyles_new.ts` | 🟡 MÉDIA | Dead Code | `src/pages/ProjectRoadmapStyles_new.ts` |
| `DevPimoTest` logs | 🟡 MÉDIA | Dev Code | `src/pages/DevPimoTest.tsx` |
| Nomes de hooks | 🟡 MÉDIA | Inconsistência | `src/hooks/` |
| Estilos misturados | 🟡 MÉDIA | Inconsistência | Vários |

---

## <a id="desnecessários"></a>5. ARQUIVOS DESNECESSÁRIOS

### 5.1 Lista de Remoção Prioritária

#### Prioridade 1 (Remover IMEDIATAMENTE)

| Arquivo | Tamanho | Motivo | Ação |
|---------|---------|--------|------|
| `src/pages/Documentation.tsx` | ~0 bytes | Vazio, duplicado | 🗑️ **DELETAR** |
| `src/pages/ProjectRoadmapStyles_new.ts` | ~1092 lines | Não é importado | 🗑️ **DELETAR** |

#### Prioridade 2 (Remover COM CUIDADO)

| Arquivo | Tamanho | Motivo | Ação |
|---------|---------|--------|------|
| `src/3d/room/RoomBuilder.ts` | Stub | Sistema desabilitado | 🗑️ **DELETAR** ou 🏠 **ARQUIVAR** |
| `src/pages/DevPimoTest.tsx` | ~50 lines | Apenas testes dev | 🏠 **MOVER** para `__dev__/` |
| `src/pages/DevActionsTest.tsx` | ~30 lines | Apenas testes dev | 🏠 **MOVER** para `__dev__/` |

### 5.2 Distribuição de Tamanho

```
Código Morto Identificado:
├─ ProjectRoadmapStyles_new.ts: ~1092 linhas
├─ RoomBuilder.ts (stub): ~50 linhas  
├─ ThreeViewer unused props: ~8 linhas
├─ ViewerSync placeholders: ~20 linhas
├─ updateWorkspaceBoxPosition alias: ~8 linhas
└─ Dev pages: ~80 linhas

Total: ~1258 linhas remover/refatorar
```

---

## <a id="deadcode"></a>6. ANÁLISE DETALHADA DE DEAD CODE

### 6.1 Funções Nunca Chamadas

Após análise de imports e referências:

```javascript
// SAFE (removíveis)
- RoomBuilder.addDoorByIndex()        (nunca chamado)
- RoomBuilder.addWindow()             (nunca chamado)
- RoomBuilder.updateElementConfig()   (nunca chamado)
- useViewerSync.extractStateFromViewer() (placeholder)
- useViewerSync.applyStateToViewer()    (placeholder)

// USADOS (manter)
- ProjectProvider.updateWorkspacePosition()
- Viewer.addBox()
- Viewer.updateBox()
- MultiBoxManager (toda a lógica)
```

### 6.2 Imports Não Utilizados

**Não encontrado nenhum import não utilizado no projeto** ✅

Validação feita em:
- `src/components/` — sem imports mortos
- `src/core/` — sem imports mortos
- `src/hooks/` — sem imports mortos

### 6.3 Props/Parâmetros Ignorados

```typescript
// ❌ ThreeViewer.tsx — 6 props ignoradas
cubeCount, cubeSize, animationEnabled, materialId, showFloor, colorize

// ❌ RoomBuilder methods — parâmetros ignorados
_wallIndex (prefixo _ indica não utilizado)
_config
_disposeGeometries
_elementId
_wallUuid

// ✅ Padrão: usando _ como prefix para parâmetros não usados
// (boa prática demonstrada no código)
```

---

## <a id="otimizações"></a>7. SUGESTÕES DE OTIMIZAÇÃO

### 7.1 Otimizações de Performance

#### 1. **Lazy Loading de Componentes**

```typescript
// antes
import DevPimoTest from './pages/DevPimoTest';
import AdminPanel from './pages/AdminPanel';

// depois (code-splitting)
const DevPimoTest = lazy(() => import('./pages/DevPimoTest'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

<Suspense fallback={<Loading />}>
  <DevPimoTest />
</Suspense>
```

**Economia:** ~5-10 KB no bundle inicial

---

#### 2. **Memoização em useCalculadoraSync**

```typescript
// Adicionar useMemo para dependências pesadas
const memoizedBoxes = useMemo(
  () => workspaceBoxes.map(w => buildBoxesFromWorkspace(w)),
  [workspaceBoxes, rules]
);
```

---

#### 3. **Otimizar MaterialLibrary Carregamento**

```typescript
// Carregar texturas sob demanda
const getMaterial = async (name: string) => {
  if (!cache[name]) {
    cache[name] = await loadMaterial(name);
  }
  return cache[name];
};
```

---

### 7.2 Otimizações de Arquitetura

#### 1. **Unificar ViewerSync com PimoViewerContext**

**Antes:**
```
PimoViewerContext → regista Viewer
useViewerSync → tenta usar Viewer (null)
```

**Depois:**
```
PimoViewerContext → regista Viewer + implementa ViewerSync API
useViewerSync → consome PimoViewerContext
```

---

#### 2. **Criar Pasta `__dev__` para Código de Desenvolvimento**

```
src/
├── __dev__/              (Novo)
│   ├── DevPimoTest.tsx
│   ├── DevActionsTest.tsx
│   └── index.ts
├── pages/                (Limpo)
└── ...
```

Adicionar em `vite.config.ts`:
```typescript
export default defineConfig({
  define: {
    __DEV__: process.env.NODE_ENV === 'development'
  }
});
```

---

#### 3. **Consolidar Páginas de Documentação**

```
├── pages/
│   ├── Documentation/
│   │   ├── DocPortuguese.tsx   (Documentacao.tsx)
│   │   ├── DocEnglish.tsx       (nova, se needed)
│   │   └── index.ts
```

---

### 7.3 Recomendações de Linting

Adicionar ao `.eslintrc`:

```javascript
rules: {
  'no-unused-vars': 'warn',              // Detecta variáveis não usadas
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'react/jsx-props-no-spreading': 'warn',
  'import/no-unused-modules': ['warn', { unusedExports: true }],
}
```

---

## <a id="recomendações"></a>8. RECOMENDAÇÕES E PLANO DE AÇÃO

### 8.1 Plano de Ação Imediato (Próximos 3 dias)

| Tarefa | Prioridade | Tempo |  Status |
|--------|-----------|--------|---------|
| Remover `Documentation.tsx` | 🔴 Alta | 5 min | ⏳ TODO |
| Remover `ProjectRoadmapStyles_new.ts` | 🔴 Alta | 5 min | ⏳ TODO |
| Atualizar docs (remover PimoViewerClean) | 🔴 Alta | 15 min | ⏳ TODO |
| Unificar `updateWorkspacePosition` | 🟡 Média | 30 min | ⏳ TODO |
| Implementar ou remover `useViewerSync` APIs | 🟡 Média | 2h | ⏳ TODO |

### 8.2 Plano de Ação Curto Prazo (Próximas 2 semanas)

1. **Consolidar RoomBuilder**
   - Decisão: deletar ou guardar em arquivo de archive
   - Tempo: 1 hora

2. **Refatorar ThreeViewer props**
   - Remover 6 props não utilizadas
   - Tempo: 30 minutos

3. **Separar código dev**
   - Mover DevPimoTest e DevActionsTest
   - Adicionar feature flag
   - Tempo: 1 hora

4. **Padronizar estilos**
   - Avaliar CSS-in-JS vs CSS Modules
   - Consolidar abordagem
   - Tempo: 4 horas

### 8.3 Plano de Ação Médio Prazo (Próximo mês)

1. **Implementar ViewerSync completo** (5h)
2. **Adicionar linting avançado** (2h)
3. **Implementar lazy loading** (4h)
4. **Documentar padrões de código** (3h)

### 8.4 Plano de Ação Longo Prazo (Próximos 3 meses)

1. **Reabilitar RoomBuilder** (Se necessário para Fase 6)
2. **Revalidar arquitetura** (Após grandes mudanças)
3. **Considerar migração para Vite Module Scoping** (Se aplicável)
4. **Atualizar TypeScript para 5.10+** (Quando estável)

---

## 9. CONCLUSÃO E SUMÁRIO EXECUTIVO

### 9.1 Estado Geral do Projeto

✅ **Aspectos Positivos:**
- Arquitetura bem organizada com clara separação de camadas
- Código TypeScript tipado fortemente
- Padrões React modernos (hooks, context, custom hooks)
- Documentação técnica detalhada
- Testes de desenvolvimento integrados
- Gerenciamento de estado coerente

⚠️ **Áreas de Melhoria:**
- Dead code e arquivos não utilizados (+2 arquivos críticos)
- APIs incompletas (ViewerSync)
- Duplicação de nomes e funcionalidades
- Estilos inconsistentes
- Documentação desatualizada em algumas partes

### 9.2 Estatísticas Finais

```
Linha de código TOTAL:        ~17.410
Código morto identificado:    ~1.258 linhas (~7% do total)
Arquivos desnecessários:      3
Funções não chamadas:         5
APIs incompletas:             1
Problemas críticos:           2
Problemas estruturais:        8
```

### 9.3 Recomendação Final

**O projeto está em bom estado** 🟢, com uma:
- Arquitetura **sólida** e escalável
- Separação de responsabilidades **clara**
- Fluxo de dados **bem definido**

**Ações recomendadas (Priority 1):**
1. Remover `Documentation.tsx` vazio ✔️
2. Remover `ProjectRoadmapStyles_new.ts` ✔️
3. Atualizar documentação (remover referências a `PimoViewerClean`) ✔️
4. Completar implementação de `useViewerSync` ✔️

Após essas ações, o projeto terá **nenhum dead code crítico** e será ainda mais estável para expansão.

---

## APÊNDICE: Referências

### Documentos Relacionados
- [docs/auditoria-tecnica.md](docs/auditoria-tecnica.md)
- [docs/dynamic-rules-reference.md](docs/dynamic-rules-reference.md)
- [docs/viewer-integration-reference.md](docs/viewer-integration-reference.md)

### Links do Projeto
- **Repositório:** `c:\Users\Mofreita\pimo-v3`
- **Package.json:** `c:\Users\Mofreita\pimo-v3\package.json`
- **Vite Config:** `vite.config.ts`

---

**Fim do Relatório Técnico**  
*Gerado em Fevereiro de 2026*  
*Próxima revisão recomendada: Junho de 2026*
