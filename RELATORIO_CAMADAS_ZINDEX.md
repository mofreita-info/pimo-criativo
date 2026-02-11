# Relatório: Correção da Arquitetura de Camadas (z-index)

**Data:** 11 de fevereiro de 2025  
**Projeto:** pimo-v3  
**Problema:** Área de visualização (Workspace/Canvas) renderizando acima de modais, popovers e UI, tornando-os inacessíveis.

---

## 1. Causa do problema

O elemento **`<main className="workspace-root">`** no `Workspace.tsx` tinha **`z-index: 99999`** (inline), criando um stacking context muito alto. Com isso:

- O **workspace inteiro** (incluindo o canvas 3D) ficava **acima** de todos os irmãos no layout.
- **Modais** (`.modal-overlay` com `z-index: 1300`) ficavam **atrás** do workspace, pois 1300 < 99999.
- **Popovers e menus** (z-index 1000 ou menos) também ficavam atrás.
- Painéis laterais (esquerda/direita) e a barra de ferramentas à esquerda não tinham z-index definido, então eram empilhados abaixo do workspace na ordem de pintura.

Ou seja: um **único z-index excessivo no container da área de visualização** fazia toda a UI (modais, popovers, painéis) ficar por baixo do canvas.

---

## 2. Arquivos modificados

| Arquivo | Alteração |
|--------|-----------|
| **`src/components/layout/workspace/Workspace.tsx`** | `workspace-root`: `zIndex: 99999` → `zIndex: 0`. Overlay de dimensões (`.dimensions-overlay`): `zIndex: 9999` → `zIndex: 10` (apenas acima do canvas dentro do workspace). |
| **`src/App.tsx`** | Painel esquerdo: adicionado `zIndex: 1` no `style` do `div.panel-shell-left`. Painel direito: adicionado `position: "relative"` e `zIndex: 1` no `div.panel-shell-right`. LeftToolbar: envolvido em um `div` com `position: "relative"` e `zIndex: 1`. Comentário no JSX indicando que o Workspace fica na camada inferior. |

Nenhum outro ficheiro foi alterado. **`.modal-overlay`** (z-index: 1300) e **popovers** (z-index: 1000) em `index.css` / componentes permanecem como estavam e passam a funcionar corretamente porque o workspace deixou de estar acima deles.

---

## 3. Hierarquia final de camadas (de baixo para cima)

| Camada | Elemento(s) | z-index | Observação |
|--------|-------------|---------|------------|
| **Fundo** | `workspace-root` (área de visualização + canvas 3D) | **0** | Integrada ao layout; não cobre mais a UI. |
| **Dentro do workspace** | Overlay de dimensões (caixa selecionada) | 10 | Só acima do canvas, dentro do mesmo stacking context. |
| **UI normal** | LeftToolbar, painel esquerdo, painel direito | **1** | Acima do workspace; popovers/menus dentro dos painéis ficam acima do canvas. |
| **Popovers / menus** | UnifiedPopover, CameraViewMenu, Tools3DToolbar dropdowns, footer menu | 1000 | Já existentes; passam a aparecer porque o workspace está em 0. |
| **Modais** | `.modal-overlay` (GerarArquivoModal, RightToolsBar modals, Piece3DModal) | 1300 | Sem alteração; ficam no topo. |
| **Toasts** | ToastContext container | 10000 | Sem alteração. |
| **WhatsApp** | WhatsAppButton | 9999 | Sem alteração. |

Regra prática: **área de visualização em 0, UI em 1, overlays/menus em 1000+, modais em 1300+.**

---

## 4. Confirmação

- **Modais:** `.modal-overlay` com `position: fixed` e `z-index: 1300` continua a ser o topo da pilha no viewport; o workspace em 0 deixa de os tapar. **Modais passam a aparecer acima da área de visualização.**
- **Popovers e menus:** Com o workspace em 0 e os painéis (e LeftToolbar) em 1, os popovers e menus que são filhos dos painéis ou da toolbar ficam no mesmo stacking context da UI e com z-index 1000 nos componentes; deixam de ficar atrás do canvas. **Popovers e menus passam a funcionar normalmente.**
- **ThreeViewer / Canvas:** Apenas se alterou o `z-index` do **container** (`workspace-root`) para 0; o canvas e a lógica do Viewer não foram tocados. O overlay de dimensões foi reduzido de 9999 para 10 **dentro** do workspace, mantendo-se acima do canvas. **Nenhuma alteração quebra o funcionamento do ThreeViewer.**

**Build:** `npm run build` e `npx tsc --noEmit` executados com sucesso após as alterações.
