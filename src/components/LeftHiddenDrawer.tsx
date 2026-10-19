'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, Layers, RotateCw, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { PDFPageInfo } from '@/types/pdf';

interface LeftHiddenDrawerProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  pages: PDFPageInfo[];
  currentPage: number;
  pdfDoc: any;
  onSelectPage: (pageNumber: number) => void;
  onRotatePage: (pageIndex: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onMovePage: (fromIndex: number, direction: 'up' | 'down') => void;
}

const ThumbnailMiniCard: React.FC<{
  pageInfo: PDFPageInfo;
  isActive: boolean;
  index: number;
  totalActive: number;
  pdfDoc: any;
  onSelect: () => void;
  onRotate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}> = ({
  pageInfo,
  isActive,
  index,
  totalActive,
  pdfDoc,
  onSelect,
  onRotate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    let isCancelled = false;
    if (!pdfDoc || !canvasRef.current) return;

    const renderThumbnail = async () => {
      try {
        const page = await pdfDoc.getPage(pageInfo.pageIndex + 1);
        if (isCancelled) return;

        const viewport = page.getViewport({
          scale: 0.22,
          rotation: (page.rotate + pageInfo.rotation) % 360,
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch (err) {
        // Ignora cancelamentos
      }
    };

    renderThumbnail();
    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageInfo.pageIndex, pageInfo.rotation]);

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col items-center p-2 rounded-2xl transition-all cursor-pointer border ${
        isActive
          ? 'bg-gold-metallic/10 border-gold-metallic shadow-goldGlow ring-1 ring-gold-metallic'
          : 'bg-obsidian-card border-obsidian-border hover:border-gold-metallic/40 hover:bg-obsidian-hover'
      }`}
    >
      <div className="w-full flex items-center justify-between mb-1.5 px-1">
        <span
          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            isActive
              ? 'bg-gradient-orange-gold text-black font-extrabold shadow-sm'
              : 'bg-obsidian-panelDark text-brand-mutedGold border border-obsidian-border'
          }`}
        >
          {pageInfo.pageNumber}
        </span>

        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity bg-obsidian-bg px-1 py-0.5 rounded border border-obsidian-border"
        >
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            title="Mover para cima"
            className="p-1 text-brand-muted hover:text-gold-metallic disabled:opacity-30"
          >
            <ArrowUp size={11} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === totalActive - 1}
            title="Mover para baixo"
            className="p-1 text-brand-muted hover:text-gold-metallic disabled:opacity-30"
          >
            <ArrowDown size={11} />
          </button>
          <button onClick={onRotate} title="Girar 90°" className="p-1 text-brand-muted hover:text-gold-metallic">
            <RotateCw size={11} />
          </button>
          <button
            onClick={onDelete}
            disabled={totalActive <= 1}
            title="Excluir página"
            className="p-1 text-brand-muted hover:text-brand-rose disabled:opacity-30"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <div className="w-full aspect-[1/1.4] bg-white rounded flex items-center justify-center overflow-hidden shadow-inner border border-black/30">
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
      </div>
    </div>
  );
};

export const LeftHiddenDrawer: React.FC<LeftHiddenDrawerProps> = ({
  isExpanded,
  onToggleExpand,
  pages,
  currentPage,
  pdfDoc,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onMovePage,
}) => {
  const activePages = pages.filter((p) => !p.isDeleted);

  return (
    <div className="relative flex select-none z-20">
      {/* Faixa vertical fina na extrema esquerda com botão ▸ / ◂ */}
      <div className="w-9 border-r border-obsidian-border bg-obsidian-panel flex flex-col items-center py-3 justify-between">
        <button
          onClick={onToggleExpand}
          title={isExpanded ? 'Ocultar miniaturas' : 'Expandir miniaturas de páginas'}
          className="w-7 h-7 rounded-lg bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-gold-metallic hover:text-white flex items-center justify-center transition-all shadow-sm"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className="writing-mode-vertical text-[10px] text-brand-muted uppercase tracking-widest font-bold py-6 rotate-180">
          Miniaturas
        </div>

        <div className="w-2 h-2 rounded-full bg-orange-vibrant" />
      </div>

      {/* Gaveta Expandida (220px) */}
      {isExpanded && (
        <aside className="w-56 border-r border-obsidian-border bg-obsidian-panel flex flex-col h-full animate-in slide-in-from-left duration-200">
          <div className="p-3 border-b border-obsidian-border flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-white text-xs uppercase tracking-wider">
              <Layers size={14} className="text-gold-metallic" />
              <span>Páginas ({activePages.length})</span>
            </div>
            <span className="text-[10px] text-brand-mutedGold font-mono">Organizar</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
            {activePages.map((page, index) => (
              <ThumbnailMiniCard
                key={`${page.pageIndex}-${page.rotation}`}
                pageInfo={page}
                isActive={page.pageNumber === currentPage}
                index={index}
                totalActive={activePages.length}
                pdfDoc={pdfDoc}
                onSelect={() => onSelectPage(page.pageNumber)}
                onRotate={() => onRotatePage(page.pageIndex)}
                onDelete={() => onDeletePage(page.pageIndex)}
                onMoveUp={() => onMovePage(index, 'up')}
                onMoveDown={() => onMovePage(index, 'down')}
              />
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};
