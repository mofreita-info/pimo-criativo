# Implementação completa – Cena 3D PIMO Studio

Relatório por parte: arquivos modificados, impacto e diff completo.

---

## Parte 2 – Movimentação X/Y/Z com limite no chão

### 1. Arquivos modificados
- `src/3d/core/Viewer.ts`

### 2. Impacto
- **clampTransform()** deixa de fixar `position.y` (base no chão) e de travar X/Z. Passa a permitir movimento livre em X, Y e Z e só garante que o bbox do objeto não desça abaixo de Y=0 (chão). Em modo rotate mantém `rotation.x = 0` e `rotation.z = 0`.
- Nenhuma alteração em ProjectProvider, Sync ou UI; só na lógica do Viewer ao arrastar com TransformControls.

### 3. Diff completo

**Viewer.ts** – método `clampTransform`:

```diff
  private clampTransform() {
    if (!this.transformControls || !this.selectedBoxId) return;
    const obj = this.transformControls.object;
    if (!obj || !this.boxes.has(this.selectedBoxId)) return;
    const entry = this.boxes.get(this.selectedBoxId)!;
    if (obj !== entry.mesh) return;
    if (this.transformMode === "translate") {
-      obj.position.y = entry.cadOnly ? 0 : entry.height / 2;
+      // Movimento livre em X, Y, Z; apenas impedir que a base desça abaixo do chão (Y < 0)
+      obj.updateMatrixWorld(true);
+      this._boundingBox.setFromObject(obj);
+      if (this._boundingBox.min.y < 0) {
+        obj.position.y -= this._boundingBox.min.y;
+      }
+      if (this.snapEnabled) this.applySnapToNearest(obj);
    } else if (this.transformMode === "rotate") {
      obj.rotation.x = 0;
      obj.rotation.z = 0;
    }
  }
```

---

## Parte 3 – Botão Grade 50×50 cm

