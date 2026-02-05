# Correções finais – Cena 3D PIMO Studio

Implementação real aplicada. Lista de ficheiros, impacto e diff completo.

---

## 1. Lista dos ficheiros modificados

- `src/3d/core/Viewer.ts`
- `src/context/ProjectProvider.tsx`
- `src/components/layout/workspace/Workspace.tsx`
- `src/context/projectTypes.ts`
- `src/core/viewer/viewerApiAdapter.ts`
- `src/hooks/useViewerSync.ts`
- `src/context/PimoViewerContextCore.ts`
- `src/hooks/usePimoViewer.ts`

---

## 2. Explicação breve do impacto

| Correção | Impacto |
|----------|---------|
| **1) Dimensões no modo Selecionar** | Removido o bbox combinado. No modo Selecionar: só se mostra L/A/P da **caixa selecionada** e linhas 3D à volta dessa caixa. `updateDimensionsOverlay()` usa `selectedBoxId` e bbox do mesh da caixa. Nova API `getSelectedBoxDimensions()`. Workspace usa `getSelectedBoxDimensions()` e estado `selectedBoxDimensions`; overlay só com caixa selecionada. |
| **2) Grid 50×50 cm** | Chão: grid preto (0x000000), opacidade 0,2. Criados 3 grids de paredes (branco 0xffffff, 0,2): fundo (XY em z=-12,5), esquerda (YZ em x=-12,5), direita (YZ em x=12,5). Tamanho 25 m, 50 divisões. `createFloorAndWallGrids()`, dispose dos 4 grids. |
| **3) Lock (colisão)** | `applyCollisionConstraint` passa a correr até 8 iterações para remover toda a sobreposição em X, Y e Z. Sem lógica de Snap. Lock ON: impede interpenetração; Lock OFF: movimento livre. |
| **4) Adição de modelos** | ProjectProvider: em catálogo, CAD e duplicar define `posicaoY_mm = altura/2` (mm). X = rightmost + 100 mm, Z = 0 mantidos. Viewer: `updateBox` para cadOnly usa `position.y = height/2`. Posição inicial vem do estado (sync) para evitar “jump”. |
| **5) Estabilidade** | Posição inicial definida no ProjectProvider (posicaoX_mm, posicaoY_mm, posicaoZ_mm); sync envia-a no primeiro `addBox`. Reflow não altera caixas com `manualPosition`. Sem recálculo que mova a caixa após criação. |

---

## 3. Diff completo das mudanças

### Viewer.ts

**Grid: chão preto 20%, paredes brancas 20%**

- Propriedades: `backWallGrid`, `leftWallGrid`, `rightWallGrid` adicionados.
- `setGridVisible`: passa a mostrar/ocultar os 4 grids.
- `createFloorGrid` renomeado para `createFloorAndWallGrids`: chão preto 0,2; 3 GridHelpers para fundo e laterais (rotação e posição), branco 0,2.
- `dispose`: remove e faz dispose de `backWallGrid`, `leftWallGrid`, `rightWallGrid`.

**Dimensões só da caixa selecionada**

- Comentário do overlay alterado para “caixa selecionada”.
- `getSelectedBoxDimensions()`: novo método; devolve `{ width, height, depth }` da entrada `selectedBoxId` ou null.
- `updateDimensionsOverlay()`: deixa de usar `getCombinedBoundingBox()`; usa `selectedBoxId` e bbox do mesh dessa caixa para desenhar as linhas; se não houver seleção, esconde as linhas.

**Lock: colisão em ciclo**

- `applyCollisionConstraint`: ciclo `maxIterations = 8`; em cada iteração percorre as outras caixas, resolve sobreposição num eixo (menor overlap); repete até não haver sobreposição ou atingir 8 passagens.

**updateBox cadOnly**

- Em `dimensionsChanged` para `entry.cadOnly`, `entry.mesh.position.y = 0` substituído por `entry.mesh.position.y = height / 2`.

---

### ProjectProvider.tsx

**posicaoY_mm e posicaoZ_mm em novos modelos**

- `addWorkspaceBoxFromCatalog`: após `newBox.posicaoZ_mm = 0` define `newBox.posicaoY_mm = dimensoes.altura / 2`.
- `duplicateBox`: em `newBox` define `posicaoY_mm: (selected.dimensoes?.altura ?? 400) / 2` e `posicaoZ_mm: 0`.
- `addCadModelAsNewBox`: após `newBox.posicaoZ_mm = 0` define `newBox.posicaoY_mm = placeholderDimensoes.altura / 2`.

---

### Workspace.tsx

**Overlay com dimensões da caixa selecionada**

- Estado: `combinedDimensions` renomeado para `selectedBoxDimensions`.
- `useEffect` do intervalo: chama `viewerSync.getSelectedBoxDimensions()` em vez de `getCombinedBoundingBox()`.
- Overlay: condição `isSelectMode && selectedBoxDimensions`; texto usa `selectedBoxDimensions.width/height/depth`.

---

### projectTypes.ts

- Em `ViewerApi` e `ViewerSync`: adicionado `getSelectedBoxDimensions: () => { width: number; height: number; depth: number } | null`.

---

### viewerApiAdapter.ts

- `getSelectedBoxDimensions: () => pimoApi.getSelectedBoxDimensions?.() ?? null`.

---

### useViewerSync.ts

- `getSelectedBoxDimensions = useCallback(() => viewerApiRef.current?.getSelectedBoxDimensions?.() ?? null, [])`.
- Retorno do hook: incluído `getSelectedBoxDimensions`.

---

### PimoViewerContextCore.ts

- Em `PimoViewerApi`: `getSelectedBoxDimensions?: () => { width: number; height: number; depth: number } | null`.

---

### usePimoViewer.ts

- `getSelectedBoxDimensions = useCallback(() => viewerRef.current?.getSelectedBoxDimensions?.() ?? null, [])`.
- Incluído no objeto retornado e no array de dependências do useMemo.
