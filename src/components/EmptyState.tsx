'use client';

import React, { useRef } from 'react';
import { FileUp, Sparkles, Shield, Cpu, Layers } from 'lucide-react';
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

  // Cria um PDF de demonstração com pdf-lib para teste imediato
  const handleLoadSamplePDF = async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const regular = await doc.embedFont(StandardFonts.Helvetica);

    // Página 1: Relatório de Demonstração
    const page1 = doc.addPage([595, 842]); // A4
    page1.drawText('GPR ENGINE PDF - SUÍTE DE TESTES', {
      x: 50,
      y: 770,
      size: 20,
      font: font,
      color: rgb(0.23, 0.51, 0.96),
    });

    page1.drawText('Demonstração e Validação de Renderização Web', {
      x: 50,
      y: 745,
      size: 13,
      font: regular,
      color: rgb(0.58, 0.64, 0.72),
    });

    page1.drawRectangle({
      x: 50,
      y: 560,
      width: 495,
      height: 160,
      borderWidth: 1,
      borderColor: rgb(0.14, 0.22, 0.36),
      color: rgb(0.07, 0.11, 0.18),
    });

    page1.drawText('Funcionalidades Prontas para Uso:', {
      x: 70,
      y: 690,
      size: 14,
      font: font,
      color: rgb(1, 1, 1),
    });

    const items = [
      '1. Renderização de alta fidelidade no navegador via PDF.js (Canvas);',
      '2. Inserção de texto livre, destaques coloridos e caneta livre;',
      '3. Aplicação de carimbos oficiais (Aprovado, Medido GPR, Conferido);',
      '4. Rotação individual de 90° e reordenação instantânea de páginas;',
      '5. Exportação e download final preservando vetores e camadas com pdf-lib.',
    ];

    items.forEach((item, idx) => {
      page1.drawText(item, {
        x: 70,
        y: 660 - idx * 22,
        size: 11,
        font: regular,
        color: rgb(0.85, 0.88, 0.92),
      });
    });

    // Página 2: Página secundária para testar paginação e miniaturas
    const page2 = doc.addPage([595, 842]);
    page2.drawText('PÁGINA 2 - FOLHA DE MEDIÇÃO & OBSERVAÇÕES', {
      x: 50,
      y: 770,
      size: 18,
      font: font,
      color: rgb(0.06, 0.72, 0.51),
    });
    page2.drawText('Esta segunda página demonstra a ordenação, miniaturas e remoção de páginas.', {
      x: 50,
      y: 745,
      size: 12,
      font: regular,
      color: rgb(0.58, 0.64, 0.72),
    });

    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const sampleFile = new File([blob], 'Demonstracao_GPR_Engine.pdf', {
      type: 'application/pdf',
    });

    onLoadFile(sampleFile);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex-1 flex flex-col items-center justify-center p-8 bg-brand-dark select-none"
    >
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

      <div className="max-w-xl w-full p-10 rounded-3xl border-2 border-dashed border-brand-cardBorder/80 bg-brand-panel/60 backdrop-blur-md flex flex-col items-center text-center shadow-2xl hover:border-brand-accent/60 transition-all">
        <div className="w-20 h-20 rounded-2xl bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent mb-6 shadow-inner animate-pulse">
          <FileUp size={38} />
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          GPR Engine <span className="text-brand-accent">PDF Suite</span>
        </h2>
        <p className="text-sm text-brand-muted max-w-md mb-8">
          Arraste e solte o seu arquivo PDF aqui, ou escolha uma das opções abaixo para abrir e
          iniciar a edição com fidelidade profissional.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white text-sm font-bold shadow-lg shadow-brand-accent/25 transition-all"
          >
            <FileUp size={18} />
            <span>Selecionar Arquivo PDF</span>
          </button>

          <button
            onClick={handleLoadSamplePDF}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-brand-cyan hover:text-white text-sm font-semibold border border-brand-cardBorder transition-all"
          >
            <Sparkles size={18} />
            <span>Carregar Exemplo de Teste</span>
          </button>
        </div>

        {/* Pilares técnicos destacados */}
        <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-brand-cardBorder/50 w-full text-left">
          <div className="flex items-start gap-2">
            <Cpu size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">PDF.js Engine</p>
              <p className="text-[10px] text-brand-muted">Renderização pura via Canvas</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Layers size={16} className="text-brand-emerald shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">pdf-lib</p>
              <p className="text-[10px] text-brand-muted">Manipulação e exportação vetorial</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield size={16} className="text-brand-amber shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">100% Seguro</p>
              <p className="text-[10px] text-brand-muted">Processado no seu navegador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
