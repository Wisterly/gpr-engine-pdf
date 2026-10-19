# 📌 Registro Oficial de Pontos de Restauração (PR) - GPR Engine PDF

Este documento registra cronologicamente todos os pontos de restauração do projeto para recuperação imediata sob demanda.

---

## 🔒 REGRA DE OURO DAS RESTAURAÇÕES (ISOLAMENTO DE DADOS vs ESTRUTURA DO SISTEMA)

Toda e qualquer restauração solicitada por você (ex: `PR.001`, `PR.002`, `PR.015`, etc.) segue rigorosamente estes dois pilares:

### 1. O que ENTRA no Ponto de Restauração (É Restaurado):
- **Toda a parte estrutural da suíte web**: Next.js, React, TypeScript, Tailwind CSS e arquivos de código;
- **Layout e disposição visual**: barra superior global com menus e abas, sidebar esquerda, catálogo de ferramentas, caixa retrátil direita, viewport central e gaveta oculta;
- **Comportamento das ferramentas e modos**: Início (Dashboard), Ferramentas (Catálogo Completo) e Documentos abertos;
- **Motores de renderização e exportação**: PDF.js (Canvas) e `pdf-lib` (geração e manipulação de arquivos);
- **Quaisquer modificações estruturais futuras** que possam surgir no desenvolvimento da aplicação.

### 2. O que NÃO ENTRA no Ponto de Restauração (É Mantido e Preservado Intacto):
- **Documentos e arquivos PDF carregados pelo usuário**;
- **Anotações, carimbos e edições locais salvas** em cache ou sessão do usuário;
- **Configurações de ambiente e credenciais**.

---

### [PR.004]
- **Data/Hora:** 18/10/2026 23:42 (Horário Local)
- **Commit Git:** `PR.004` (local e remoto no GitHub)
- **Tag Git:** `PR.004` (local e remota no GitHub)
- **Status:** Ativo / Em Produção
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000
- **Resumo das Alterações Estruturais Contidas:**
  1. **Identidade Visual Dark Industrial Luxury**: Paleta oficial Preto Obsidiana (`#0A0A0C`), Grafite Fosco (`#121316` e `#18191E`), Bordas com brilho dourado escuro (`#26272F` e `rgba(212, 175, 55, 0.18)`), e gradientes Laranja Vibrante para Dourado Metálico (`#FF6B00` a `#D4AF37`).
  2. **Barra Superior Global com Duas Faixas**:
     - *Faixa 1 (Menu de Sistema)*: Logo geométrico dourado GPR ENGINE + menus suspensos (`Arquivo`, `Editar`, `Visualizar`, `Conversão GPR`, `Janela`, `Ajuda`).
     - *Faixa 2 (Navegação por Abas + Busca)*: Abas fixas `Início` e `Ferramentas` + Abas dinâmicas de documentos com fechamento `x` e botão `+` para novo arquivo (com borda inferior ativa de 2px em gradiente dourado/laranja) + busca global.
  3. **Tela 1: Aba "Início" (Dashboard Inicial)**:
     - Sidebar esquerda (240px) com grupos `Recentes`, `Favoritos` (com selo NOVO), `Meu computador` e `Adicionar uma conta...`.
     - Banner horizontal de atalhos rápidos com 5 botões de ação direta (`Criar PDF`, `Compartilhar`, `Preencher e assinar`, `Comentário`, `Otimizar PDF`) + `Ver todas as ferramentas` e card compacto de importação rápida ("Arraste e solte").
     - Tabela de arquivos recentes com colunas de checkbox, miniatura, nome, data e tamanho (com alternância Lista vs Grade).
  4. **Tela 2: Aba de Documento Aberto**:
     - Barra contextual superior dividida em 3 grupos (Salvar, Favoritar, Imprimir, E-mail, Busca; Paginação, Cursores Selecionar/Mão, Zoom %, Ajuste; Botão de destaque Compartilhar em gradiente).
     - Gaveta esquerda oculta retrátil com botão `▸` para expandir miniaturas de páginas.
     - Viewport central escuro com renderização HiDPI e barra flutuante de controle na base (HUD).
     - Caixa de ferramentas direita retrátil com 2 estados: 52px (recolhido com ícones empilhados e seta `◂`) e 280px (ampliado com 12 ferramentas numeradas e seta `▸`).
  5. **Tela 3: Aba "Ferramentas" (Catálogo Completo)**:
     - Barra ampla de pesquisa em tempo real e catálogo categorizado nas 5 seções oficiais (*Criar e editar*, *Compartilhar e revisar*, *Formulários e assinaturas*, *Proteger e padronizar*, *Personalizar*) com cards, ícones grandes estilizados e botões dropdown (`Abrir ▾` / `Adicionar ▾`).
  6. **TypeScript Estrito & Deploy Vercel**: 100% tipado com interfaces limpas, sem recarregamento de página, testado e em produção.

---

### [PR.003]
- **Data/Hora:** 18/10/2026 23:18 (Horário Local)
- **Commit Git:** `89d0f7a`
- **Tag Git:** `PR.003` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.004
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000

---

### [PR.002]
- **Data/Hora:** 18/10/2026 23:06 (Horário Local)
- **Commit Git:** `5c10aea`
- **Tag Git:** `PR.002` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.003

---

### [PR.001]
- **Data/Hora:** 18/10/2026 22:58 (Horário Local)
- **Commit Git:** `3fe4c8f`
- **Tag Git:** `PR.001` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.002
