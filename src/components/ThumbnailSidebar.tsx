'use client';

import React, { useEffect, useRef } from 'react';
import { RotateCw, Trash2, ArrowUp, ArrowDown, Layers } from 'lucide-react';
import { PDFPageInfo } from '@/types/pdf';

interface ThumbnailSidebarProps {
  isOpen: boolean;
  pages: PDFPageInfo[];
  currentPage: number;
  pdfDoc: any;
  onSelectPage: (pageNumber: number) => void;
  onRotatePage: (pageIndex: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onMovePage: (fromIndex: number, direction: 'up' | 'down') => void;
}

const ThumbnailItem: React.FC<{
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isCancelled = false;
    if (!pdfDoc || !canvasRef.current) return;

    const renderThumbnail = async () => {
      try {
        const page = await pdfDoc.getPage(pageInfo.pageIndex + 1);
        if (isCancelled) return;

        const viewport = page.getViewport({
          scale: 0.25,
          rotation: (page.rotate + pageInfo.rotation) % 360,
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;
      } catch (err) {
        console.error('Erro renderizando thumbnail', err);
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
      className={`group relative flex flex-col items-center p-2.5 rounded-2xl transition-all cursor-pointer border ${
        isActive
          ? 'bg-amber-500/10 border-amber-500 shadow-goldGlow ring-1 ring-amber-500/60'
          : 'bg-brand-card/70 border-brand-cardBorder hover:border-amber-500/40 hover:bg-brand-card'
      }`}
    >
      {/* Indicador do número da página */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <span
          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg ${
            isActive
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-sm'
              : 'bg-brand-dark/90 text-brand-mutedGold border border-brand-cardBorder'
          }`}
        >
          Pág. {pageInfo.pageNumber}
        </span>

        {/* Botões rápidos em hover */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity bg-brand-dark/95 px-1 py-0.5 rounded-lg border border-brand-cardBorder shadow-md"
        >
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            title="Mover para cima"
            className="p-1 text-brand-muted hover:text-amber-400 disabled:opacity-30"
          >
            <ArrowUp size={11} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === totalActive - 1}
            title="Mover para baixo"
            className="p-1 text-brand-muted hover:text-amber-400 disabled:opacity-30"
          >
            <ArrowDown size={11} />
          </button>
          <button
            onClick={onRotate}
            title="Girar 90°"
            className="p-1 text-brand-muted hover:text-amber-400"
          >
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

      {/* Miniatura do Canvas */}
      <div className="w-full aspect-[1/1.4] bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-inner border border-black/40">
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
      </div>
    </div>
  );
};

export const ThumbnailSidebar: React.FC<ThumbnailSidebarProps> = ({
  isOpen,
  pages,
  currentPage,
  pdfDoc,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onMovePage,
}) => {
  if (!isOpen) return null;

  const activePages = pages.filter((p) => !p.isDeleted);

  return (
    <aside className="w-64 border-r border-brand-cardBorder bg-brand-panel flex flex-col h-[calc(100vh-4rem)] select-none">
      <div className="p-3.5 border-b border-brand-cardBorder flex items-center justify-between bg-brand-dark/40">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-amber-400" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            Páginas ({activePages.length})
          </span>
        </div>
        <span className="text-[10px] text-brand-mutedGold font-mono">Reordene / Gire</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activePages.map((page, index) => (
          <ThumbnailItem
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
  );
};
