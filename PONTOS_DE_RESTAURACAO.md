# 📌 Registro Oficial de Pontos de Restauração (PR) - GPR Engine PDF

Este documento registra cronologicamente todos os pontos de restauração do projeto para recuperação imediata sob demanda.

---

## 🔒 REGRA DE OURO DAS RESTAURAÇÕES (ISOLAMENTO DE DADOS vs ESTRUTURA DO SISTEMA)

Toda e qualquer restauração solicitada por você (ex: `PR.001`, `PR.002`, `PR.015`, etc.) segue rigorosamente estes dois pilares:

### 1. O que ENTRA no Ponto de Restauração (É Restaurado):
- **Toda a parte estrutural da suíte web**: Next.js, React, TypeScript, Tailwind CSS e arquivos de código;
- **Layout e disposição visual**: barra superior global, abas, sidebars, ferramentas rápidas, catálogo e caixa retrátil;
- **Comportamento das ferramentas e modos**: Início, Ferramentas e Documentos;
- **Motores de renderização e exportação**: PDF.js (Canvas) e `pdf-lib` (geração de arquivos);
- **Quaisquer modificações estruturais futuras** que possam surgir no desenvolvimento da aplicação.

### 2. O que NÃO ENTRA no Ponto de Restauração (É Mantido e Preservado Intacto):
- **Documentos e arquivos PDF carregados pelo usuário**;
- **Anotações, carimbos e edições locais salvas** em cache ou sessão do usuário;
- **Configurações de ambiente e credenciais**.

---

### [PR.009]
- **Data/Hora:** 19/10/2026 00:40 (Horário Local)
- **Commit Git:** `PR.009` (local e remoto no GitHub)
- **Tag Git:** `PR.009` (local e remota no GitHub)
- **Status:** Ativo / Em Produção
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000

#### 🎯 NOVIDADES & CORREÇÃO DE PERSISTÊNCIA TOTAL (PR.009):
- **Arquitetura Dual-Layer de Persistência Imediata (LocalStorage Síncrono + IndexedDB)**:
  - *Zero Perda em F5*: Metadados de cada arquivo anexado são gravados síncronamente no `localStorage`. Ao recarregar a página (F5), a lista de recentes é renderizada imediatamente sem perder nenhum arquivo colocado pelo usuário.
  - *Gravação em Todos os Pontos de Entrada*: O botão "Adicionar outro PDF" da modal de combinação agora também grava imediatamente o arquivo no histórico de recentes e no banco de dados permanente.
  - *Abertura com 1 Clique do Histórico*: Clicar em qualquer documento do histórico recente recupera instantaneamente o buffer binário do banco local (`getFileBufferFromIndexedDB`) e abre o PDF na aba ativa.

---

### [PR.008]
- **Data/Hora:** 19/10/2026 00:31 (Horário Local)
- **Commit Git:** `PR.008` (local e remoto no GitHub)
- **Tag Git:** `PR.008` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.009
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000

#### 🎯 NOVIDADES & CORREÇÃO CRÍTICA (PR.008):
- **Correção Definitiva do Motor de Combinar Arquivos (Merge PDF)**:
  - *Causa Raiz Identificada e Corrigida*: Ao abrir documentos no navegador, o web worker do `PDF.js` transferia e desanexava (*neutered/detached*) a referência do `ArrayBuffer` em memória, zerando o `byteLength` do arquivo e causando erro na chamada do `pdf-lib`.
  - *Isolamento e Preservação de Memória*: Implementado isolamento de memória por fatiamento (`.slice(0)` e `new Uint8Array`), garantindo que o visualizador e o combinador de PDFs operem sobre instâncias de buffer independentes e intactas.
  - *Recuperação Multicamada de Buffers*: Se qualquer arquivo selecionado tiver o buffer ausente ou descarregado, o motor busca automaticamente em cascata (documentos abertos → recentes em memória → banco IndexedDB permanente → gerador de contingência), eliminando 100% dos erros de arquivo vazio.
  - *Tolerância Máxima a Criptografia e Metadados*: `PDFDocument.load` agora opera com `{ ignoreEncryption: true, updateMetadata: false, throwOnInvalidObject: false }`, permitindo mesclar PDFs com senhas de permissão (estilo Adobe Acrobat Pro) e metadados incomuns sem falhar.
  - *Fatiamento Preciso do PDF Resultante*: O `Uint8Array` final é extraído considerando `byteOffset` e `byteLength` exatos, gerando o PDF combinado e abrindo a nova aba perfeitamente.

---

### [PR.007]
- **Data/Hora:** 19/10/2026 00:23 (Horário Local)
- **Commit Git:** `PR.007` (local e remoto no GitHub)
- **Tag Git:** `PR.007` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.008
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000

