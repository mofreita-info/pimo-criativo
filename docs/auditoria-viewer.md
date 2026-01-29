# Auditoria completa: Viewer 3D e comportamento da câmera

## 1. Resumo técnico do projeto

- **Configurador 3D modular (pimo.pro)**
- **Viewer principal:** `src/3d/core/Viewer.ts` (não existe `src/3d/viewer/Viewer.ts`)
- **Sistema de caixas:** addBox, reflowBoxes, updateCameraTarget
- **Sincronização:** `useCalculadoraSync` (project.boxes → Viewer)
- **Inicialização:** `usePimoViewer(containerRef, options)` cria `new Viewer(container, options)` quando o container existe
- **Layout:** Workspace monta o container e passa `viewerOptions` do App (minDistance, maxDistance, etc.)
- **Referência limpa:** `src/3d/viewer/PimoViewerClean.ts` (viewer mínimo sem reflow/updateCameraTarget/updateCanvasSize em excesso)

---

## 2. Problemas encontrados

### Problema 1: **updateCameraTarget() chamado em todo updateBox()** (CRÍTICO)

- **Onde:** `Viewer.ts` — no fim de `updateBox()` havia `this.updateCameraTarget()` incondicional.
- **Causa:** `useCalculadoraSync` chama `viewerApi.updateBox(box.id, { width, height, depth, materialName })` para cada caixa sempre que o efeito roda (ex.: quando `viewerApi` ou `boxes` mudam). O `viewerApi` é recriado quando `selectedBoxId` ou outras deps do `usePimoViewer` mudam. Assim, ao selecionar outra caixa ou ao re-render, o sync roda de novo, chama `updateBox` para todas as caixas e **sempre** atualizava o target da câmera para o centro dos caixotes.
- **Efeito:** A câmera “resetava” sozinha: o usuário orbitava, o target era forçado de volta ao centro, o cubo saía do campo de visão ou a sensação era de reset.
- **Correção:** Chamar `updateCameraTarget()` em `updateBox()` **apenas quando o layout realmente mudou**, i.e. quando `widthChanged || indexChanged` (casos em que `reflowBoxes()` é chamado). Assim, mudanças só de altura, profundidade ou material não alteram mais o target.

### Problema 2: **reflowBoxes() não altera mais target** (já estava correto)

- **Estado:** Em auditorias anteriores foi removido `updateCameraTarget()` de dentro de `reflowBoxes()`.
- **Confirmação:** `reflowBoxes()` apenas reposiciona os meshes (cursorX, posição, updateMatrixWorld). Nenhuma linha altera `controls.target`, `camera.lookAt` ou chama `updateCameraTarget`. OK.

### Problema 3: **updateCanvasSize apenas em resize e primeiro frame** (já estava correto)

- **Estado:** `updateCanvasSize` é chamada só em:
  - `window.addEventListener("resize", this.updateCanvasSize)`
  - Uma vez no primeiro frame do loop de animação (`_initialCanvasSizeDone`).
- **Confirmação:** Não há listener `controls.addEventListener("change", updateCanvasSize)` nem chamadas em reflowBoxes/addBox/updateCameraTarget. OK.

### Problema 4: **setCameraFrontView reseta a câmera por design**

- **Onde:** `DevActionsTest.tsx` chama `viewerRef.current.setCameraFrontView()` no botão “Vista Frontal”.
- **Comportamento:** `setCameraFrontView()` reposiciona a câmera e chama `updateCameraTarget()`. É reset **intencional** ao clicar no botão. Nenhuma alteração necessária.

### Problema 5: **resizeObserver não utilizado**

- **Onde:** `Viewer.ts` declara `resizeObserver: ResizeObserver | null = null` e em `dispose()` chama `this.resizeObserver?.disconnect()`.
- **Estado:** Nenhum código chama `attachResizeObserver()` ou atribui a `resizeObserver`; o resize é feito só com `window.addEventListener("resize", ...)`. Código morto, sem impacto no bug da câmera. Opcional remover em limpeza futura.

### Problema 6: **useCalculadoraSync e frequência de updateBox**

