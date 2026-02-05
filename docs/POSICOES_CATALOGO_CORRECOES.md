# Correções definitivas – Posições iniciais dos modelos do Catálogo

## 1. Lista dos ficheiros modificados

- **`src/3d/core/Viewer.ts`**
- **`src/hooks/useCalculadoraSync.ts`**

---

## 2. Explicação breve do impacto

| Regra | Implementação |
|-------|----------------|
| **Viewer não altera posição quando manualPosition = true** | **addBox**: Com `manualPosition && opts.position`, usa apenas `opts.position` (sem offsets, recenter ou ajustes). **updateBox**: Em `dimensionsChanged` para caixa CAD-only, só aplica `position.y = height/2` quando `!entry.manualPosition`; com `manualPosition` só altera posição se `opts.position` for passado. **reflowBoxes**: Documentado que com `manualPosition === true` nunca altera position.x/y/z. |
| **Posição inicial só do ProjectProvider** | **Sync**: `getBoxPositionAndRotation` passa a enviar sempre `position` quando `manualPosition === true`, com X/Z de `posicaoX_mm`/`posicaoZ_mm` e Y com fallback `altura/2` em mm quando `posicaoY_mm` está ausente ou 0 (evita caixas enterradas). |
| **Sync não reenvia posição diferente** | A posição enviada ao viewer vem sempre de `workspaceBox` (estado do projeto). O viewer deixa de sobrescrever posição em caixas com `manualPosition`, portanto a posição permanece a do primeiro addBox (definida pelo ProjectProvider). |
| **applyCollisionConstraint só no movimento** | `clampTransform` só é chamado em `objectChange` (arraste do utilizador), nunca na criação; comentário explícito no código. |

Com isto:
- Nenhuma caixa nasce no centro da tela (X = rightmost + 100 mm).
- Nenhuma nasce enterrada (Y = altura/2 em mm → centro no chão).
- Nenhuma nasce em cima de outra (X calculado no ProjectProvider).
- Nenhuma “salta” após criação (Viewer não recalcula nem altera posição quando `manualPosition`).

---

## 3. Diff das mudanças (apenas alterações de posição/catálogo)

### src/3d/core/Viewer.ts

**addBox**
- `manualPosition` guardado em variável.
- Posição: quando `manualPosition && opts.position`, usa só `opts.position` (x, y, z); caso contrário, CAD-only usa `(0, baseY, 0)`, outros usam `opts.position ?? { x: 0, y: baseY, z: 0 }`.
- Entrada em `boxes` usa `manualPosition` em vez de `opts.manualPosition ?? false`.

**updateBox**
- No bloco `dimensionsChanged` para `entry.cadOnly`: de `entry.mesh.position.y = height / 2` para `else if (!entry.manualPosition) { entry.mesh.position.y = height / 2 }`.
- Comentário: "manualPosition: só alterar posição quando opts.position for explícito; nunca aplicar reflow/height/2."

**reflowBoxes**
- Comentário atualizado: "manualPosition === true: NUNCA alterar position.x, position.y nem position.z."

**clampTransform**
- Comentário: "Só chamado em objectChange (arraste do utilizador). Nunca na criação da caixa."

### src/hooks/useCalculadoraSync.ts

**getBoxPositionAndRotation**
- Para `manualPosition === true`: sempre envia `opts.position` com `x`, `y`, `z`.
- `x = mmToM(workspaceBox.posicaoX_mm ?? 0)`, `z = mmToM(workspaceBox.posicaoZ_mm ?? 0)`.
- `y`: usa `posicaoY_mm` se definido e > 0; senão `(workspaceBox.dimensoes?.altura ?? 0) / 2`, depois `mmToM(yMm)`.
- Comentário: "Posição EXCLUSIVAMENTE do projeto. manualPosition === true: X = rightmost+100mm, Y = altura/2, Z = 0 (definidos no ProjectProvider)."
