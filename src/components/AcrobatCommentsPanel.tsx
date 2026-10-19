'use client';

import React from 'react';
import { PageAnnotations } from '@/types/pdf';
import { MessageSquare, Highlighter, Type, FileSignature, Trash2, Calendar, MapPin } from 'lucide-react';

interface AcrobatCommentsPanelProps {
  pageAnnotations: Record<number, PageAnnotations>;
  onSelectPage: (pageNumber: number) => void;
  onDeleteComment: (pageNumber: number, commentId: string, type: 'text' | 'sticky' | 'signature') => void;
}

export const AcrobatCommentsPanel: React.FC<AcrobatCommentsPanelProps> = ({
  pageAnnotations,
  onSelectPage,
  onDeleteComment,
}) => {
  // Coleta todas as anotações do documento ordenadas por página
  const allEntries: {
    id: string;
    page: number;
    title: string;
    snippet: string;
    type: 'sticky' | 'text' | 'draw' | 'signature';
    color?: string;
    timestamp?: string;
  }[] = [];

  Object.entries(pageAnnotations).forEach(([pageNumStr, annot]) => {
    const pageNum = parseInt(pageNumStr);

    // Notas Adesivas
    annot.stickyNotes?.forEach((n) => {
      allEntries.push({
        id: n.id,
        page: pageNum,
        title: n.author || 'Nota do Revisor',
        snippet: n.text || '(Sem conteúdo)',
        type: 'sticky',
        color: n.color,
        timestamp: n.createdAt,
      });
    });

    // Textos
    annot.texts?.forEach((t) => {
      allEntries.push({
        id: t.id,
        page: pageNum,
        title: 'Caixa de Texto',
        snippet: t.text || '(Texto vazio)',
        type: 'text',
        color: t.color,
      });
    });

    // Assinaturas
    annot.signatures?.forEach((s) => {
      allEntries.push({
        id: s.id,
        page: pageNum,
        title: 'Assinatura Oficial',
        snippet: 'Assinatura digital inserida',
        type: 'signature',
      });
    });
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-panel text-xs select-none">
      <div className="p-3 border-b border-brand-cardBorder flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider text-[11px]">
          <MessageSquare size={14} className="text-amber-400" />
          <span>Comentários ({allEntries.length})</span>
        </div>
        <span className="text-[10px] text-brand-mutedGold">Linha do Tempo</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {allEntries.length === 0 ? (
          <div className="text-center py-10 px-4 text-brand-muted">
            <MessageSquare size={24} className="mx-auto mb-2 opacity-30 text-amber-400" />
            <p className="font-semibold text-white">Nenhum comentário ainda</p>
            <p className="text-[11px] text-brand-muted mt-1">
              Use a ferramenta de <strong className="text-amber-400">Nota</strong> ou{' '}
              <strong className="text-amber-400">Texto</strong> no menu superior para adicionar revisões.
            </p>
          </div>
        ) : (
          allEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelectPage(entry.page)}
              className="p-2.5 rounded-xl border border-brand-cardBorder bg-brand-card/60 hover:bg-brand-card hover:border-amber-500/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-white text-[11px]">
                  {entry.type === 'sticky' ? (
                    <MessageSquare size={13} className="text-amber-400" />
                  ) : entry.type === 'text' ? (
                    <Type size={13} className="text-orange-400" />
                  ) : (
                    <FileSignature size={13} className="text-emerald-400" />
                  )}
                  <span>{entry.title}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-dark text-amber-300 border border-brand-cardBorder">
                    Pág. {entry.page}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComment(entry.page, entry.id, entry.type as any);
                    }}
                    title="Remover comentário"
                    className="opacity-0 group-hover:opacity-100 p-1 text-brand-rose hover:bg-brand-rose/20 rounded transition-opacity"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              <p className="text-brand-text/90 line-clamp-2 text-[11px] pl-4 border-l-2 border-amber-500/40">
                {entry.snippet}
              </p>

              {entry.timestamp && (
                <div className="flex items-center gap-1 text-[9px] text-brand-mutedGold mt-2 pl-4">
                  <Calendar size={10} />
                  <span>{entry.timestamp}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