- **Fluxo:** `useCalculadoraSync(project.boxes, viewerApi, ...)` tem efeito com deps `[boxes, syncFromCalculator]`; `syncFromCalculator` depende de `[viewerApi, materialName]`. Sempre que `viewerApi` muda (ex.: novo objeto do `useMemo` do `usePimoViewer`), o efeito roda e chama `addBox`/`updateBox`/`setBoxIndex`/`removeBox` para cada caixa.
- **Antes da correção:** Cada `updateBox` chamava `updateCameraTarget()`, gerando reset contínuo do target.
- **Depois da correção:** `updateCameraTarget()` só é chamado quando há `widthChanged || indexChanged`, então o target deixa de ser sobrescrito a cada sync sem mudança de layout.

### Problema 7: **Nenhum arquivo “duplicado” do Viewer**

- **Verificado:** Não existe `src/3d/viewer/Viewer.ts`. O viewer principal é único: `src/3d/core/Viewer.ts`. `PimoViewerClean.ts` é um viewer alternativo mínimo e não substitui o Viewer principal. ThreeViewer.tsx e Workspace usam o mesmo `Viewer` de `src/3d/core/Viewer.ts`.

### Problema 8: **useViewerSync e API inexistente**

- **Onde:** `useViewerSync.ts` usa `viewerApiRef.current?.restoreSnapshot`, `enable2DView`, `disable2DView`, `renderScene`, `saveSnapshot`.
- **Estado:** O `Viewer` em `src/3d/core/Viewer.ts` não expõe esses métodos. O contexto registra a API retornada por `usePimoViewer` (que é o Viewer). Assim, essas funções só funcionam se a API registrada tiver esses métodos (futuro). Não causa o bug da câmera nem reset indevido.

---

## 3. Arquivos modificados nesta auditoria

| Arquivo | Alteração |
|--------|------------|
| `src/3d/core/Viewer.ts` | Em `updateBox()`, substituído `this.updateCameraTarget()` incondicional por `if (widthChanged \|\| indexChanged) { this.updateCameraTarget(); }`. |

---

## 4. Trecho de código corrigido

**Antes (Viewer.ts, fim de updateBox):**

```ts
    if (heightChanged) {
      this.updateModelsVerticalPosition(entry);
    }
    this.updateCameraTarget();
    return true;
  }
```

**Depois:**

```ts
    if (heightChanged) {
      this.updateModelsVerticalPosition(entry);
    }
    if (widthChanged || indexChanged) {
      this.updateCameraTarget();
    }
    return true;
  }
```

---

## 5. Garantias após a correção

- **reflowBoxes:** Apenas reposiciona caixotes; não altera `controls.target`, `camera.lookAt` nem chama `updateCameraTarget`.
- **updateCanvasSize:** Apenas em `window` resize e no primeiro frame após o mount; não em eventos de câmera nem em reflow/addBox/updateCameraTarget.
- **updateCameraTarget:** Chamado apenas em:
  - Construtor (após criar controls),
  - addBox (após reflow),
  - updateBox **somente quando** `widthChanged || indexChanged`,
  - setBoxIndex (após reflow),
  - removeBox (após reflow),
  - setBoxGap (após reflow),
  - setCameraFrontView (ação explícita do usuário).
- Com isso, a câmera não é mais resetada por syncs ou por `updateBox` sem mudança de layout; o cubo deixa de “desaparecer” por target forçado ao centro a todo momento.

---

## 6. Fluxo verificado (resumo)

- **Workspace** → `usePimoViewer(containerRef, { skipInitialBox: true, ... })` → cria `Viewer` quando o container existe.
- **useCalculadoraSync(project.boxes, viewerApi, ...)** → ao mudar boxes/viewerApi, chama addBox/updateBox/setBoxIndex/removeBox/setBoxGap.
- **Viewer** → addBox/removeBox/setBoxIndex/setBoxGap chamam reflowBoxes e em seguida updateCameraTarget; updateBox chama updateCameraTarget **só** quando width ou index mudou.
- **Nenhum** listener de câmera chama updateCanvasSize; nenhum reflow chama updateCameraTarget de dentro de reflowBoxes.

---

## 7. Objetivo final atendido

- O Viewer principal passa a se comportar de forma estável em relação à câmera: sem reset indevido e sem sumiço do cubo causado por target sendo atualizado a cada `updateBox` de sync.
- O cubo não deve mais desaparecer por causa de target incorreto.
- A câmera não reseta sozinha; só em ações explícitas (ex.: “Vista Frontal”).
- Nenhuma lógica duplicada ou conflitante foi introduzida; apenas a condição de chamada de `updateCameraTarget()` em `updateBox()` foi restrita ao que realmente implica mudança de layout.
