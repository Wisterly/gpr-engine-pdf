'use client';

import React, { useState } from 'react';
import {
  Layers,
  MessageSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { PDFPageInfo, PageAnnotations } from '@/types/pdf';
import { AcrobatCommentsPanel } from './AcrobatCommentsPanel';

type LeftDockTab = 'thumbnails' | 'comments' | 'search';

interface AcrobatLeftDockProps {
  isOpen: boolean;
  activeTab: LeftDockTab;
  pages: PDFPageInfo[];
  currentPage: number;
  pdfDoc: any;
  pageAnnotations: Record<number, PageAnnotations>;
  onToggleOpen: () => void;
  onChangeTab: (tab: LeftDockTab) => void;
  onSelectPage: (pageNumber: number) => void;
  onRotatePage: (pageIndex: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onMovePage: (fromIndex: number, direction: 'up' | 'down') => void;
  onDeleteComment: (pageNumber: number, commentId: string, type: 'text' | 'sticky' | 'signature') => void;
}

const ThumbnailCard: React.FC<{
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

    const renderThumb = async () => {
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
      } catch (e) {
        // Ignora cancelamentos rápidos
      }
    };

    renderThumb();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageInfo.pageIndex, pageInfo.rotation]);

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col items-center p-2 rounded-2xl transition-all cursor-pointer border ${
        isActive
          ? 'bg-amber-500/10 border-amber-500 shadow-goldGlow ring-1 ring-amber-500/70'
          : 'bg-brand-card/70 border-brand-cardBorder hover:border-amber-500/40 hover:bg-brand-card'
      }`}
    >
      <div className="w-full flex items-center justify-between mb-1.5 px-1">
        <span
          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            isActive
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-sm'
              : 'bg-brand-dark text-brand-mutedGold border border-brand-cardBorder'
          }`}
        >
          {pageInfo.pageNumber}
        </span>

        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity bg-brand-dark/95 px-1 py-0.5 rounded border border-brand-cardBorder"
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
          <button onClick={onRotate} title="Girar 90°" className="p-1 text-brand-muted hover:text-amber-400">
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

      <div className="w-full aspect-[1/1.4] bg-white rounded-md flex items-center justify-center overflow-hidden shadow-inner border border-black/30">
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
      </div>
    </div>
  );
};

export const AcrobatLeftDock: React.FC<AcrobatLeftDockProps> = ({
  isOpen,
  activeTab,
  pages,
  currentPage,
  pdfDoc,
  pageAnnotations,
  onToggleOpen,
  onChangeTab,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onMovePage,
  onDeleteComment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const activePages = pages.filter((p) => !p.isDeleted);

  return (
    <div className="flex h-full border-r border-brand-cardBorder bg-brand-panel select-none z-20">
      {/* Trilho Vertical Estreito de Ícones (Vertical Icon Rail do Acrobat) */}
      <div className="w-12 border-r border-brand-cardBorder/80 bg-brand-dark flex flex-col items-center py-3 gap-2">
        <button
          onClick={() => {
            if (isOpen && activeTab === 'thumbnails') onToggleOpen();
            else {
              onChangeTab('thumbnails');
              if (!isOpen) onToggleOpen();
            }
          }}
          title="Miniaturas de Página (Acrobat Thumbnails)"
          className={`p-2.5 rounded-xl transition-all ${
            isOpen && activeTab === 'thumbnails'
              ? 'bg-amber-500 text-black shadow-goldGlow font-bold'
              : 'text-brand-muted hover:text-white hover:bg-brand-card'
          }`}
        >
          <Layers size={17} />
        </button>

        <button
          onClick={() => {
            if (isOpen && activeTab === 'comments') onToggleOpen();
            else {
              onChangeTab('comments');
              if (!isOpen) onToggleOpen();
            }
          }}
          title="Lista de Comentários & Revisões"
          className={`p-2.5 rounded-xl transition-all relative ${
            isOpen && activeTab === 'comments'
              ? 'bg-amber-500 text-black shadow-goldGlow font-bold'
              : 'text-brand-muted hover:text-white hover:bg-brand-card'
          }`}
        >
          <MessageSquare size={17} />
        </button>

        <button
          onClick={() => {
            if (isOpen && activeTab === 'search') onToggleOpen();
            else {
              onChangeTab('search');
              if (!isOpen) onToggleOpen();
            }
          }}
          title="Localizar no Documento"
          className={`p-2.5 rounded-xl transition-all ${
            isOpen && activeTab === 'search'
              ? 'bg-amber-500 text-black shadow-goldGlow font-bold'
              : 'text-brand-muted hover:text-white hover:bg-brand-card'
          }`}
        >
          <Search size={17} />
        </button>

        <div className="mt-auto">
          <button
            onClick={onToggleOpen}
            title={isOpen ? 'Recolher painel' : 'Expandir painel'}
            className="p-2 rounded-lg text-brand-muted hover:text-white hover:bg-brand-card"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Gaveta Lateral Expansível */}
      {isOpen && (
        <aside className="w-64 flex flex-col h-full bg-brand-panel animate-in slide-in-from-left duration-200">
          {activeTab === 'thumbnails' && (
            <div className="flex-1 flex flex-col h-full">
              <div className="p-3 border-b border-brand-cardBorder flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-white">
                  Páginas ({activePages.length})
                </span>
                <span className="text-[10px] text-brand-mutedGold font-mono">Organizar</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {activePages.map((page, index) => (
                  <ThumbnailCard
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
            </div>
          )}

          {activeTab === 'comments' && (
            <AcrobatCommentsPanel
              pageAnnotations={pageAnnotations}
              onSelectPage={onSelectPage}
              onDeleteComment={onDeleteComment}
            />
          )}

          {activeTab === 'search' && (
            <div className="flex-1 p-3 flex flex-col">
              <div className="text-[11px] font-black uppercase tracking-wider text-white mb-2">
                Localizar Texto
              </div>
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Buscar palavras no PDF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-cardBorder rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
                <Search size={13} className="absolute left-2.5 top-2.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-brand-muted">
                {searchQuery
                  ? `Pressione Enter para navegar pelas ocorrências de "${searchQuery}"`
                  : 'Digite qualquer termo para localizar instantaneamente no arquivo.'}
              </p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};
