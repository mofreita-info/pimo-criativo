# Relatório de Limpeza de Código Morto e Arquivos Não Utilizados

**Data:** 11 de fevereiro de 2025  
**Projeto:** pimo-v3  
**Objetivo:** Remoção segura de código morto, arquivos não referenciados e ajustes de lint (unused vars / prefer-const).

---

## 1. Arquivos removidos

| Arquivo | Motivo |
|--------|--------|
| `src/pages/Documentation.tsx` | Arquivo vazio (0 bytes), não importado; a aplicação usa `Documentacao.tsx` na rota `/documentacao`. |
| `src/pages/ProjectRoadmapStyles_new.ts` | ~1.092 linhas não referenciadas em nenhum módulo (estilos alternativos nunca utilizados). |
| `src/core/docs/docsLoader.ts` | Módulo não importado em nenhum lugar; tipos e constantes (`TechnicalDocSection`, `TECHNICAL_SECTIONS`, `getDoc`) não utilizados. |
| `src/core/pdf/estruturas/ferragensIndustriaisPdf.ts` | Módulo preparado para “Fase 6”, nunca importado; funções `prepararFerragensIndustriaisParaPdf` e `exportarFerragensIndustriaisParaPdf` não referenciadas. |

---

## 2. Trechos de código morto / melhorias aplicadas

### 2.1 Parâmetros não utilizados (prefixo `_` ou remoção)

- **GerarArquivoModal.tsx:** tipo da prop `onConfirm`: parâmetro `opcoes` → `_opcoes`.
- **CameraViewMenu.tsx:** tipo da prop `onSelect`: parâmetro `preset` → `_preset`.
- **Tools3DToolbar.tsx:** tipo da prop `onToolSelect`: parâmetros `toolId`, `eventKey` → `_toolId`, `_eventKey`.
- **LeftPanel.tsx:** blocos `catch (e)` → `catch { }` (binding omitido, sem variável não utilizada).
- **UnifiedPopover.tsx:** tipo inline do callback `onChange`: parâmetro `v` → `_v`.
- **ToastContext.tsx:** tipo `ToastContextValue.showToast`: parâmetros `text`, `type`, `duration` → `_text`, `_type`, `_duration`.
- **ToolbarModalContext.tsx:** tipo `openModal`: parâmetro `type` → `_type`.
- **uiStore.ts:** interface: `setSelectedTool(toolId)` → `_toolId`, `setSelectedObject(selected)` → `_selected`; `useUiStore(selector(state))` → `_state`.
- **wallStore.ts:** interface: parâmetros não utilizados em `removeWall`, `updateWall`, `setOpen`, `setMainWallIndex`, `applySnapping`, `setNumWalls`, `loadRoomConfig` e em `selectWall` prefixados com `_`; `useWallStore(selector(state))` → `_state`.

### 2.2 Prefer-const (variáveis nunca reatribuídas)

- **cutLayoutEngine.ts:** `let cursorX`, `let cursorY`, `let rowHeight` → `const` (apenas leitura no fluxo de colocação de peças).
- **openingConstraints.ts:** desestruturação de `clampOpeningToWall`: `floorOffsetMm` mantido como `const`; `horizontalOffsetMm` como `let` (reatribuído no loop); introduzida variável intermediária `opening` para evitar dupla chamada e deixar intent claro.

---

## 3. Melhorias aplicadas (resumo)

- Remoção de **4 arquivos** não referenciados (incluindo um com centenas de linhas).
- Ajuste de **parâmetros de tipos/interfaces e callbacks** para seguir a regra de “unused args” do ESLint (prefixo `_` ou omissão no `catch`).
- Uso de **const** onde a variável não é reatribuída (`cutLayoutEngine`, `openingConstraints`).
- Nenhuma alteração em **comportamento** de efeitos React ou em regras de arquitetura (setState em effect, react-refresh, etc.) para evitar risco de regressão.

---

## 4. Confirmação de build e TypeScript

- **TypeScript:** `npx tsc --noEmit` — **OK** (sem erros).
- **Build:** `npm run build` (Vite) — **OK** (compilação concluída com sucesso).
- **ESLint:** Permanecem avisos/erros em outros arquivos (setState em effect, react-refresh, no-constant-binary-expression, etc.); estes **não foram alterados** nesta limpeza para manter o escopo apenas em código morto e unused vars/prefer-const.

---

## 5. Arquivos modificados (sem remoção)

- `src/components/layout/right-panel/GerarArquivoModal.tsx`
- `src/components/layout/viewer-toolbar/CameraViewMenu.tsx`
- `src/components/layout/viewer-toolbar/Tools3DToolbar.tsx`
- `src/components/layout/left-panel/LeftPanel.tsx`
- `src/components/ui/UnifiedPopover.tsx`
- `src/context/ToastContext.tsx`
- `src/context/ToolbarModalContext.tsx`
- `src/stores/uiStore.ts`
- `src/stores/wallStore.ts`
- `src/core/cutlayout/cutLayoutEngine.ts`
- `src/utils/openingConstraints.ts`

---

**Conclusão:** A limpeza foi executada de forma conservadora, removendo apenas arquivos e trechos claramente não utilizados e corrigindo unused vars/prefer-const. O build e o TypeScript permanecem estáveis.
