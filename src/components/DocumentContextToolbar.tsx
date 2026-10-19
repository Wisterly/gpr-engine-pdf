'use client';

import React from 'react';
import {
  Save,
  Star,
  Printer,
  Mail,
  Search,
  ChevronUp,
  ChevronDown,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MessageSquare,
  Edit3,
  FileSignature,
  Share2,
} from 'lucide-react';
import { ToolMode } from '@/types/pdf';

interface DocumentContextToolbarProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  activeTool: ToolMode;
  isFavorite: boolean;
  onSavePDF: () => void;
  onToggleFavorite: () => void;
  onPrint: () => void;
  onEmailShare: () => void;
  onSearchInDoc: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectTool: (tool: ToolMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onOpenFillSign: () => void;
  onShare: () => void;
}

export const DocumentContextToolbar: React.FC<DocumentContextToolbarProps> = ({
  currentPage,
  totalPages,
  zoom,
  activeTool,
  isFavorite,
  onSavePDF,
  onToggleFavorite,
  onPrint,
  onEmailShare,
  onSearchInDoc,
  onPrevPage,
  onNextPage,
  onSelectTool,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onOpenFillSign,
  onShare,
}) => {
  return (
    <div className="h-11 px-3 border-b border-obsidian-border bg-obsidian-panel flex items-center justify-between text-xs select-none z-20">
      {/* Grupo Esquerda: Salvar, Favoritar, Imprimir, E-mail, Busca */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSavePDF}
          title="Salvar alterações no PDF (Ctrl+S)"
          className="p-1.5 rounded-lg text-brand-muted hover:text-gold-metallic hover:bg-obsidian-hover transition-colors"
        >
          <Save size={15} />
        </button>

        <button
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`p-1.5 rounded-lg transition-colors ${
            isFavorite
              ? 'text-gold-metallic hover:text-white'
              : 'text-brand-muted hover:text-gold-metallic hover:bg-obsidian-hover'
          }`}
        >
          <Star size={15} className={isFavorite ? 'fill-gold-metallic' : ''} />
        </button>

        <button
          onClick={onPrint}
          title="Imprimir documento (Ctrl+P)"
          className="p-1.5 rounded-lg text-brand-muted hover:text-white hover:bg-obsidian-hover transition-colors"
        >
          <Printer size={15} />
        </button>

        <button
          onClick={onEmailShare}
          title="Enviar por E-mail"
          className="p-1.5 rounded-lg text-brand-muted hover:text-white hover:bg-obsidian-hover transition-colors"
        >
          <Mail size={15} />
        </button>

        <button
          onClick={onSearchInDoc}
          title="Buscar no documento (Ctrl+F)"
          className="p-1.5 rounded-lg text-brand-muted hover:text-gold-metallic hover:bg-obsidian-hover transition-colors"
        >
          <Search size={15} />
        </button>
      </div>

      {/* Grupo Centro: Paginação, Cursores, Zoom, Modos */}
      <div className="flex items-center gap-2">
        {/* Paginação */}
        <div className="flex items-center gap-0.5 bg-obsidian-card px-1.5 py-0.5 rounded-lg border border-obsidian-border text-[11px]">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            title="Página Anterior (Seta Acima)"
            className="p-1 text-brand-muted hover:text-white disabled:opacity-30"
          >
            <ChevronUp size={13} />
          </button>
          <span className="font-mono px-1">
            <strong className="text-white">{currentPage}</strong> / {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            title="Próxima Página (Seta Abaixo)"
            className="p-1 text-brand-muted hover:text-white disabled:opacity-30"
          >
            <ChevronDown size={13} />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-obsidian-border" />

        {/* Cursores: Selecionar vs Arrastar (Mão) */}
        <div className="flex items-center gap-0.5 bg-obsidian-card p-0.5 rounded-lg border border-obsidian-border">
          <button
            onClick={() => onSelectTool('select')}
            title="Selecionar (Cursor)"
            className={`p-1 rounded-md transition-all ${
              activeTool === 'select'
                ? 'bg-gradient-orange-gold text-black font-bold shadow-sm'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            <MousePointer size={13} />
          </button>
          <button
            onClick={() => onSelectTool('pan')}
            title="Arrastar (Mão)"
            className={`p-1 rounded-md transition-all ${
              activeTool === 'pan'
                ? 'bg-gradient-orange-gold text-black font-bold shadow-sm'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            <Hand size={13} />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-obsidian-border" />

        {/* Zoom: -, +, Porcentagem, Ajuste */}
        <div className="flex items-center gap-1 bg-obsidian-card px-1.5 py-0.5 rounded-lg border border-obsidian-border text-[11px]">
          <button
            onClick={onZoomOut}
            title="Reduzir Zoom (-)"
            className="p-1 text-brand-muted hover:text-gold-metallic"
          >
            <ZoomOut size={13} />
          </button>
          <span className="font-mono text-gold-metallic min-w-[38px] text-center font-semibold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            title="Aumentar Zoom (+)"
            className="p-1 text-brand-muted hover:text-gold-metallic"
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={onZoomFit}
            title="Ajustar à Tela"
            className="p-1 text-brand-muted hover:text-white"
          >
            <Maximize2 size={12} />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-obsidian-border" />

        {/* Modos rápidos: Comentário, Edição, Preencher & Assinar */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectTool('sticky_note')}
            title="Adicionar Comentário"
            className={`p-1.5 rounded-lg transition-colors ${
              activeTool === 'sticky_note'
                ? 'bg-obsidian-panelDark text-gold-metallic border border-gold-metallic/40'
                : 'text-brand-muted hover:text-white hover:bg-obsidian-hover'
            }`}
          >
            <MessageSquare size={14} />
          </button>

          <button
            onClick={() => onSelectTool('text')}
            title="Edição Rápida de Texto"
            className={`p-1.5 rounded-lg transition-colors ${
              activeTool === 'text'
                ? 'bg-obsidian-panelDark text-orange-vibrant border border-orange-vibrant/40'
                : 'text-brand-muted hover:text-white hover:bg-obsidian-hover'
            }`}
          >
            <Edit3 size={14} />
          </button>

          <button
            onClick={onOpenFillSign}
            title="Preencher e Assinar (Assinatura manuscrita)"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-obsidian-card hover:bg-obsidian-hover text-gold-metallic border border-obsidian-border font-semibold transition-all"
          >
            <FileSignature size={13} className="text-orange-vibrant" />
            <span className="hidden sm:inline">Preencher e assinar</span>
          </button>
        </div>
      </div>

      {/* Grupo Direita: Botão de Destaque Compartilhar */}
      <button
        onClick={onShare}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-orange-gold hover:opacity-90 text-black text-xs font-black shadow-goldGlow hover:shadow-goldGlowLg transition-all"
      >
        <Share2 size={13} className="text-black" />
        <span>Compartilhar</span>
      </button>
    </div>
  );
};
