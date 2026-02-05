# Correções integradas – Cena 3D PIMO Studio

Relatório: arquivos modificados, impacto e diff completo.

---

## 1. Lista dos arquivos modificados

- `src/3d/core/Viewer.ts`
- `src/components/layout/viewer-toolbar/Tools3DToolbar.tsx`
- `src/components/layout/workspace/Workspace.tsx`
- `src/hooks/usePimoViewer.ts`
- `src/context/PimoViewerContextCore.ts`
- `src/context/projectTypes.ts`
- `src/core/viewer/viewerApiAdapter.ts`
- `src/hooks/useViewerSync.ts`

---

## 2. Explicação breve do impacto

| Correção | Impacto |
|----------|---------|
| **Dimensões L×A×P** | Botão "L×A×P" removido. Overlay de dimensões (linhas 3D + valores L/A/P) fica ligado ao modo "Selecionar": visível só quando a ferramenta ativa é "select"; escondido em move/rotate. Workspace sincroniza `setDimensionsOverlayVisible(isSelectMode)`. |
| **Grid 50×50 cm** | Grid passa a cobrir todo o chão: tamanho 25 m, 50 divisões (células 0,5 m), centralizado (position 0,0,0.001). Mantém cor 0x94a3b8 e opacidade 0,3. |
| **Snap → Lock** | Botão Snap/Magnet removido. Novo botão Lock (cadeado): Lock ON aplica colisão (applyCollisionConstraint) ao mover – impede sobreposição; Lock OFF permite interpenetração. API: setSnapEnabled/getSnapEnabled substituídos por setLockEnabled/getLockEnabled. |
| **Vista Explodida** | Botão e toda a lógica removidos: campos, setExplodedView, getExplodedView, updateExplodedView, referências em reflowBoxes e updateBox. Removido da API (ViewerApi, ViewerSync, adapter, hooks). |
| **Novos modelos** | Sempre `position.y = height/2` (base no chão) para todas as caixas (paramétricas e CAD-only). Posição inicial em X/Z continua ao lado do último (rightmost + 100 mm, Z=0). updateBox sem posição explícita também usa `position.y = height/2`. |

---

## 3. Diff completo das mudanças

### Viewer.ts

**Remoção Exploded View + Snap; adição Lock; grid maior:**

```diff
-  /** Exploded View: posições base (do projeto) e offsets visuais. */
-  private explodedViewEnabled = false;
-  private explodedBasePositions = new Map<string, { x: number; y: number; z: number }>();
-  private explodedOffsets = new Map<string, { x: number; y: number; z: number }>();
-  private readonly EXPLODED_OFFSET_M = 0.1;
-  private readonly EXPLODED_LERP = 0.12;
-
   /** Grade 50×50 cm no chão, cobre todo o fundo da cena, ~70% transparência. */
   private floorGrid: THREE.GridHelper | null = null;
   private gridVisible = false;
-
-  /** Snap/Magnet: ao mover, encostar caixas sem sobrepor (< 2 cm). */
-  private snapEnabled = false;
-  private readonly SNAP_THRESHOLD_M = 0.02;
+
+  /** Lock: quando ativo, impede que caixas entrem uma na outra (colisão). */
+  private lockEnabled = false;
```

**Grid: tamanho e divisões:**

```diff
   private createFloorGrid(): void {
     if (this.floorGrid) return;
-    const size = 2.5;
-    const divisions = 5;
+    const size = 25;
+    const divisions = 50;
```

**Snap → Lock (métodos e clamp):**

```diff
-  setSnapEnabled(enabled: boolean): void {
-    this.snapEnabled = enabled;
-  }
-
-  getSnapEnabled(): boolean {
-    return this.snapEnabled;
-  }
+  setLockEnabled(enabled: boolean): void {
+    this.lockEnabled = enabled;
+  }
+
+  getLockEnabled(): boolean {
+    return this.lockEnabled;
+  }
```

```diff
-      if (this.snapEnabled) this.applySnapToNearest(obj);
+      if (this.lockEnabled) this.applyCollisionConstraint(obj);
```

**applySnapToNearest → applyCollisionConstraint:**

```diff
-  /** Snap: se estiver a < 2 cm de outro modelo, alinhar para encostar sem sobrepor. */
-  private applySnapToNearest(movingMesh: THREE.Object3D): void {
-    ...
-    (lógica de snap por threshold 2cm)
-  }
+  /** Lock ON: impede que a caixa em movimento entre dentro de outra (colisão). */
+  private applyCollisionConstraint(movingMesh: THREE.Object3D): void {
+    ... (intersectsBox, overlap X/Z/Y, push along minimum penetration axis)
+  }
```

**Remoção setExplodedView / getExplodedView / updateExplodedView** (blocos inteiros removidos).

**Loop: remoção updateExplodedView:**

```diff
       this.controls?.update();
       this.lerpLightsToTarget();
-      this.updateExplodedView();
       this.updateDimensionsOverlay();
```

**addBox: baseY e posição inicial:**

