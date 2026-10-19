# 📑 GPR Engine PDF - Suíte de Edição & Manipulação Web

Aplicação web completa, moderna e leve (alternativa ao Adobe Acrobat Pro) para visualização, anotações em alta fidelidade, manipulação de páginas e exportação final de PDFs, desenvolvida para rodar com performance máxima no navegador e hospedagem direta na **Vercel**.

---

## ✨ Funcionalidades Principais

### 1. 🔍 Visualizador de PDF em Alta Resolução (Canvas HiDPI)
- Renderização via **PDF.js** com suporte a telas Retina e dispositivos HiDPI.
- Controle dinâmico de Zoom (reduzir, ampliar, ajustar à tela e reset para 100%).
- Navegação fluida de páginas via botões e atalhos de teclado (`←` / `→` ou `PageUp` / `PageDown`).

### 2. ✏️ Ferramentas de Edição e Anotação em Tempo Real
- **Texto Livre (`T`)**: Adicione caixas de texto com cor e tamanho ajustáveis em qualquer posição da página.
- **Caneta / Desenho Livre (`P`)**: Traços suaves para assinaturas, rabiscos e anotações técnicas.
- **Marca-Texto / Destaque (`H`)**: Destaque translúcido amarelo/âmbar ou colorido para evidenciar partes do documento.
- **Carimbos Oficiais GPR (`S`)**: Aplicação com 1 clique de carimbos padronizados (*APROVADO, CONFERIDO, MEDIDO GPR, EM ANÁLISE, URGENTE*).
- **Paleta de Cores**: Azul GPR, Esmeralda, Âmbar, Vermelho Urgente, Roxo e Branco.

### 3. 📑 Gestão Completa de Páginas (Painel Lateral Retrátil)
- Miniaturas ao vivo renderizadas para cada página do documento.
- **Rotação de 90°**: Gire páginas individualmente ou a página atual.
- **Reordenação de Páginas**: Mova páginas para cima ou para baixo instantaneamente.
- **Exclusão de Páginas**: Remova páginas indesejadas do arquivo final.

### 4. 💾 Exportação e Download (pdf-lib)
- Aplicação das rotações, exclusões e anotações diretamente no arquivo original.
- Preservação da fidelidade dos textos e vetores nativos do PDF.
- Download imediato com 1 clique (`_editado.pdf`).

---

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS (Dark Mode com paleta Navy/Slate `#0b111e`, `#111b2d`, `#16233b`)
- **Ícones**: Lucide React
- **Renderização Web**: PDF.js (Mozilla)
- **Manipulação Vetorial & Salvamento**: pdf-lib
- **Deploy**: Otimizado para build estático e serverless na **Vercel**

---

## 🚀 Como Rodar Localmente

1. Dê um duplo clique no arquivo `iniciar_sistema.bat` ou execute no terminal:
```bash
npm run dev
```
2. Acesse no navegador:
```
http://localhost:3000
```

---

## ☁️ Deploy na Vercel a partir do GitHub

1. Inicialize o repositório git e envie para o seu GitHub:
```bash
git init
git add .
git commit -m "feat: initial commit - GPR Engine PDF Suite"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gpr-engine-pdf.git
git push -u origin main
```
2. Acesse seu painel na [Vercel](https://vercel.com) e clique em **Add New > Project**.
3. Selecione o repositório **gpr-engine-pdf**.
4. O Next.js será detectado automaticamente. Clique em **Deploy**.
5. Pronto! A aplicação estará no ar com link público HTTPS.
