# Mensagem para a equipe: deploy automático

Equipe,

O projeto agora possui deploy automático. Isso significa que as atualizações são publicadas
no site sem etapas manuais de upload, tornando o processo mais rápido, seguro e padronizado.

## O que é o deploy automático
Deploy automático é um fluxo que pega o código enviado ao GitHub, executa o build e publica
o resultado diretamente na Hostinger. Assim, o ambiente de produção fica sempre alinhado ao
conteúdo do branch `main`.

## Como funciona o fluxo GitHub → Actions → Hostinger
1. Um push é feito no branch `main` do GitHub.
2. O GitHub Actions executa o workflow de deploy:
   - instala dependências,
   - valida a sintaxe,
   - gera o build,
   - valida a pasta `dist`,
   - publica os arquivos via FTP.
3. A Hostinger recebe apenas os arquivos necessários, mantendo o site atualizado.

## Como cada push no `main` publica automaticamente o site
Qualquer commit enviado para `main` dispara o workflow. Se o build passar, o deploy ocorre
automaticamente sem intervenção manual.

## Benefícios para o projeto
- **Velocidade**: publicações mais rápidas e previsíveis.
- **Segurança**: menos risco de erro humano durante o upload.
- **Organização**: histórico claro de mudanças e releases.

## O que a equipe deve fazer
- Sempre trabalhar em branches e abrir PRs para `main`.
- Garantir que o build local está funcionando antes de fazer merge.
- Evitar commits diretos em `main`, salvo exceções combinadas.
- Manter os secrets do FTP configurados no GitHub (`FTP_HOST`, `FTP_USERNAME`,
  `FTP_PASSWORD`, `FTP_PORT`).

Se tiverem dúvidas, me chamem para alinharmos o processo.
