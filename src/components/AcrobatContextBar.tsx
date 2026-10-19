'use client';

import React from 'react';
import {
  MousePointer,
  Hand,
  Highlighter,
  Underline,
  Strikethrough,
  MessageSquarePlus,
  Type,
  PenTool,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Stamp,
  RotateCw,
  RotateCcw,
  Trash2,
  Check,
  X,
  CircleDot,
  FileSignature,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { AcrobatMode, ToolMode } from '@/types/pdf';

interface AcrobatContextBarProps {
  activeMode: AcrobatMode;
  activeTool: ToolMode;
  selectedColor: string;
  strokeSize: number;
  zoom: number;
  currentPage: number;
  totalPages: number;
  onChangeTool: (tool: ToolMode) => void;
  onChangeColor: (color: string) => void;
  onChangeStrokeSize: (size: number) => void;
  onOpenSignatureModal: () => void;
  onOpenStampPicker: () => void;
  onRotateCurrentPage: (dir: 'cw' | 'ccw') => void;
  onDeleteCurrentPage: () => void;
  onClearPageAnnotations: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const LUXURY_PALETTE = [
  { label: 'Dourado Real', value: '#f59e0b' },
  { label: 'Laranja Imperial', value: '#f97316' },
  { label: 'Ouro Champanhe', value: '#fde047' },
  { label: 'Rubi Urgente', value: '#ef4444' },
  { label: 'Esmeralda', value: '#10b981' },
  { label: 'Branco Pérola', value: '#ffffff' },
];

export const AcrobatContextBar: React.FC<AcrobatContextBarProps> = ({
  activeMode,
  activeTool,
  selectedColor,
  strokeSize,
  zoom,
  currentPage,
  totalPages,
  onChangeTool,
  onChangeColor,
  onChangeStrokeSize,
  onOpenSignatureModal,
  onOpenStampPicker,
  onRotateCurrentPage,
  onDeleteCurrentPage,
  onClearPageAnnotations,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="h-11 border-b border-brand-cardBorder/80 bg-brand-dark/95 backdrop-blur px-4 flex items-center justify-between z-20 select-none text-xs">
      {/* Lado Esquerdo: Ferramentas Específicas do Modo Ativo */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {/* Modo 1: Visualizar & Navegar */}
        {activeMode === 'view' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeTool('select')}
              title="Selecionar / Cursor (V)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTool === 'select'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <MousePointer size={14} />
              <span>Selecionar</span>
            </button>
            <button
              onClick={() => onChangeTool('pan')}
              title="Mãozinha / Arrastar (H)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTool === 'pan'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <Hand size={14} />
              <span>Mão (Pan)</span>
            </button>
          </div>
        )}

        {/* Modo 2: Comentar & Anotar (Signature Acrobat Comment Toolbar) */}
        {activeMode === 'comment' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeTool('highlight')}
              title="Realçar Texto / Marca-texto (U)"
              className={`p-1.5 rounded-lg transition-all ${
                activeTool === 'highlight'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <Highlighter size={15} />
            </button>
            <button
              onClick={() => onChangeTool('underline')}
              title="Sublinhar Texto"
              className={`p-1.5 rounded-lg transition-all ${
                activeTool === 'underline'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <Underline size={15} />
            </button>
            <button
              onClick={() => onChangeTool('strikeout')}
              title="Risco / Tachado"
              className={`p-1.5 rounded-lg transition-all ${
                activeTool === 'strikeout'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <Strikethrough size={15} />
            </button>
            <button
              onClick={() => onChangeTool('sticky_note')}
              title="Nota Adesiva / Comentário (S)"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium transition-all ${
                activeTool === 'sticky_note'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <MessageSquarePlus size={14} />
              <span>Nota</span>
            </button>
            <button
              onClick={() => onChangeTool('text')}
              title="Caixa de Texto Livre (T)"
              className={`p-1.5 rounded-lg transition-all ${
                activeTool === 'text'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <Type size={15} />
            </button>
            <button
              onClick={() => onChangeTool('draw')}
              title="Caneta / Desenho Livre (D)"
              className={`p-1.5 rounded-lg transition-all ${
                activeTool === 'draw'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <PenTool size={15} />
            </button>

            {/* Formas Geométricas clássicas do Acrobat */}
            <div className="flex items-center gap-0.5 pl-1.5 border-l border-brand-cardBorder">
              <button
                onClick={() => onChangeTool('rectangle')}
                title="Retângulo"
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'rectangle'
                    ? 'bg-amber-500 text-black shadow-goldGlow'
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`}
              >
                <Square size={14} />
              </button>
              <button
                onClick={() => onChangeTool('circle')}
                title="Círculo"
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'circle'
                    ? 'bg-amber-500 text-black shadow-goldGlow'
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`}
              >
                <Circle size={14} />
              </button>
              <button
                onClick={() => onChangeTool('arrow')}
                title="Seta Indicativa"
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'arrow'
                    ? 'bg-amber-500 text-black shadow-goldGlow'
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`}
              >
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onChangeTool('line')}
                title="Linha Reta"
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'line'
                    ? 'bg-amber-500 text-black shadow-goldGlow'
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`}
              >
                <Minus size={14} />
              </button>
            </div>

            {/* Carimbos Oficiais */}
            <button
              onClick={onOpenStampPicker}
              title="Carimbos Oficiais do Documento"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-amber-300 font-semibold border border-brand-cardBorder ml-1"
            >
              <Stamp size={13} />
              <span>Carimbo</span>
            </button>
          </div>
        )}

        {/* Modo 3: Editar PDF */}
        {activeMode === 'edit' && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onChangeTool('text')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                activeTool === 'text'
                  ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              <Type size={14} />
              <span>Adicionar / Editar Texto</span>
            </button>
            <button
              onClick={() => onRotateCurrentPage('cw')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-brand-text border border-brand-cardBorder"
            >
              <RotateCw size={13} />
              <span>Girar Página</span>
            </button>
            <button
              onClick={onDeleteCurrentPage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-rose/20 text-brand-rose border border-brand-cardBorder"
            >
              <Trash2 size={13} />
              <span>Excluir Página</span>
            </button>
          </div>
        )}

        {/* Modo 4: Organizar Páginas */}
        {activeMode === 'organize' && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRotateCurrentPage('ccw')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-brand-text border border-brand-cardBorder"
            >
              <RotateCcw size={13} />
              <span>Girar 90° Esquerda</span>
            </button>
            <button
              onClick={() => onRotateCurrentPage('cw')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-brand-text border border-brand-cardBorder"
            >
              <RotateCw size={13} />
              <span>Girar 90° Direita</span>
            </button>
            <button
              onClick={onClearPageAnnotations}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardBorder text-amber-400 border border-brand-cardBorder"
            >
              <span>Limpar Marcações</span>
            </button>
            <button
              onClick={onDeleteCurrentPage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-rose/20 text-brand-rose border border-brand-cardBorder"
            >
              <Trash2 size={13} />
              <span>Excluir Página</span>
            </button>
          </div>
        )}

        {/* Modo 5: Preencher & Assinar (Fill & Sign) */}
        {activeMode === 'fill_sign' && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSignatureModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-goldGlow hover:opacity-90"
            >
              <FileSignature size={14} />
              <span>Adicionar Assinatura</span>
            </button>
            <div className="flex items-center gap-1 pl-2 border-l border-brand-cardBorder">
              <button
                onClick={() => onChangeTool('check')}
                title="Visto (Checkmark)"
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'check'
                    ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`}
              >
                <Check size={15} />
              </button>
              <button
                onClick={() => onChangeTool('cross')}
                title="Cruzinha (X)"
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'cross'
                    ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`}
              >
                <X size={15} />
              </button>
              <button
                onClick={() => onChangeTool('dot')}
                title="Ponto (Dot)"
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'dot'
                    ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`}
              >
                <CircleDot size={15} />
              </button>
              <button
                onClick={() => onChangeTool('text')}
                title="Texto de Formulário"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  activeTool === 'text'
                    ? 'bg-amber-500 text-black font-bold shadow-goldGlow'
                    : 'text-brand-muted hover:text-white hover:bg-brand-card'
                }`}
              >
                <Type size={14} />
                <span>Texto</span>
              </button>
            </div>
          </div>
        )}

        {/* Propriedades Rápidas: Cor & Espessura quando em modo de edição/anotação */}
        {(activeMode === 'comment' || activeMode === 'fill_sign') && (
          <div className="flex items-center gap-2 pl-3 ml-2 border-l border-brand-cardBorder">
            <div className="flex items-center gap-1">
              {LUXURY_PALETTE.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onChangeColor(c.value)}
                  title={c.label}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColor === c.value
                      ? 'scale-125 border-white ring-1 ring-amber-500'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>

            {/* Espessura do Traço */}
            <div className="flex items-center gap-1 text-[11px] text-brand-muted pl-2">
              {[2, 4, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeStrokeSize(s)}
                  className={`px-1.5 py-0.5 rounded ${
                    strokeSize === s
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lado Direito: Quick Zoom & Paginação no estilo Adobe Acrobat */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1 bg-brand-card/70 p-0.5 rounded-lg border border-brand-cardBorder">
          <button
            onClick={onZoomOut}
            title="Reduzir Zoom"
            className="p-1 hover:text-amber-400 text-brand-muted"
          >
            <ZoomOut size={13} />
          </button>
          <span className="font-mono px-1 min-w-[36px] text-center text-amber-300 font-semibold text-[11px]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            title="Aumentar Zoom"
            className="p-1 hover:text-amber-400 text-brand-muted"
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={onZoomFit}
            title="Ajustar à Tela"
            className="p-1 hover:text-amber-400 text-brand-muted"
          >
            <Maximize2 size={12} />
          </button>
        </div>

        <div className="flex items-center gap-0.5 bg-brand-card/70 p-0.5 rounded-lg border border-brand-cardBorder">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="p-1 text-brand-muted hover:text-white disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-1 text-[11px] font-mono">
            <strong className="text-white">{currentPage}</strong> / {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 text-brand-muted hover:text-white disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
