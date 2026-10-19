'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Hand,
  MousePointer,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { ToolMode } from '@/types/pdf';

interface AcrobatBottomHUDProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  activeTool: ToolMode;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectTool: (tool: ToolMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
}

export const AcrobatBottomHUD: React.FC<AcrobatBottomHUDProps> = ({
  currentPage,
  totalPages,
  zoom,
  activeTool,
  onPrevPage,
  onNextPage,
  onSelectTool,
  onZoomIn,
  onZoomOut,
  onZoomFit,
}) => {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-panel/90 border border-brand-cardBorder backdrop-blur-md shadow-goldGlow text-xs">
        {/* Paginação */}
        <button
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          title="Página Anterior"
          className="p-1 rounded-full hover:bg-brand-card text-brand-muted hover:text-white disabled:opacity-30"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="font-mono text-[11px] px-1 text-white">
          <strong className="text-amber-400">{currentPage}</strong> / {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          title="Próxima Página"
          className="p-1 rounded-full hover:bg-brand-card text-brand-muted hover:text-white disabled:opacity-30"
        >
          <ChevronRight size={15} />
        </button>

        <div className="w-[1px] h-4 bg-brand-cardBorder mx-1" />

        {/* Seleção vs Mãozinha */}
        <button
          onClick={() => onSelectTool('select')}
          title="Cursor / Selecionar"
          className={`p-1.5 rounded-full transition-all ${
            activeTool === 'select'
              ? 'bg-amber-500 text-black shadow-sm'
              : 'text-brand-muted hover:text-white hover:bg-brand-card'
          }`}
        >
          <MousePointer size={13} />
        </button>

        <button
          onClick={() => onSelectTool('pan')}
          title="Mãozinha (Pan)"
          className={`p-1.5 rounded-full transition-all ${
            activeTool === 'pan'
              ? 'bg-amber-500 text-black shadow-sm'
              : 'text-brand-muted hover:text-white hover:bg-brand-card'
          }`}
        >
          <Hand size={13} />
        </button>

        <div className="w-[1px] h-4 bg-brand-cardBorder mx-1" />

        {/* Zoom rápido */}
        <button
          onClick={onZoomOut}
          title="Reduzir Zoom"
          className="p-1 rounded-full hover:bg-brand-card text-brand-muted hover:text-amber-400"
        >
          <ZoomOut size={13} />
        </button>

        <span className="font-mono text-[11px] px-1 text-amber-300 min-w-[36px] text-center font-semibold">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={onZoomIn}
          title="Aumentar Zoom"
          className="p-1 rounded-full hover:bg-brand-card text-brand-muted hover:text-amber-400"
        >
          <ZoomIn size={13} />
        </button>

        <button
          onClick={onZoomFit}
          title="Ajustar à Tela"
          className="p-1 rounded-full hover:bg-brand-card text-brand-muted hover:text-amber-400"
        >
          <Maximize2 size={12} />
        </button>
      </div>
    </div>
  );
};
