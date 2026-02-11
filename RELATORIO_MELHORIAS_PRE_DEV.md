# Relatório: Melhorias Pequenas e Seguras (Pré-Desenvolvimento)

**Data:** 11 de fevereiro de 2025  
**Projeto:** pimo-v3  
**Objetivo:** Deixar o projeto limpo antes de novas funcionalidades, sem alterar comportamento.

---

## 1. Renomeações e naming

| Local | Antes | Depois | Motivo |
|-------|--------|--------|--------|
| **Tools3DToolbar.tsx** | `handleClick` | `handleToolSelect` | Nome mais descritivo; alinhado à prop `onToolSelect`. |
| **Tools3DToolbar.tsx** | `btnStyle` | `toolbarButtonStyle` | Evitar nome genérico; indica que é estilo de botão da toolbar. |
| **wallStore.ts** | (sem comentário em `isOpen`) | JSDoc: «Painel de sala (paredes) aberto na UI.» | Esclarecer significado sem renomear (evitar impacto em vários consumidores). |

Nenhuma alteração em stores (uiStore, wallStore) além do comentário; consistência de nomes mantida. Imports atualizados apenas onde ficheiros foram movidos (DevPimoTest).

---

## 2. Ajustes visuais (UI)

### 2.1 Variáveis de espaçamento (index.css)

Em `:root` foram adicionadas variáveis para unificar toolbars e painéis:

- `--space-toolbar-gap: 4px`
- `--space-toolbar-padding-y: 6px`
- `--space-toolbar-padding-x: 10px`
- `--size-toolbar-icon: 28px`

**.viewer-toolbar** passou a usar essas variáveis (`gap`, `padding`, tamanho do botão), permitindo alterações futuras num único sítio.

### 2.2 Toolbar 3D (Tools3DToolbar.tsx)

- **Padding:** `4px 10px` → `6px 10px` (alinhado à viewer-toolbar).
- **Gap:** `2` → `4` (consistente com a viewer-toolbar).
- **Background:** `rgba(15, 23, 42, 0.7)` → `rgba(15, 23, 42, 0.85)` e borda `0.06` → `0.08` (visualmente alinhado à viewer-toolbar).
- **Botões:** tamanho `26×26` → `28×28`, `fontSize` `11` → `12` (ícones e botões padronizados com ViewerToolbar).
- **Estilo partilhado:** constante única `toolbarButtonStyle` (28×28, fontSize 12, marginLeft 4) para todos os botões da toolbar (select, move, rotate, lock, câmera, rotação).

### 2.3 Z-index

Nenhuma alteração; hierarquia de camadas (workspace 0, painéis 1, modais 1300, etc.) mantida conforme relatório anterior.

### 2.4 Estilos removidos

Não foram removidos blocos de CSS: não se identificaram estilos claramente não utilizados sem risco de quebrar UI. A remoção de estilos antigos ou duplicados ficou fora do âmbito por segurança.

---

## 3. Organização de pastas e ficheiros

| Ação | Detalhe |
|------|---------|
| **Criada** | `src/__dev__/` para código de desenvolvimento/testes. |
| **Movido** | `src/pages/DevPimoTest.tsx` → `src/__dev__/DevPimoTest.tsx`. |
| **Atualizado** | `App.tsx`: import de `./pages/DevPimoTest` para `./__dev__/DevPimoTest`. Rota `/dev-test` inalterada. |
| **Adicionado** | Comentário no topo de `DevPimoTest.tsx` explicando que está em `__dev__` para separar do fluxo principal. |

Nomes de pastas existentes (camelCase como `leftPanel`, kebab-case em layout) não foram alterados para evitar impacto em imports e configuração.

---

## 4. Confirmação de build estável

- **TypeScript:** `npx tsc --noEmit` — **OK** (sem erros).
- **Build:** `npm run build` (Vite) — **OK** (compilação concluída com sucesso).

Comportamento funcional e fluxo do utilizador mantidos; apenas melhorias de nome, consistência visual das toolbars e organização do ficheiro de dev.
