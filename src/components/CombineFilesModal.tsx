'use client';

import React, { useState, useRef } from 'react';
import {
  Layers,
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Loader2,
} from 'lucide-react';

export interface FileItemToCombine {
  id: string;
  name: string;
  size: string;
  fileBuffer?: ArrayBuffer;
  isSelected: boolean;
}

interface CombineFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFiles: { id: string; name: string; size: string; fileBuffer?: ArrayBuffer }[];
  onExecuteCombine: (selectedFiles: { id: string; name: string; fileBuffer?: ArrayBuffer }[]) => Promise<void>;
  onAddLocalFile: (file: File) => Promise<{ id: string; name: string; size: string; fileBuffer: ArrayBuffer }>;
}

export const CombineFilesModal: React.FC<CombineFilesModalProps> = ({
  isOpen,
  onClose,
  initialFiles,
  onExecuteCombine,
  onAddLocalFile,
}) => {
  const [filesList, setFilesList] = useState<FileItemToCombine[]>(() =>
    initialFiles.map((f, idx) => ({
      ...f,
      isSelected: idx < 2, // Seleciona os 2 primeiros por padrão
    }))
  );
  const [isCombining, setIsCombining] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setFilesList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isSelected: !f.isSelected } : f))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFilesList((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === filesList.length - 1) return;
    setFilesList((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeFile = (id: string) => {
    setFilesList((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newFile = await onAddLocalFile(file);
      setFilesList((prev) => [
        ...prev,
        {
          ...newFile,
          isSelected: true,
        },
      ]);
    } catch (err) {
      console.error('Erro ao adicionar arquivo para mesclagem:', err);
    }
  };

  const handleCombineClick = async () => {
    const selected = filesList.filter((f) => f.isSelected);
    if (selected.length < 2) {
      alert('Por favor, selecione pelo menos 2 arquivos PDF para combinar.');
      return;
    }

    try {
      setIsCombining(true);
      await onExecuteCombine(
        selected.map((s) => ({
          id: s.id,
          name: s.name,
          fileBuffer: s.fileBuffer,
        }))
      );
      onClose();
    } catch (err: any) {
      console.error('Falha ao combinar arquivos:', err);
      alert(err?.message || 'Ocorreu um erro ao combinar os arquivos selecionados.');
    } finally {
      setIsCombining(false);
    }
  };

  const selectedCount = filesList.filter((f) => f.isSelected).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="max-w-xl w-full bg-obsidian-panel border border-obsidian-border rounded-3xl p-6 shadow-goldGlowLg flex flex-col max-h-[85vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-border mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-orange-gold/15 border border-gold-metallic/40 flex items-center justify-center text-gold-metallic shadow-goldGlow">
              <Layers size={22} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Combinar Arquivos PDF</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-orange-gold text-black font-black">
                  GPR ENGINE
                </span>
              </h3>
              <p className="text-[11px] text-brand-muted mt-0.5">
                Selecione os PDFs abertos ou adicione novos para gerar um único documento unificado.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-obsidian-card hover:bg-obsidian-hover text-brand-muted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Botão de Adicionar Mais Arquivos */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-white">
            Ordem de Combinação dos Documentos:
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-gold-metallic hover:text-white text-xs font-semibold transition-all"
          >
            <Plus size={14} />
            <span>Adicionar outro PDF</span>
          </button>
        </div>

        {/* Lista de Arquivos com Checkbox e Ordenação */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          {filesList.length === 0 ? (
            <div className="text-center py-12 text-brand-muted">
              <Layers size={32} className="mx-auto mb-2 opacity-30 text-gold-metallic" />
              <p className="text-xs font-semibold text-white">Nenhum arquivo na lista</p>
              <p className="text-[11px] mt-1">
                Clique em "Adicionar outro PDF" para carregar arquivos do seu computador.
              </p>
            </div>
          ) : (
            filesList.map((file, index) => (
              <div
                key={file.id}
                onClick={() => toggleSelect(file.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  file.isSelected
                    ? 'bg-obsidian-panelDark border-gold-metallic/50 shadow-sm'
                    : 'bg-obsidian-bg/60 border-obsidian-border/70 opacity-60 hover:opacity-100 hover:border-obsidian-border'
                }`}
              >
                {/* Esquerda: Checkbox + Ícone + Nome */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      file.isSelected
                        ? 'bg-gradient-orange-gold text-black font-bold'
                        : 'border border-obsidian-border bg-obsidian-card'
                    }`}
                  >
                    {file.isSelected && <CheckSquare size={14} />}
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-obsidian-card border border-obsidian-border flex items-center justify-center text-orange-vibrant shrink-0">
                    <FileText size={17} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {file.name}
                    </h4>
                    <span className="text-[10px] font-mono text-brand-mutedGold">
                      Posição #{index + 1} • {file.size}
                    </span>
                  </div>
                </div>

                {/* Direita: Controles de Posição (Cima/Baixo) e Exclusão */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 shrink-0"
                >
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    title="Mover para cima"
                    className="p-1.5 rounded-lg text-brand-muted hover:text-gold-metallic hover:bg-obsidian-card disabled:opacity-20"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === filesList.length - 1}
                    title="Mover para baixo"
                    className="p-1.5 rounded-lg text-brand-muted hover:text-gold-metallic hover:bg-obsidian-card disabled:opacity-20"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    title="Remover da lista de combinação"
                    className="p-1.5 rounded-lg text-brand-muted hover:text-brand-rose hover:bg-brand-rose/10 ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé com Botão Combinar */}
        <div className="flex items-center justify-between pt-4 border-t border-obsidian-border mt-4">
          <div className="text-xs text-brand-muted">
            <strong className="text-white font-mono">{selectedCount}</strong> de{' '}
            <span className="font-mono">{filesList.length}</span> selecionados
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isCombining}
              className="px-4 py-2 rounded-xl bg-obsidian-card hover:bg-obsidian-hover text-brand-muted hover:text-white text-xs font-semibold transition-colors disabled:opacity-40"
            >
              Cancelar
            </button>

            <button
              onClick={handleCombineClick}
              disabled={selectedCount < 2 || isCombining}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-orange-gold text-black text-xs font-black shadow-goldGlow hover:shadow-goldGlowLg transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              {isCombining ? (
                <>
                  <Loader2 size={15} className="animate-spin text-black" />
                  <span>Unificando Páginas...</span>
                </>
              ) : (
                <>
                  <Layers size={15} className="text-black" />
                  <span>Combinar ({selectedCount} arquivos)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