### 1. Arquivos modificados
- `src/3d/core/Viewer.ts` (estado, createFloorGrid, setGridVisible, getGridVisible, dispose)
- `src/hooks/usePimoViewer.ts` (setGridVisible, getGridVisible no retorno)
- `src/context/PimoViewerContextCore.ts` (tipos setGridVisible, getGridVisible)
- `src/context/projectTypes.ts` (ViewerApi e ViewerSync)
- `src/core/viewer/viewerApiAdapter.ts` (setGridVisible, getGridVisible)
- `src/hooks/useViewerSync.ts` (setGridVisible, getGridVisible)
- `src/components/layout/viewer-toolbar/Tools3DToolbar.tsx` (props e botão #)
- `src/components/layout/workspace/Workspace.tsx` (estado gridVisible, toggleGrid, overlay)

### 2. Impacto
- Viewer passa a ter grade opcional no chão (2,5 m, 5 divisões = 0,5 m por célula), opacidade 0,3 (~70% transparência), criada sob demanda e ligada/desligada por estado.
- API do viewer (PimoViewerApi, ViewerApi, ViewerSync) ganha setGridVisible/getGridVisible; adapter e useViewerSync repassam.
- UI: Tools3DToolbar recebe gridVisible/onToggleGrid; Workspace mantém estado e chama viewerSync.

### 3. Diff completo

**Viewer.ts** – propriedades e métodos:

```diff
+  /** Grade 50×50 cm no chão, ~70% transparência. */
+  private floorGrid: THREE.GridHelper | null = null;
+  private gridVisible = false;
...
+  setGridVisible(visible: boolean): void {
+    this.gridVisible = visible;
+    if (visible && !this.floorGrid) this.createFloorGrid();
+    if (this.floorGrid) this.floorGrid.visible = visible;
+  }
+
+  getGridVisible(): boolean {
+    return this.gridVisible;
+  }
+
+  private createFloorGrid(): void {
+    if (this.floorGrid) return;
+    const size = 2.5;
+    const divisions = 5;
+    const color = 0x94a3b8;
+    this.floorGrid = new THREE.GridHelper(size, divisions, color, color);
+    this.floorGrid.position.y = 0.001;
+    const mat = this.floorGrid.material as THREE.Material;
+    if (mat) {
+      mat.transparent = true;
+      mat.opacity = 0.3;
+    }
+    this.sceneManager.scene.add(this.floorGrid);
+    this.floorGrid.visible = this.gridVisible;
+  }
```

**Viewer.ts** – dispose:

```diff
+    if (this.floorGrid) {
+      this.sceneManager.scene.remove(this.floorGrid);
+      this.floorGrid.geometry.dispose();
+      (this.floorGrid.material as THREE.Material).dispose();
+      this.floorGrid = null;
+    }
```

**Tools3DToolbar.tsx** – props e botão:

```diff
+  gridVisible?: boolean;
+  onToggleGrid?: () => void;
...
+  gridVisible = false,
+  onToggleGrid,
...
+      {onToggleGrid != null && (
+        <button type="button" title={...} onClick={onToggleGrid} ...> # </button>
+      )}
```

**Workspace.tsx** – estado e toggle:

```diff
+  const [gridVisible, setGridVisibleState] = useState(false);
+  const toggleGrid = useCallback(() => {
+    const next = !gridVisible;
+    setGridVisibleState(next);
+    viewerSync.setGridVisible(next);
+  }, [gridVisible, viewerSync]);
...
+            gridVisible={gridVisible}
+            onToggleGrid={toggleGrid}
```

*(usePimoViewer, PimoViewerContextCore, projectTypes, viewerApiAdapter, useViewerSync: adição dos métodos setGridVisible/getGridVisible na API e no retorno.)*

---

## Parte 4 – Botão Snap/Magnet

### 1. Arquivos modificados
- `src/3d/core/Viewer.ts` (snapEnabled, SNAP_THRESHOLD_M, applySnapToNearest, chamada em clampTransform)
- `src/hooks/usePimoViewer.ts`
- `src/context/PimoViewerContextCore.ts`
- `src/context/projectTypes.ts`
- `src/core/viewer/viewerApiAdapter.ts`
- `src/hooks/useViewerSync.ts`
- `src/components/layout/viewer-toolbar/Tools3DToolbar.tsx`
- `src/components/layout/workspace/Workspace.tsx`

### 2. Impacto
- Durante translate, se snap estiver ativo, ao soltar ou em objectChange as caixas são alinhadas a <2 cm sem sobreposição (eixos X e Z). Estado snapEnabled no Viewer; API e UI espelham.

### 3. Diff completo

**Viewer.ts** – estado e uso:

```diff
+  private snapEnabled = false;
+  private readonly SNAP_THRESHOLD_M = 0.02;
...
+      if (this.snapEnabled) this.applySnapToNearest(obj);
...
+  setSnapEnabled(enabled: boolean): void { this.snapEnabled = enabled; }
+  getSnapEnabled(): boolean { return this.snapEnabled; }
...
+  private applySnapToNearest(movingMesh: THREE.Object3D): void {
+    movingMesh.updateMatrixWorld(true);
+    const movingBox = new THREE.Box3().setFromObject(movingMesh);
+    const threshold = this.SNAP_THRESHOLD_M;
+    this.boxes.forEach((entry, boxId) => {
+      if (boxId === this.selectedBoxId) return;
+      entry.mesh.updateMatrixWorld(true);
+      const otherBox = new THREE.Box3().setFromObject(entry.mesh);
+      // Eixo X e Z: se gap em [0, 0.02], snap para encostar
+      ...
+    });
+  }
```

**Tools3DToolbar.tsx** – snapEnabled, onToggleSnap, botão ⊞∕.  
**Workspace.tsx** – snapEnabled, setSnapEnabledState, toggleSnap, viewerSync.setSnapEnabled.  
*(Sync/Adapter: setSnapEnabled, getSnapEnabled.)*

---

## Parte 5 – Botão Dimensões totais (linhas + valores)

### 1. Arquivos modificados
- `src/3d/core/Viewer.ts` (getCombinedBoundingBox, dimensionsOverlayVisible, createDimensionsOverlay, updateDimensionsOverlay, chamada no loop, dispose)
- `src/hooks/usePimoViewer.ts`
- `src/context/PimoViewerContextCore.ts`
- `src/context/projectTypes.ts`
- `src/core/viewer/viewerApiAdapter.ts`
- `src/hooks/useViewerSync.ts`
- `src/components/layout/viewer-toolbar/Tools3DToolbar.tsx`
- `src/components/layout/workspace/Workspace.tsx`

### 2. Impacto
- Bbox combinado de todas as caixas exposto por getCombinedBoundingBox. Overlay 3D (LineSegments do bbox) + overlay 2D (L/A/P em m) atualizados quando overlay está visível; números atualizados a cada 150 ms no Workspace.

### 3. Diff completo

**Viewer.ts** – overlay e bbox:

```diff
+  private dimensionsOverlayVisible = false;
+  private dimensionsOverlayGroup: THREE.Group | null = null;
+  private dimensionsOverlayLines: THREE.LineSegments | null = null;
...
+  getCombinedBoundingBox(): { min, max, size, width, height, depth } | null { ... }
+  setDimensionsOverlayVisible(visible: boolean): void { ... }
+  getDimensionsOverlayVisible(): boolean { ... }
+  private createDimensionsOverlay(): void { ... }
+  private updateDimensionsOverlay(): void { ... }
```

**Viewer.ts** – loop:

```diff
       this.updateExplodedView();
+      this.updateDimensionsOverlay();
```

**Viewer.ts** – dispose:

```diff
+    if (this.dimensionsOverlayLines) { ... dispose ... }
+    if (this.dimensionsOverlayGroup) { scene.remove; null; }
```

**Workspace.tsx** – estado e overlay div:

```diff
+  const [dimensionsOverlayVisible, setDimensionsOverlayVisibleState] = useState(false);
+  const [combinedDimensions, setCombinedDimensions] = useState<...>(null);
+  const toggleDimensionsOverlay = useCallback(...);
+  useEffect(() => { setInterval(() => setCombinedDimensions(viewerSync.getCombinedBoundingBox() ?? null), 150); ... }, [dimensionsOverlayVisible, viewerSync]);
...
+          {dimensionsOverlayVisible && combinedDimensions && (
+            <div className="dimensions-overlay" style={{ position: 'absolute', bottom: 12, left: 12, ... }}>
+              <span>L {combinedDimensions.width.toFixed(2)} m</span>
+              <span>A {combinedDimensions.height.toFixed(2)} m</span>
+              <span>P {combinedDimensions.depth.toFixed(2)} m</span>
+            </div>
+          )}
```

**Tools3DToolbar.tsx** – dimensionsOverlayVisible, onToggleDimensionsOverlay, botão L×A×P.  
*(Sync/Adapter: getCombinedBoundingBox, setDimensionsOverlayVisible, getDimensionsOverlayVisible.)*

---

## Parte 6 – Limpeza e compatibilidade

### 1. Arquivos modificados
- `src/3d/core/Viewer.ts` (dispose de floorGrid e dimensionsOverlayGroup/Lines)

### 2. Impacto
- Ao destruir o Viewer, a grade e o overlay de dimensões são removidos da cena e têm geometria/material dispostos; evita leak de recursos e referências.

### 3. Diff completo

*(Já incluído nos diffs das Partes 3 e 5 no método dispose().)*

---

## Resumo dos arquivos tocados (Partes 2–6)

| Arquivo | Partes |
|---------|--------|
| `src/3d/core/Viewer.ts` | 2, 3, 4, 5, 6 |
| `src/hooks/usePimoViewer.ts` | 3, 4, 5 |
| `src/context/PimoViewerContextCore.ts` | 3, 4, 5 |
| `src/context/projectTypes.ts` | 3, 4, 5 |
| `src/core/viewer/viewerApiAdapter.ts` | 3, 4, 5 |
| `src/hooks/useViewerSync.ts` | 3, 4, 5 |
| `src/components/layout/viewer-toolbar/Tools3DToolbar.tsx` | 3, 4, 5 |
| `src/components/layout/workspace/Workspace.tsx` | 3, 4, 5 |

Integração: ProjectProvider não foi alterado nas Partes 2–6; Viewer é a única fonte de verdade para grid, snap e dimensões; estado de UI (grid/snap/dimensões on/off) vive no Workspace e é aplicado via viewerSync ao Viewer registado pelo adapter.
