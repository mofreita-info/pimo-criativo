export const howItWorks = `
Fluxo do utilizador:
1) Adiciona caixotes no Workspace e posiciona-os.
2) Ajusta dimensões, portas, gavetas e prateleiras.
3) Clica em “Gerar Design 3D” para calcular.
4) Consulta o corte, custos e exporta.

Fluxo interno:
1) Workspace guarda placeholders (workspaceBoxes).
2) Ao gerar, cada placeholder vira um BoxModule.
3) O Manufacturing Model gera painéis, portas, gavetas e ferragens.
4) O 3D é montado a partir da estrutura calculada.

Como o cálculo é feito:
O sistema aplica regras de espessura, folgas e recuos para obter dimensões industriais.

Como o 3D é gerado:
As peças calculadas são convertidas em geometria 3D e renderizadas no Workspace.
`;
