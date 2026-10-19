# 📌 Registro Oficial de Pontos de Restauração (PR) - GPR Engine PDF

Este documento registra cronologicamente todos os pontos de restauração do projeto para recuperação imediata sob demanda.

---

## 🔒 REGRA DE OURO DAS RESTAURAÇÕES (ISOLAMENTO DE DADOS vs ESTRUTURA DO SISTEMA)

Toda e qualquer restauração solicitada por você (ex: `PR.001`, `PR.002`, `PR.015`, etc.) segue rigorosamente estes dois pilares:

### 1. O que ENTRA no Ponto de Restauração (É Restaurado):
- **Toda a parte estrutural da suíte web**: Next.js, React, TypeScript, Tailwind CSS e arquivos de código;
- **Layout e disposição visual**: barra de ferramentas superior, painel retrátil de miniaturas, viewport central e seletores;
- **Comportamento das ferramentas de edição**: texto livre, carimbos oficiais, marca-texto, caneta e modos de seleção;
- **Motores de renderização e exportação**: PDF.js (Canvas) e `pdf-lib` (geração de arquivos finais);
- **Quaisquer modificações estruturais futuras** que possam surgir no desenvolvimento da aplicação.

### 2. O que NÃO ENTRA no Ponto de Restauração (É Mantido e Preservado Intacto):
- **Documentos e arquivos PDF carregados pelo usuário**;
- **Anotações, carimbos e edições locais salvas** em cache ou sessão do usuário;
- **Configurações de ambiente e credenciais**.

---

### [PR.003]
- **Data/Hora:** 18/10/2026 23:17 (Horário Local)
- **Commit Git:** `PR.003` (local e remoto no GitHub)
- **Tag Git:** `PR.003` (local e remota no GitHub)
- **Status:** Ativo / Em Produção
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000
- **Resumo das Alterações Estruturais Contidas:**
  1. **Engenharia Reversa Completa do Adobe Acrobat Pro (Layout, Ferramentas e Ergonomia)**:
     - **Faixa Superior Global de Modos**: *Visualizar*, *Comentar & Anotar*, *Editar PDF*, *Organizar Páginas* e *Preencher & Assinar (Fill & Sign)*.
     - **Barra de Ferramentas Contextual Dinâmica**: ferramentas adaptativas com paleta de cores nobres, espessura do traço e botões de ação rápida.
     - **Dock Lateral de Ícones Verticais (Acrobat Left Rail)**: alternância entre miniaturas de páginas, linha do tempo de comentários com autor/página/hora e localizador de texto.
     - **Módulo Fill & Sign Oficial**: modal interativo para criação de assinatura digital manuscrita ou caligráfica, vistos de aprovação (✓), marcação de erros (✗) e pontos de vistoria (•).
     - **Notas Adesivas (Sticky Notes do Acrobat)**: balãozinhos de observações técnicas com popover de texto e autor.
     - **Formas Geométricas**: inserção de retângulos, círculos, setas indicativas e linhas retas.
     - **HUD Flutuante Inferior (Acrobat Bottom Pill)**: navegação rápida de páginas, alternância entre cursor de seleção e mãozinha (pan/arraste), e zoom rápido.
     - **Histórico & Atalhos Oficiais**: suporte a Desfazer (`Ctrl+Z`), atalhos de seleção (`V`), mãozinha (`H`), realce (`U`), texto (`T`), nota adesiva (`S`) e zoom (`+`/`-`).
  2. Preservação integral do tema executivo de alto padrão (*Luxury Obsidian & Gold*).

---

### [PR.002]
- **Data/Hora:** 18/10/2026 23:06 (Horário Local)
- **Commit Git:** `5c10aea`
- **Tag Git:** `PR.002` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.003
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000
- **Resumo das Alterações Estruturais Contidas:**
  1. Redesenho visual completo para tema executivo de alto padrão (Luxury Obsidian & Gold).

---

### [PR.001]
- **Data/Hora:** 18/10/2026 22:58 (Horário Local)
- **Commit Git:** `3fe4c8f`
- **Tag Git:** `PR.001` (local e remota no GitHub)
- **Status:** Arquivado / Sucessor: PR.002
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000
