'use client';

import React, { useRef } from 'react';
import {
  FileText,
  Upload,
  MousePointer,
  Type,
  PenTool,
  Highlighter,
  Stamp,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Trash2,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ToolMode } from '@/types/pdf';

interface ToolbarProps {
  fileName: string | null;
  fileSizeText: string;
  currentPage: number;
  totalPages: number;
  zoom: number;
  activeTool: ToolMode;
  selectedColor: string;
  sidebarOpen: boolean;
  isExporting: boolean;
  onUploadFile: (file: File) => void;
  onToggleSidebar: () => void;
  onChangeTool: (tool: ToolMode) => void;
  onChangeColor: (color: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onRotateCurrentPage: () => void;
  onDeleteCurrentPage: () => void;
  onClearPageAnnotations: () => void;
  onExportPDF: () => void;
}

const PALETTE_COLORS = [
  { label: 'Dourado Real', value: '#f59e0b' },
  { label: 'Laranja Imperial', value: '#f97316' },
  { label: 'Ouro Champanhe', value: '#fde047' },
  { label: 'Rubi / Urgente', value: '#ef4444' },
  { label: 'Esmeralda Nobre', value: '#10b981' },
  { label: 'Branco Pérola', value: '#ffffff' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  fileName,
  fileSizeText,
  currentPage,
  totalPages,
  zoom,
  activeTool,
  selectedColor,
  sidebarOpen,
  isExporting,
  onUploadFile,
  onToggleSidebar,
  onChangeTool,
  onChangeColor,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onPrevPage,
  onNextPage,
  onRotateCurrentPage,
  onDeleteCurrentPage,
  onClearPageAnnotations,
  onExportPDF,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  };

  return (
    <header className="h-16 border-b border-brand-cardBorder/90 bg-brand-panel/95 backdrop-blur px-4 flex items-center justify-between z-30 select-none shadow-subtle">
      {/* Esquerda: Logo Luxo + Sidebar Toggle + Upload */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Recolher miniaturas' : 'Expandir miniaturas'}
          className="p-2 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-brand-muted hover:text-brand-gold transition-colors border border-brand-cardBorder"
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        <div className="flex items-center gap-2.5 pr-2.5 border-r border-brand-cardBorder">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-transparent border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-goldGlow">
            <FileText size={20} />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-sm tracking-wide text-white font-sans">
                GPR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">ENGINE</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                PRO SUITE
              </span>
            </div>
            <p className="text-[11px] text-brand-mutedGold mt-0.5 max-w-[150px] truncate font-medium">
              {fileName || 'Nenhum arquivo'}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-brand-text text-xs font-semibold border border-brand-cardBorder shadow-sm hover:border-amber-500/40 transition-all"
        >
          <Upload size={14} className="text-amber-400" />
          <span>{fileName ? 'Trocar PDF' : 'Abrir PDF'}</span>
        </button>

        {fileName && (
          <span className="hidden md:inline-flex text-[11px] font-mono text-amber-300/80 bg-brand-dark/90 px-2 py-1 rounded-lg border border-brand-cardBorder">
            {fileSizeText}
          </span>
        )}
      </div>

      {/* Centro: Ferramentas de Edição & Anotação em Ouro e Preto */}
      {fileName && (
        <div className="flex items-center gap-1 bg-brand-dark/90 p-1 rounded-2xl border border-brand-cardBorder shadow-inner">
          <button
            onClick={() => onChangeTool('select')}
            title="Selecionar / Mover (V)"
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'select'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-goldGlow'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <MousePointer size={16} />
          </button>

          <button
            onClick={() => onChangeTool('text')}
            title="Adicionar Texto Livre (T)"
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'text'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-goldGlow'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <Type size={16} />
          </button>

          <button
            onClick={() => onChangeTool('draw')}
            title="Caneta / Desenho Livre (P)"
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'draw'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-goldGlow'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <PenTool size={16} />
          </button>

          <button
            onClick={() => onChangeTool('highlight')}
            title="Marca-texto Dourado / Destaque (H)"
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'highlight'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-goldGlow'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <Highlighter size={16} />
          </button>

          <button
            onClick={() => onChangeTool('stamp')}
            title="Carimbos Oficiais de Engenharia (S)"
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              activeTool === 'stamp'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-goldGlow'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <Stamp size={16} />
          </button>

          {/* Seletor de Cores Nobres */}
          <div className="flex items-center gap-1.5 pl-2.5 ml-1 border-l border-brand-cardBorder">
            {PALETTE_COLORS.map((col) => (
              <button
                key={col.value}
                onClick={() => onChangeColor(col.value)}
                title={col.label}
                className={`w-5 h-5 rounded-full border transition-all ${
                  selectedColor === col.value
                    ? 'scale-125 border-amber-300 ring-2 ring-amber-500/70 shadow-goldGlow'
                    : 'border-white/10 hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.value }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Direita: Zoom, Navegação e Botão de Download Dourado */}
      <div className="flex items-center gap-2">
        {fileName && (
          <>
            {/* Controles de Zoom */}
            <div className="hidden lg:flex items-center gap-1 bg-brand-card/70 p-1 rounded-xl border border-brand-cardBorder text-xs">
              <button
                onClick={onZoomOut}
                title="Reduzir Zoom (-)"
                className="p-1.5 rounded-lg hover:bg-brand-card text-brand-muted hover:text-amber-400"
              >
                <ZoomOut size={15} />
              </button>
              <span className="font-mono px-1 min-w-[42px] text-center text-amber-300/90 font-semibold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={onZoomIn}
                title="Aumentar Zoom (+)"
                className="p-1.5 rounded-lg hover:bg-brand-card text-brand-muted hover:text-amber-400"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={onZoomFit}
                title="Ajustar à Tela"
                className="p-1.5 rounded-lg hover:bg-brand-card text-brand-muted hover:text-amber-400"
              >
                <Maximize2 size={14} />
              </button>
            </div>

            {/* Paginação */}
            <div className="flex items-center gap-1 bg-brand-card/70 p-1 rounded-xl border border-brand-cardBorder text-xs">
              <button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                title="Página Anterior"
                className="p-1.5 rounded-lg hover:bg-brand-card text-brand-muted hover:text-white disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-1.5 font-mono text-brand-text">
                <strong className="text-amber-400">{currentPage}</strong> / {totalPages}
              </span>
              <button
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
                title="Próxima Página"
                className="p-1.5 rounded-lg hover:bg-brand-card text-brand-muted hover:text-white disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Ações da Página: Rotacionar & Limpar */}
            <div className="flex items-center gap-1">
              <button
                onClick={onRotateCurrentPage}
                title="Girar Página 90°"
                className="p-2 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-brand-muted hover:text-amber-400 border border-brand-cardBorder transition-colors"
              >
                <RotateCw size={15} />
              </button>

              <button
                onClick={onClearPageAnnotations}
                title="Limpar anotações desta página"
                className="p-2 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-brand-muted hover:text-brand-orange border border-brand-cardBorder transition-colors"
              >
                <RotateCcw size={15} />
              </button>

              <button
                onClick={onDeleteCurrentPage}
                title="Excluir página atual do documento"
                disabled={totalPages <= 1}
                className="p-2 rounded-xl bg-brand-card hover:bg-brand-rose/20 text-brand-muted hover:text-brand-rose border border-brand-cardBorder transition-colors disabled:opacity-30"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Botão de Exportação com Gradiente Dourado Nobre */}
            <button
              onClick={onExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-500 hover:to-amber-500 text-black text-xs font-black shadow-goldGlow hover:shadow-goldGlowLg transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <Download size={15} className="text-black" />
                  <span className="hidden sm:inline">Baixar PDF Final</span>
                  <span className="sm:hidden">Baixar</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
