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

### [PR.005]
- **Data/Hora:** 18/10/2026 23:53 (Horário Local)
- **Commit Git:** `PR.005` (local e remoto no GitHub)
- **Tag Git:** `PR.005` (local e remota no GitHub)
- **Status:** Ativo / Em Produção
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
