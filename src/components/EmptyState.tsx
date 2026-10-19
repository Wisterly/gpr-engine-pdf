'use client';

import React, { useRef } from 'react';
import { FileUp, Sparkles, Shield, Cpu, Layers, Crown } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface EmptyStateProps {
  onLoadFile: (file: File) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onLoadFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      onLoadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Cria um PDF de demonstração nobre com pdf-lib
  const handleLoadSamplePDF = async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const regular = await doc.embedFont(StandardFonts.Helvetica);

    // Página 1: Relatório de Demonstração
    const page1 = doc.addPage([595, 842]); // A4
    page1.drawText('GPR ENGINE PDF - SUÍTE PROFISSIONAL', {
      x: 50,
      y: 770,
      size: 20,
      font: font,
      color: rgb(0.96, 0.62, 0.04), // Dourado
    });

    page1.drawText('Demonstração e Validação de Renderização Web em Alta Fidelidade', {
      x: 50,
      y: 745,
      size: 13,
      font: regular,
      color: rgb(0.7, 0.65, 0.58),
    });

    page1.drawRectangle({
      x: 50,
      y: 560,
      width: 495,
      height: 160,
      borderWidth: 1.5,
      borderColor: rgb(0.85, 0.55, 0.05),
      color: rgb(0.06, 0.06, 0.08),
    });

    page1.drawText('Funcionalidades de Alto Nível Prontas:', {
      x: 70,
      y: 690,
      size: 14,
      font: font,
      color: rgb(0.99, 0.9, 0.6),
    });

    const items = [
      '1. Renderização pura de alta resolução via PDF.js (Canvas HiDPI);',
      '2. Inserção de texto livre, destaques dourados e anotações com caneta;',
      '3. Aplicação de carimbos oficiais com padrão nobre (Aprovado, Medido GPR, Conferido);',
      '4. Rotação individual de 90° e reordenação instantânea de páginas no painel lateral;',
      '5. Exportação e download final preservando vetores e camadas com pdf-lib.',
    ];

    items.forEach((item, idx) => {
      page1.drawText(item, {
        x: 70,
        y: 660 - idx * 22,
        size: 11,
        font: regular,
        color: rgb(0.9, 0.88, 0.85),
      });
    });

    // Página 2: Página secundária para testar paginação e miniaturas
    const page2 = doc.addPage([595, 842]);
    page2.drawText('PÁGINA 2 - FOLHA DE MEDIÇÃO & OBSERVAÇÕES TÉCNICAS', {
      x: 50,
      y: 770,
      size: 18,
      font: font,
      color: rgb(0.97, 0.45, 0.08), // Laranja real
    });
    page2.drawText('Esta segunda página demonstra a ordenação, miniaturas e remoção de páginas.', {
      x: 50,
      y: 745,
      size: 12,
      font: regular,
      color: rgb(0.65, 0.6, 0.55),
    });

    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const sampleFile = new File([blob], 'Demonstracao_GPR_Engine_Luxo.pdf', {
      type: 'application/pdf',
    });

    onLoadFile(sampleFile);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex-1 flex flex-col items-center justify-center p-8 bg-dark-luxury select-none relative overflow-hidden"
    >
      {/* Brilho Dourado Sutil de Fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onLoadFile(file);
        }}
        className="hidden"
      />

      <div className="relative max-w-xl w-full p-10 rounded-3xl border border-brand-cardBorder bg-brand-panel/85 backdrop-blur-xl flex flex-col items-center text-center shadow-goldGlow hover:border-amber-500/40 transition-all duration-300">
        {/* Ícone Nobre Dourado / Laranja */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 shadow-goldGlow animate-pulse">
          <FileUp size={38} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Crown size={13} className="text-amber-400" />
          <span>Suíte de Alta Precisão</span>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
          GPR Engine <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">PDF Pro</span>
        </h2>
        <p className="text-sm text-brand-muted max-w-md mb-8 font-medium">
          Arraste e solte o seu arquivo PDF aqui, ou escolha uma das opções abaixo para abrir e
          iniciar a edição com fidelidade máxima.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-500 hover:to-amber-500 text-black text-sm font-black shadow-goldGlow hover:shadow-goldGlowLg transition-all"
          >
            <FileUp size={18} />
            <span>Selecionar Arquivo PDF</span>
          </button>

          <button
            onClick={handleLoadSamplePDF}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-amber-300 hover:text-white text-sm font-semibold border border-brand-cardBorder hover:border-amber-500/40 transition-all"
          >
            <Sparkles size={18} className="text-amber-400" />
            <span>Carregar Exemplo de Teste</span>
          </button>
        </div>

        {/* Pilares técnicos destacados */}
        <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-brand-cardBorder/80 w-full text-left">
          <div className="flex items-start gap-2">
            <Cpu size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">PDF.js Engine</p>
              <p className="text-[10px] text-brand-muted">Renderização pura via Canvas</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Layers size={16} className="text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">pdf-lib</p>
              <p className="text-[10px] text-brand-muted">Manipulação vetorial de alta gama</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield size={16} className="text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">100% Seguro</p>
              <p className="text-[10px] text-brand-muted">Processado no seu navegador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
