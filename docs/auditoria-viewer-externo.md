# Auditoria: arquivos que interagem com o Viewer

## Objetivo

Identificar e corrigir lógica externa que:
- recria o Viewer
- recria o viewerApi desnecessariamente
- chama addBox/updateBox/reflowBoxes fora de hora
- dispara efeitos que reinicializam o Viewer ou causam syncs repetidos

---

## 1. usePimoViewer.ts

### Problema 1: Viewer recriado a cada re-render do Workspace (CRÍTICO)

**Trecho problemático (antes):**
```ts
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (viewerRef.current) return;
    viewerRef.current = new Viewer(container, options);
    // ...
    return () => {
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, [containerRef, options]);  // ← options na lista de deps
```

**Causa:** No Workspace, a chamada era `usePimoViewer(containerRef, { background: viewerBackground, ...viewerOptions, skipInitialBox: true })`. Esse segundo argumento é um **objeto literal novo em todo render**. Logo `options` é uma referência nova a cada render do Workspace. O efeito tem `options` nas dependências, então:
1. O efeito roda de novo
2. O cleanup do efeito anterior roda → `viewerRef.current?.dispose(); viewerRef.current = null`
3. O efeito atual roda → `viewerRef.current` é null → cria um **novo** Viewer

Resultado: o Viewer era **destruído e recriado a cada re-render do Workspace** (mudança de rota, seleção de caixa, etc.), causando tela preta, perda de câmera e “sumiço” do cubo.

**Correção:**
- Guardar `options` em um ref: `optionsRef.current = options`.
- Usar no efeito `optionsRef.current` ao criar o Viewer.
- **Remover `options` das dependências do efeito** e deixar apenas `[containerRef]`.
- Assim o efeito só roda quando o componente monta (e `containerRef` é estável), e o Viewer é criado uma única vez.

**Trecho corrigido:**
```ts
  const optionsRef = useRef(options);
  optionsRef.current = options;
  // ...
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (viewerRef.current) return;
    viewerRef.current = new Viewer(container, optionsRef.current ?? {});
    // ...
    return () => { /* dispose */ };
  }, [containerRef]);
```

---

## 2. useCalculadoraSync.ts

### Problema 2: Sync disparado a cada mudança de selectedBoxId (CRÍTICO)

**Trecho problemático (antes):**
```ts
  const syncFromCalculator = useCallback(() => {
    // ... usa viewerApi.addBox, viewerApi.updateBox, etc.
  }, [viewerApi, materialName]);  // ← viewerApi nas deps

  useEffect(() => {
    syncFromCalculator();
  }, [boxes, syncFromCalculator]);
```

**Causa:** `viewerApi` vem do retorno de `usePimoViewer`, que é um `useMemo(..., [selectedBoxId, ...])`. Sempre que `selectedBoxId` muda (usuário seleciona outra caixa), `viewerApi` é um **objeto novo**. Com isso:
1. `syncFromCalculator` é recriado (deps `[viewerApi, materialName]`)
2. O efeito que chama `syncFromCalculator()` roda de novo (deps `[boxes, syncFromCalculator]`)
3. É executado um **sync completo** (addBox/updateBox/setBoxIndex/removeBox para todas as caixas) mesmo sem mudança em `boxes` ou em material

Resultado: a cada clique em uma caixa, o sync rodava de novo, chamando `updateBox` para todas as caixas e contribuindo para reset de câmera e comportamento instável.

**Correção:**
- Manter a API do viewer em um ref: `viewerApiRef.current = viewerApi`.
- Dentro de `syncFromCalculator`, usar `viewerApiRef.current` em vez de `viewerApi`.
- **Remover `viewerApi` das dependências de `syncFromCalculator`**, deixando apenas `[materialName]`.

Assim `syncFromCalculator` só muda quando `materialName` muda; o efeito que o chama só roda quando `boxes` ou `syncFromCalculator` (ou seja, `materialName`) mudam, e **não** quando o usuário apenas seleciona outra caixa.

**Trecho corrigido:**
```ts
  const viewerApiRef = useRef(viewerApi);
  viewerApiRef.current = viewerApi;

  const syncFromCalculator = useCallback(() => {
    const api = viewerApiRef.current;
    if (!api) return;
    // ... usa api.addBox, api.updateBox, etc.
  }, [materialName]);
```

E no efeito de `setBoxGap`:
- Não depender de `viewerApi` (evitar reexecução ao mudar seleção).
- Usar `viewerApiRef.current` dentro do efeito e dependências `[gap]`.

---

## 3. Workspace.tsx

### Problema 3: Objeto options novo a cada render

**Trecho problemático (antes):**
```ts
  const viewerApi = usePimoViewer(containerRef, {
    background: viewerBackground,
    ...viewerOptions,
    skipInitialBox: true,
  });
```

**Causa:** O segundo argumento é um objeto literal criado em todo render. Isso alimentava o problema em usePimoViewer (antes da correção): a referência de `options` mudava a cada render e fazia o efeito de criação do Viewer rodar de novo.

**Correção:** Memoizar o objeto de options com `useMemo`, para que a referência só mude quando `viewerBackground` ou `viewerOptions` mudarem de fato.

**Trecho corrigido:**
```ts
  const viewerOptionsStable = useMemo(
    () => ({
      background: viewerBackground,
      ...viewerOptions,
      skipInitialBox: true as const,
    }),
    [viewerBackground, viewerOptions]
  );
  const viewerApi = usePimoViewer(containerRef, viewerOptionsStable);
```

---

## 4. useViewerSync.ts

- Não altera o Viewer usado pelo Workspace (usa outra API/ref e placeholders).
- Nenhuma alteração necessária para o bug de recriação/sync.

---

## 5. ThreeViewer.tsx

- Usado na página test-viewer com props estáveis; não faz parte do fluxo principal (Workspace + usePimoViewer + useCalculadoraSync).
- Nenhuma alteração feita nesta auditoria.

---

## Resumo das alterações

| Arquivo | Alteração |
|---------|-----------|
| `src/hooks/usePimoViewer.ts` | Ref para `options`; efeito de criação do Viewer com deps só `[containerRef]`; Viewer criado uma vez após o mount. |
| `src/hooks/useCalculadoraSync.ts` | Ref para `viewerApi`; `syncFromCalculator` depende só de `[materialName]`; efeito de `setBoxGap` depende só de `[gap]`. |
| `src/components/layout/workspace/Workspace.tsx` | Options do viewer memoizadas com `useMemo([viewerBackground, viewerOptions])`. |

---

## Garantias após as correções

- O Viewer **não** é mais recriado a cada re-render do Workspace; só quando o componente que chama usePimoViewer desmonta (cleanup) e monta de novo.
- O sync da calculadora **não** roda mais quando o usuário apenas seleciona outra caixa; só quando `boxes` ou `materialName` mudam.
- Nenhum efeito externo chama addBox/updateBox/reflowBoxes/updateCameraTarget fora do fluxo correto por causa de referências instáveis de `options` ou `viewerApi`.
