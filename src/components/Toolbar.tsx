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
  { label: 'Azul GPR', value: '#3b82f6' },
  { label: 'Esmeralda', value: '#10b981' },
  { label: 'Âmbar / Marca-texto', value: '#f59e0b' },
  { label: 'Vermelho / Urgente', value: '#f43f5e' },
  { label: 'Roxo', value: '#8b5cf6' },
  { label: 'Branco / Claro', value: '#ffffff' },
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
    <header className="h-16 border-b border-brand-cardBorder bg-brand-panel/95 backdrop-blur px-4 flex items-center justify-between z-30 select-none">
      {/* Esquerda: Logo + Sidebar Toggle + Upload */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Recolher miniaturas' : 'Expandir miniaturas'}
          className="p-2 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-brand-muted hover:text-white transition-colors border border-brand-cardBorder/60"
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        <div className="flex items-center gap-2 pr-2 border-r border-brand-cardBorder/70">
          <div className="w-9 h-9 rounded-lg bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent shadow-sm">
            <FileText size={20} />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-sm tracking-wide text-white">GPR Engine</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-accent/30 text-blue-300 border border-brand-accent/40">
                PDF SUITE
              </span>
            </div>
            <p className="text-[11px] text-brand-muted mt-0.5 max-w-[150px] truncate">
              {fileName || 'Nenhum arquivo aberto'}
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-white text-xs font-semibold border border-brand-cardBorder shadow-sm transition-all"
        >
          <Upload size={14} className="text-brand-accent" />
          <span>{fileName ? 'Trocar PDF' : 'Abrir PDF'}</span>
        </button>

        {fileName && (
          <span className="hidden md:inline-flex text-[11px] font-mono text-brand-muted bg-brand-dark/60 px-2 py-1 rounded border border-brand-cardBorder/40">
            {fileSizeText}
          </span>
        )}
      </div>

      {/* Centro: Ferramentas de Edição & Anotação */}
      {fileName && (
        <div className="flex items-center gap-1 bg-brand-dark/70 p-1 rounded-xl border border-brand-cardBorder/60 shadow-inner">
          <button
            onClick={() => onChangeTool('select')}
            title="Selecionar / Mover (V)"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              activeTool === 'select'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <MousePointer size={16} />
          </button>

          <button
            onClick={() => onChangeTool('text')}
            title="Adicionar Texto Livre (T)"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              activeTool === 'text'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <Type size={16} />
          </button>

          <button
            onClick={() => onChangeTool('draw')}
            title="Caneta / Desenho Livre (P)"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              activeTool === 'draw'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <PenTool size={16} />
          </button>

          <button
            onClick={() => onChangeTool('highlight')}
            title="Marca-texto / Destaque (H)"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              activeTool === 'highlight'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <Highlighter size={16} />
          </button>

          <button
            onClick={() => onChangeTool('stamp')}
            title="Carimbos Oficiais GPR (S)"
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              activeTool === 'stamp'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            <Stamp size={16} />
          </button>

          {/* Seletor de Cores */}
          <div className="flex items-center gap-1 pl-2 ml-1 border-l border-brand-cardBorder/80">
            {PALETTE_COLORS.map((col) => (
              <button
                key={col.value}
                onClick={() => onChangeColor(col.value)}
                title={col.label}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  selectedColor === col.value
                    ? 'scale-125 border-white ring-2 ring-brand-accent/50'
                    : 'border-transparent hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.value }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Direita: Zoom, Navegação de Páginas e Ações */}
      <div className="flex items-center gap-2">
        {fileName && (
          <>
            {/* Controles de Zoom */}
            <div className="hidden lg:flex items-center gap-1 bg-brand-card/60 p-1 rounded-lg border border-brand-cardBorder/60 text-xs">
              <button
                onClick={onZoomOut}
                title="Reduzir Zoom (-)"
                className="p-1.5 rounded hover:bg-brand-card text-brand-muted hover:text-white"
              >
                <ZoomOut size={15} />
              </button>
              <span className="font-mono px-1 min-w-[42px] text-center text-brand-text">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={onZoomIn}
                title="Aumentar Zoom (+)"
                className="p-1.5 rounded hover:bg-brand-card text-brand-muted hover:text-white"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={onZoomFit}
                title="Ajustar à Tela"
                className="p-1.5 rounded hover:bg-brand-card text-brand-muted hover:text-white"
              >
                <Maximize2 size={14} />
              </button>
            </div>

            {/* Paginação */}
            <div className="flex items-center gap-1 bg-brand-card/60 p-1 rounded-lg border border-brand-cardBorder/60 text-xs">
              <button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                title="Página Anterior"
                className="p-1.5 rounded hover:bg-brand-card text-brand-muted hover:text-white disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-1.5 font-mono text-brand-text">
                <strong className="text-white">{currentPage}</strong> / {totalPages}
              </span>
              <button
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
                title="Próxima Página"
                className="p-1.5 rounded hover:bg-brand-card text-brand-muted hover:text-white disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Ações da Página: Rotacionar & Limpar */}
            <div className="flex items-center gap-1">
              <button
                onClick={onRotateCurrentPage}
                title="Girar Página 90°"
                className="p-2 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-brand-muted hover:text-white border border-brand-cardBorder/60 transition-colors"
              >
                <RotateCw size={15} />
              </button>

              <button
                onClick={onClearPageAnnotations}
                title="Limpar anotações desta página"
                className="p-2 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-brand-muted hover:text-brand-amber border border-brand-cardBorder/60 transition-colors"
              >
                <RotateCcw size={15} />
              </button>

              <button
                onClick={onDeleteCurrentPage}
                title="Excluir página atual do documento"
                disabled={totalPages <= 1}
                className="p-2 rounded-lg bg-brand-card hover:bg-brand-rose/20 text-brand-muted hover:text-brand-rose border border-brand-cardBorder/60 transition-colors disabled:opacity-40"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Botão Exportar / Baixar PDF */}
            <button
              onClick={onExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold shadow-md shadow-brand-accent/20 transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
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