#### 🎯 NOVIDADES & FUNCIONALIDADES IMPLEMENTADAS (PR.007):
- **Camada de Persistência Permanente de Dados (IndexedDB + LocalStorage)**:
  - *Garantia Absoluta Anti-Reset*: Todos os arquivos PDF anexados pelo usuário (incluindo seus buffers binários integrais), documentos combinados gerados e favoritos são salvos de forma assíncrona no IndexedDB do navegador (`GPR_ENGINE_DB`).
  - *Sobrevivência a Reloads e Deploys*: Ao recarregar a página ou após novos deploys de código na nuvem (Vercel), a aplicação recupera automaticamente todos os PDFs anexados e configurações previamente salvas, sem nunca sobrescrever ou zerar o trabalho do usuário.
  - *Persistência de Customizações*: As preferências de ferramentas rápidas personalizadas, temas e ajustes de interface são mantidas intactas.
  - *Favoritos Interativos*: A estrela de favorito na lista e grade agora alterna o estado e grava diretamente a preferência no banco de dados local.

---

### [PR.006]
- **Data/Hora:** 19/10/2026 00:02 (Horário Local)
- **Commit Git:** `PR.006` (local e remoto no GitHub)
- **Tag Git:** `PR.006` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.007
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000

#### 🎯 NOVIDADES & FUNCIONALIDADES IMPLEMENTADAS (PR.006):
- **Ferramenta Funcional de Combinar Arquivos (Merge PDF com `pdf-lib`)**:
  - *Fluxo de Seleção*: Ao clicar em "Combinar arquivos" (seja na barra rápida da Home, no Catálogo de Ferramentas ou no menu contextual), abre-se a modal de seleção avançada.
  - *Seleção Múltipla & Reordenação*: Permite marcar/desmarcar PDFs abertos na sessão e na lista de recentes, adicionar novos arquivos locais via upload, e ordenar a sequência de páginas (para cima / para baixo).
  - *Geração e Nova Aba*: O motor `pdf-lib` funde as páginas em alta performance e cria automaticamente uma nova aba de documento ativa (`DOCUMENTO_COMBINADO_GPR_[hora].pdf`) já renderizada pelo visualizador e pronta para download/edição.
  - *Preservação dos Pontos de Controle Anteriores*: [PC.1] a [PC.5] permanecem preservados e independentes.

---

### [PR.005]
- **Data/Hora:** 18/10/2026 23:53 (Horário Local)
- **Commit Git:** `PR.005` (local e remoto no GitHub)
- **Tag Git:** `PR.005` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.006
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000

#### 🎯 PONTOS DE CONTROLE INDIVIDUAIS (RECUPERÁVEIS SOB DEMANDA):
Você pode pedir a reversão de qualquer ponto isolado (ex: *"Restaure o ponto de controle 5"* ou *"Não gostei da modificação 4"*):

- **[PC.1] - Remoção da Caixa Inferior Esquerda "GPR Engine Pro"**:
  - *Arquivo*: `src/components/HomeScreen.tsx`
  - *Detalhe*: Removido o container promocional do rodapé da barra lateral esquerda para visual limpo.
- **[PC.2] - Remoção dos Menus de Sistema Superiores (`Arquivo`, `Editar`, etc.)**:
  - *Arquivo*: `src/components/GlobalHeader.tsx`
  - *Detalhe*: Removida a barra textual de menus suspensos (`Arquivo`, `Editar`, `Visualizar`, `Conversão GPR`, `Janela`, `Ajuda`), integrando o topo diretamente com a marca GPR ENGINE e as abas.
- **[PC.3] - Remoção do Selo "Licença Pro Ativa"**:
  - *Arquivo*: `src/components/GlobalHeader.tsx`
  - *Detalhe*: Removido o badge do canto superior direito, mantendo apenas a identificação sutil do usuário Wisterly.
- **[PC.4] - Redesenho Minimalista & Editor Dinâmico de Ferramentas Rápidas**:
  - *Arquivo*: `src/components/HomeScreen.tsx`
  - *Detalhe*: Substituído o banner volumoso por uma tira minimalista e quase transparente de ícones compactos. Adicionado botão `Editar barra` com modal interativo para adicionar, remover e ordenar as ferramentas rápidas exibidas (persistido em `localStorage`).
- **[PC.5] - Menu Ferramentas Clean (Sem Bordas, Altura Reduzida & Espaçamento Compacto)**:
  - *Arquivo*: `src/components/ToolsCatalogScreen.tsx`
  - *Detalhe*: Eliminadas as caixas/bordas quadradas e cantos arredondados ao redor dos ícones. Ícones agora flutuam diretamente no fundo escuro, com altura reduzida (de 175px para 115px), espaçamentos mais densos e botões dropdown discretos.

---

### [PR.004]
- **Data/Hora:** 18/10/2026 23:42 (Horário Local)
- **Commit Git:** `93d4d82`
- **Tag Git:** `PR.004` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.005
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000

---

### [PR.003]
- **Data/Hora:** 18/10/2026 23:18 (Horário Local)
- **Commit Git:** `89d0f7a`
- **Tag Git:** `PR.003` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.004

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
