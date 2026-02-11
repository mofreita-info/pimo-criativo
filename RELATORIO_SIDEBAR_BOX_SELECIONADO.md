# Ajustes da barra lateral esquerda com box selecionado

**Data:** 11 de fevereiro de 2025  
**Ficheiro principal:** `src/components/layout/left-panel/LeftPanel.tsx`  
**Regra:** Alterações aplicadas **apenas** quando existe um box selecionado; tela Início sem seleção permanece intacta.

---

## 1. Elementos removidos (apenas quando um box está selecionado)

| Elemento | Antes | Depois |
|----------|--------|--------|
| **Campo "NOME DE PROJETO"** | Sempre visível na área principal (Início). | Renderizado só quando **não** há box selecionado (`{!selectedBox && <Panel title="NOME DE PROJETO"> ... }`). Com box selecionado, o campo deixa de aparecer. |
| **Título "Propriedades"** | Título da secção quando `selectedBox` era verdadeiro ("Propriedades" vs "Definições"). | Removido quando há box selecionado. O título da secção só é mostrado quando **não** há seleção, como "Definições" (`{!selectedBox && <div className="section-title">Definições</div>}`). |
| **Texto "Edite largura, altura, profundidade, prateleiras e material abaixo."** | Parágrafo exibido quando `selectedBox` existia. | Removido por completo (não é exibido em nenhum caso). |

---

## 2. Onde o botão "Selecionar Material" foi adicionado

- **Local:** Imediatamente **abaixo do painel "Dimensões"**, ainda dentro do mesmo `aside` do painel esquerdo (HOME).
- **Visibilidade:** Só é renderizado quando `selectedBox` existe (`{selectedBox && ( <button>Selecionar Material</button> )}`).
- **Estilo:** `className="button button-ghost"` e `style={{ width: "100%", marginBottom: 8 }}`, alinhado aos outros botões do painel.
- **Comportamento ao clicar:**  
  - Tenta fazer scroll até o elemento com `[data-material-panel]` (painel direito).  
  - O contentor do painel direito (`right-panel-stack`) em `App.tsx` recebeu `data-material-panel` para servir de alvo.  
  - Se não encontrar o elemento, é mostrado um toast de informação: "Seletor de materiais: use o painel direito ou Admin → Materiais."

---

## 3. O que foi mantido

- **Secção Dimensões:** Inalterada (largura, altura, profundidade em mm).
- **Tela Início sem seleção:**  
  - Bloco quando não há caixas (`!project.selectedWorkspaceBoxId && project.workspaceBoxes.length === 0`) não foi alterado (mantém "Nenhuma caixa selecionada", NOME DE PROJETO, Notas, etc.).  
  - Quando há caixas mas nenhuma selecionada, mantêm-se "Início", "Definições", campo "NOME DE PROJETO", Dimensões e demais conteúdos como antes.
- **Lógica de seleção:** Nenhuma alteração em `project.selectedWorkspaceBoxId`, `selectedBox` ou em stores/contextos; apenas renderização condicional no JSX.

---

## 4. Ficheiros modificados

| Ficheiro | Alterações |
|----------|------------|
| **`src/components/layout/left-panel/LeftPanel.tsx`** | Import de `useToast`; uso de `showToast`; título da secção e campo NOME DE PROJETO envolvidos em `{!selectedBox && (...)}`; remoção do parágrafo "Edite largura..."; novo botão "Selecionar Material" abaixo de Dimensões, visível só com `selectedBox`, com scroll para `[data-material-panel]` ou toast. |
| **`src/App.tsx`** | No `div` da classe `right-panel-stack` foi adicionado o atributo `data-material-panel` para o botão "Selecionar Material" poder fazer scroll até ao painel direito. |

---

## 5. Confirmação de que a tela Início permanece intacta

- O **return antecipado** que renderiza a vista "Nenhuma caixa selecionada" (com NOME DE PROJETO e Notas) **não foi alterado**.
- No **return principal** da tab Início (HOME):  
  - Quando **não** há box selecionado (`!selectedBox`), continuam a ser mostrados o título "Definições", o painel "NOME DE PROJETO" e todo o restante conteúdo como antes.  
  - Quando **há** box selecionado, apenas se escondem o título "Propriedades", o texto "Edite largura...", o campo "NOME DE PROJETO" e se adiciona o botão "Selecionar Material" abaixo de Dimensões.
- Nenhum componente da tela Início foi movido, renomeado ou alterado fora da secção de propriedades do box selecionado.

**TypeScript:** `npx tsc --noEmit` executado com sucesso.
