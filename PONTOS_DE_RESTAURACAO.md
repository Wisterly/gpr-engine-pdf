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

### [PR.001]
- **Data/Hora:** 18/10/2026 22:58 (Horário Local)
- **Commit Git:** Inicial / Produção
- **Tag Git:** `PR.001` (local e remota no GitHub)
- **Status:** Ativo / Em Produção
- **Links:**
  - Produção Oficial (Vercel): https://gpr-engine-pdf.vercel.app
  - Repositório GitHub: https://github.com/Wisterly/gpr-engine-pdf
  - Localhost: http://localhost:3000
- **Resumo das Alterações Estruturais Contidas:**
  1. Criação da suíte web completa com Next.js 14 (App Router), TypeScript e Tailwind CSS Dark Mode (paleta oficial Navy/Slate).
  2. Implementação da barra superior completa com ferramentas de edição (Selecionar, Texto, Caneta, Marca-texto, Carimbos GPR, Zoom, Paginação e Download).
  3. Painel lateral retrátil com miniaturas em tempo real, suporte a reordenação (cima/baixo), rotação de 90° e exclusão de páginas.
  4. Viewport central com Canvas de alta fidelidade HiDPI via PDF.js e camada de sobreposição vetorial interativa com coordenadas normalizadas.
  5. Motor de exportação com `pdf-lib` para download em 1 clique preservando as páginas e camadas.
  6. Tela inicial com Drag & Drop e gerador de PDF de demonstração com 1 clique para testes imediatos.
  7. Deploy automatizado na Vercel e versionamento completo no GitHub.
