'use client';

import React, { useRef } from 'react';
import {
  FileText,
  Upload,
  Eye,
  MessageSquare,
  Edit3,
  Layers,
  FileSignature,
  Undo2,
  Redo2,
  Download,
  Share2,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { AcrobatMode } from '@/types/pdf';

interface AcrobatHeaderProps {
  fileName: string | null;
  currentPage: number;
  totalPages: number;
  activeMode: AcrobatMode;
  isExporting: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onChangeMode: (mode: AcrobatMode) => void;
  onUploadFile: (file: File) => void;
  onExportPDF: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const MODES: { id: AcrobatMode; label: string; icon: React.ReactNode }[] = [
  { id: 'view', label: 'Visualizar', icon: <Eye size={15} /> },
  { id: 'comment', label: 'Comentar & Anotar', icon: <MessageSquare size={15} /> },
  { id: 'edit', label: 'Editar PDF', icon: <Edit3 size={15} /> },
  { id: 'organize', label: 'Organizar Páginas', icon: <Layers size={15} /> },
  { id: 'fill_sign', label: 'Preencher & Assinar', icon: <FileSignature size={15} /> },
];

export const AcrobatHeader: React.FC<AcrobatHeaderProps> = ({
  fileName,
  currentPage,
  totalPages,
  activeMode,
  isExporting,
  canUndo = false,
  canRedo = false,
  onChangeMode,
  onUploadFile,
  onExportPDF,
  onUndo,
  onRedo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="h-14 border-b border-brand-cardBorder bg-brand-panel px-4 flex items-center justify-between z-30 select-none shadow-subtle">
      {/* Esquerda: Logo + Título do Arquivo estilo Acrobat */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-brand-cardBorder">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/25 via-orange-500/15 to-transparent border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-goldGlow">
            <FileText size={17} />
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="font-black text-xs tracking-wider text-white">
              GPR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">ACROBAT</span>
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PRO
            </span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUploadFile(f);
          }}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-brand-text text-xs font-semibold border border-brand-cardBorder transition-all"
        >
          <Upload size={13} className="text-amber-400" />
          <span>{fileName ? 'Trocar' : 'Abrir'}</span>
        </button>

        {fileName && (
          <div className="hidden md:flex items-center gap-2 pl-2">
            <span className="text-xs font-medium text-white max-w-[200px] truncate">
              {fileName}
            </span>
            <span className="text-[10px] font-mono text-brand-mutedGold bg-brand-dark px-2 py-0.5 rounded-md border border-brand-cardBorder">
              Pág. {currentPage} de {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Centro: Abas de Modos Profissionais do Adobe Acrobat */}
      {fileName && (
        <nav className="flex items-center gap-1 bg-brand-dark/95 p-1 rounded-2xl border border-brand-cardBorder shadow-inner">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => onChangeMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeMode === m.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-goldGlow'
                  : 'text-brand-muted hover:text-white hover:bg-brand-card'
              }`}
            >
              {m.icon}
              <span className="hidden lg:inline">{m.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Direita: Desfazer, Refazer e Download Final */}
      <div className="flex items-center gap-2">
        {fileName && (
          <>
            <div className="hidden sm:flex items-center gap-0.5 pr-2 border-r border-brand-cardBorder">
              <button
                onClick={onUndo}
                title="Desfazer (Ctrl+Z)"
                className="p-1.5 rounded-lg text-brand-muted hover:text-white hover:bg-brand-card"
              >
                <Undo2 size={15} />
              </button>
              <button
                onClick={onRedo}
                title="Refazer (Ctrl+Y)"
                className="p-1.5 rounded-lg text-brand-muted hover:text-white hover:bg-brand-card"
              >
                <Redo2 size={15} />
              </button>
            </div>

            <button
              onClick={onExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-500 hover:to-amber-500 text-black text-xs font-black shadow-goldGlow hover:shadow-goldGlowLg transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Download size={14} className="text-black" />
                  <span>Salvar / Baixar</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
