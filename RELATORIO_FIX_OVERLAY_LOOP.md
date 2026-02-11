# Correção: "Maximum update depth exceeded" no Workspace (overlay)

**Data:** 11 de fevereiro de 2025  
**Ficheiro:** `src/components/layout/workspace/Workspace.tsx`  
**Erro:** Loop infinito de atualizações causado pelo `useEffect` e pelo callback `updateOverlayPosition`.

---

## 1. Causa exata do loop infinito

- O **`updateOverlayPosition`** era um `useCallback` com dependências **`lastSelectedBoxId`**, **`lastDimensions`**, **`lastOverlayPosition`** (além de `isSelectMode`, `project.selectedWorkspaceBoxId`, `viewerSync`).
- Dentro do callback, ao detetar mudança, era chamado **`setLastSelectedBoxId`**, **`setLastDimensions`**, **`setLastOverlayPosition`** (state).
- O **`useEffect`** dependia de **`[isSelectMode, updateOverlayPosition]`** e chamava `updateOverlayPosition()`.
- Sequência do loop:
  1. `useEffect` corre → chama `updateOverlayPosition()`.
  2. O callback chama `setLast*` → re-render.
  3. Re-render → novo `updateOverlayPosition` (porque `last*` mudaram).
  4. `useEffect` volta a correr (dependência `updateOverlayPosition` mudou) → volta ao passo 1.

Ou seja: **state usado como cache (“last”) estava nas dependências do callback; atualizar esse state recriava o callback e re-executava o `useEffect`, causando o loop.**

---

## 2. Linhas alteradas

- **~294–330 (bloco do overlay):**  
  - Removidos os **states** `lastSelectedBoxId`, `lastDimensions`, `lastOverlayPosition`.  
  - Criados **refs** `lastBoxIdRef`, `lastDimensionsRef`, `lastOverlayPositionRef` para guardar o último valor (sem provocar re-render).  
  - Adicionado **`rafIdRef`** para guardar o id do `requestAnimationFrame` e permitir cancelamento.  
  - **`updateOverlayPosition`** passou a:  
    - Ler o box id de **`projectRef.current.selectedWorkspaceBoxId`** (em vez de `project.selectedWorkspaceBoxId`).  
    - Comparar com os valores em **refs** e, só em caso de mudança, chamar `setSelectedBoxDimensions` / `setSelectedBoxOverlayPosition` e atualizar as **refs** (em vez de `setLast*`).  
    - Agendar o próximo frame com **`requestAnimationFrame`**, guardando o id em `rafIdRef` e cancelando o frame anterior quando agendar um novo.  
  - Dependências do **`useCallback`** reduzidas a **`[isSelectMode, viewerSync]`** (estáveis; sem `last*` nem `project`).  
- **~331–336 (`useEffect`):**  
  - **Cleanup** do `useEffect`: **`cancelAnimationFrame(rafIdRef.current)`** e `rafIdRef.current = null`, para não deixar o rAF ativo após desmontar ou quando `isSelectMode` deixa de ser verdadeiro.

---

## 3. useEffect e callback finais

- **`updateOverlayPosition`** (resumo):
  - Dependências: **`[isSelectMode, viewerSync]`**.
  - Usa **refs** para último box id, dimensões e posição; usa **`projectRef.current`** para o box id atual.
  - Só chama **setState** (`setSelectedBoxDimensions`, `setSelectedBoxOverlayPosition`) quando há mudança real; atualiza as refs em vez de state para o cache.
  - Agenda **um** `requestAnimationFrame` por ciclo, cancelando o anterior e guardando o id em **`rafIdRef`**.

- **`useEffect`** (resumo):
  - Dependências: **`[isSelectMode, updateOverlayPosition]`**.
  - Se `isSelectMode`, chama `updateOverlayPosition()` uma vez.
  - **Cleanup:** `cancelAnimationFrame(rafIdRef.current)` e `rafIdRef.current = null`.

Com isso, o callback deixa de ser recriado por causa do “last” e o `useEffect` deixa de ser re-executado em loop; o rAF só continua a ser agendado quando há mudança e é cancelado no cleanup.

---

## 4. Confirmação

- **TypeScript:** `npx tsc --noEmit` — **OK**.
- **Comportamento:** O overlay de dimensões continua a ser atualizado quando há mudança de caixa selecionada, dimensões ou posição no ecrã; não há setState por frame quando nada muda e o rAF é cancelado no cleanup, pelo que o erro **“Maximum update depth exceeded”** deixa de ocorrer.