```diff
-    const baseY = cadOnly ? 0 : height / 2;
+    const baseY = height / 2;
     const useReflowPosition = !(opts.manualPosition === true && opts.position);
     const position =
       useReflowPosition && cadOnly
-        ? { x: 0, y: 0, z: 0 }
+        ? { x: 0, y: baseY, z: 0 }
         : (opts.position ?? { x: 0, y: baseY, z: 0 });
```

**updateBox: posição e reflow:**

```diff
     if (opts.position) {
-      this.explodedBasePositions.set(id, { ...opts.position });
-      if (!this.explodedViewEnabled) {
-        entry.mesh.position.set(opts.position.x, opts.position.y, opts.position.z);
-      }
+      entry.mesh.position.set(opts.position.x, opts.position.y, opts.position.z);
     } else {
-      entry.mesh.position.y = entry.cadOnly ? 0 : height / 2;
+      entry.mesh.position.y = height / 2;
     }
```

```diff
       entry.mesh.updateMatrixWorld();
-      this.explodedBasePositions.set(entry.mesh.userData.boxId as string, { ... });
       cursorX += w + this.boxGap;
```

---

### Tools3DToolbar.tsx

**Props: removidos Exploded, Snap, Dimensões; adicionado Lock:**

```diff
-  explodedView?: boolean;
-  onToggleExplodedView?: () => void;
   gridVisible?: boolean;
   onToggleGrid?: () => void;
-  snapEnabled?: boolean;
-  onToggleSnap?: () => void;
-  dimensionsOverlayVisible?: boolean;
-  onToggleDimensionsOverlay?: () => void;
+  lockEnabled?: boolean;
+  onToggleLock?: () => void;
```

**Destructuring e botões:** removidos botões Vista Explodida (⊞), Snap (⊞∕) e L×A×P; adicionado botão Lock (🔒) com `lockEnabled` / `onToggleLock`.

---

### Workspace.tsx

**Estado e efeitos: dimensões ligadas ao modo Selecionar; Snap → Lock:**

```diff
-  const [explodedView, setExplodedViewState] = useState(false);
-  const toggleExplodedView = useCallback(...);
-
   const [gridVisible, setGridVisibleState] = useState(false);
   const toggleGrid = useCallback(...);
-
-  const [snapEnabled, setSnapEnabledState] = useState(false);
-  const toggleSnap = useCallback(...);
-
-  const [dimensionsOverlayVisible, setDimensionsOverlayVisibleState] = useState(false);
-  const [combinedDimensions, ...] = useState(...);
-  const toggleDimensionsOverlay = useCallback(...);
-
-  useEffect(() => {
-    if (!dimensionsOverlayVisible) { setCombinedDimensions(null); return; }
-    const t = setInterval(() => setCombinedDimensions(viewerSync.getCombinedBoundingBox() ?? null), 150);
-    return () => clearInterval(t);
-  }, [dimensionsOverlayVisible, viewerSync]);
+  const [lockEnabled, setLockEnabledState] = useState(false);
+  const toggleLock = useCallback(...);
+
+  const [combinedDimensions, setCombinedDimensions] = useState(...);
+  const isSelectMode = (project.activeViewerTool ?? "select") === "select";
+
+  useEffect(() => {
+    viewerSync.setDimensionsOverlayVisible(isSelectMode);
+  }, [isSelectMode, viewerSync]);
+
+  useEffect(() => {
+    if (!isSelectMode) { setCombinedDimensions(null); return; }
+    const t = setInterval(() => setCombinedDimensions(viewerSync.getCombinedBoundingBox() ?? null), 150);
+    return () => clearInterval(t);
+  }, [isSelectMode, viewerSync]);
```

**Tools3DToolbar:** props `explodedView`, `onToggleExplodedView`, `snapEnabled`, `onToggleSnap`, `dimensionsOverlayVisible`, `onToggleDimensionsOverlay` removidas; `lockEnabled` e `onToggleLock` adicionadas.

**Overlay div:** condição de exibição alterada de `dimensionsOverlayVisible` para `isSelectMode`.

---

### usePimoViewer.ts

- Removidos `setExplodedView`, `getExplodedView`, `setSnapEnabled`, `getSnapEnabled`.
- Adicionados `setLockEnabled`, `getLockEnabled`.
- Retorno e array de dependências atualizados em conformidade.

---

### PimoViewerContextCore.ts

- Removidos `setExplodedView`, `getExplodedView`, `setSnapEnabled`, `getSnapEnabled`.
- Adicionados `setLockEnabled`, `getLockEnabled`.

---

### projectTypes.ts (ViewerApi e ViewerSync)

- Removidos `setExplodedView`, `getExplodedView`, `setSnapEnabled`, `getSnapEnabled`.
- Adicionados `setLockEnabled`, `getLockEnabled`.

---

### viewerApiAdapter.ts

- Removidos `setExplodedView`, `getExplodedView`, `setSnapEnabled`, `getSnapEnabled`.
- Adicionados `setLockEnabled`, `getLockEnabled`.

---

### useViewerSync.ts

- Removidos `setExplodedView`, `getExplodedView`, `setSnapEnabled`, `getSnapEnabled`.
- Adicionados `setLockEnabled`, `getLockEnabled` e repasse no retorno.
