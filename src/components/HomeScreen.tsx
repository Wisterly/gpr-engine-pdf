'use client';

import React, { useState, useRef } from 'react';
import {
  Clock,
  Star,
  HardDrive,
  UserPlus,
  PlusCircle,
  Share2,
  FileSignature,
  MessageSquare,
  Zap,
  ArrowRight,
  MoreHorizontal,
  UploadCloud,
  LayoutList,
  LayoutGrid,
  FileText,
  FileCheck,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { RecentFile } from '@/types/pdf';

interface HomeScreenProps {
  recentFiles: RecentFile[];
  onOpenFile: (file: RecentFile) => void;
  onUploadFile: (file: File) => void;
  onGoToToolsTab: () => void;
  onQuickAction: (action: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  recentFiles,
  onOpenFile,
  onUploadFile,
  onGoToToolsTab,
  onQuickAction,
}) => {
  const [activeSideMenu, setActiveSideMenu] = useState<'recents' | 'favorites'>('recents');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      onUploadFile(file);
    }
  };

  const displayedFiles =
    activeSideMenu === 'favorites' ? recentFiles.filter((f) => f.isFavorite) : recentFiles;

  return (
    <div className="flex-1 flex overflow-hidden bg-obsidian-bg select-none">
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

      {/* 3.1 Sidebar Esquerda (240px) */}
      <aside className="w-60 border-r border-obsidian-border bg-obsidian-panel flex flex-col p-3 select-none shrink-0">
        {/* Grupo Superior */}
        <div className="space-y-1 mb-6">
          <button
            onClick={() => setActiveSideMenu('recents')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
              activeSideMenu === 'recents'
                ? 'bg-obsidian-panelDark text-white shadow-subtle border border-obsidian-border'
                : 'text-brand-muted hover:text-white hover:bg-obsidian-hover'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock
                size={16}
                className={activeSideMenu === 'recents' ? 'text-orange-vibrant' : 'text-brand-muted'}
              />
              <span>Recentes</span>
            </div>
            {activeSideMenu === 'recents' && (
              <span className="w-1.5 h-4 rounded-full bg-gradient-orange-gold" />
            )}
          </button>

          <button
            onClick={() => setActiveSideMenu('favorites')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
              activeSideMenu === 'favorites'
                ? 'bg-obsidian-panelDark text-white shadow-subtle border border-obsidian-border'
                : 'text-brand-muted hover:text-white hover:bg-obsidian-hover'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star
                size={16}
                className={activeSideMenu === 'favorites' ? 'text-gold-metallic' : 'text-brand-muted'}
              />
              <span>Favoritos</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gradient-orange-gold text-black shadow-sm">
              NOVO
            </span>
          </button>
        </div>

        {/* Grupo Inferior: ARQUIVOS */}
        <div className="pt-3 border-t border-obsidian-border/70 space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-muted uppercase px-3">
            Arquivos
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <HardDrive size={15} className="text-gold-metallic" />
            <span>Meu computador</span>
          </button>
          <button
            onClick={() => alert('Recurso de conexão com Google Drive / OneDrive GPR em desenvolvimento.')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <UserPlus size={15} className="text-orange-vibrant" />
            <span>Adicionar uma conta...</span>
          </button>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="mt-auto p-3 rounded-2xl bg-obsidian-panelDark border border-obsidian-border">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-gold-metallic" />
            <span className="text-xs font-bold text-white">GPR Engine Pro</span>
          </div>
          <p className="text-[11px] text-brand-muted leading-relaxed">
            Manipulação de alta fidelidade para relatórios técnicos e medições.
          </p>
        </div>
      </aside>

      {/* 3.2 Área Principal da Aba Início */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Banner Horizontal Superior de Atalhos Rápidos + Card de Upload */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Container de 5 botões de ação rápida (3 colunas) */}
          <div className="xl:col-span-3 p-5 rounded-3xl bg-obsidian-panel border border-obsidian-border shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Ferramentas Rápidas</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-metallic/15 text-gold-metallic border border-gold-metallic/30 font-bold uppercase">
                    Acesso Direto
                  </span>
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Execute operações em PDFs com um clique no motor GPR
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onGoToToolsTab}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-card hover:bg-obsidian-hover text-gold-metallic border border-obsidian-border text-xs font-bold transition-all group"
                >
                  <span>Ver todas as ferramentas</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button className="p-1.5 rounded-xl bg-obsidian-card hover:bg-obsidian-hover text-brand-muted hover:text-white border border-obsidian-border">
                  <MoreHorizontal size={15} />
                </button>
              </div>
            </div>

            {/* 5 Botões Horizontais */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'create', label: 'Criar PDF', icon: <PlusCircle size={20} className="text-orange-vibrant" /> },
                { id: 'share', label: 'Compartilhar', icon: <Share2 size={20} className="text-gold-metallic" /> },
                { id: 'sign', label: 'Preencher e assinar', icon: <FileSignature size={20} className="text-orange-vibrant" /> },
                { id: 'comment', label: 'Comentário', icon: <MessageSquare size={20} className="text-gold-metallic" /> },
                { id: 'optimize', label: 'Otimizar PDF', icon: <Zap size={20} className="text-gold-amber" /> },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => onQuickAction(btn.id)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border hover:border-gold-metallic/40 transition-all text-center group"
                >
                  <div className="p-2 rounded-xl bg-obsidian-panel mb-2 group-hover:scale-110 transition-transform shadow-sm">
                    {btn.icon}
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-gold-metallic transition-colors">
                    {btn.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Compacto de Upload Rápido (1 coluna) */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="p-5 rounded-3xl bg-gradient-to-br from-obsidian-panel to-obsidian-panelDark border-2 border-dashed border-obsidian-border hover:border-gold-metallic/60 transition-all cursor-pointer flex flex-col items-center justify-center text-center shadow-subtle group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-orange-gold/15 border border-gold-metallic/30 flex items-center justify-center text-gold-metallic mb-3 group-hover:scale-110 transition-transform shadow-goldGlow">
              <UploadCloud size={24} />
            </div>
            <h3 className="text-xs font-bold text-white mb-1">
              Importação Rápida
            </h3>
            <p className="text-[11px] text-brand-muted px-2">
              Arraste e solte seu <strong className="text-gold-metallic">PDF / GPR</strong> aqui ou clique para importar
            </p>
          </div>
        </div>

        {/* Seção Recentes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-obsidian-border/70">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-orange-vibrant" />
              <span>{activeSideMenu === 'favorites' ? 'Documentos Favoritos' : 'Arquivos Recentes'}</span>
              <span className="text-[11px] font-mono text-brand-mutedGold font-normal">
                ({displayedFiles.length})
              </span>
            </h3>

            {/* Alternância Lista vs Grade */}
            <div className="flex items-center gap-1 bg-obsidian-panel p-1 rounded-xl border border-obsidian-border">
              <button
                onClick={() => setViewMode('list')}
                title="Visualização em Lista"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-orange-gold text-black shadow-sm font-bold'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                <LayoutList size={14} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Visualização em Grade"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-orange-gold text-black shadow-sm font-bold'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>

          {/* Tabela de Arquivos (Modo Lista) */}
          {viewMode === 'list' ? (
            <div className="border border-obsidian-border rounded-2xl bg-obsidian-panel overflow-hidden shadow-subtle">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-obsidian-border bg-obsidian-panelDark text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                    <th className="py-3 px-4 w-10">
                      <input type="checkbox" className="rounded accent-orange-vibrant cursor-pointer" />
                    </th>
                    <th className="py-3 px-2 w-10"></th>
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3 px-4">Aberto em</th>
                    <th className="py-3 px-4 text-right">Tamanho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-border/60">
                  {displayedFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => onOpenFile(file)}
                      className="hover:bg-obsidian-hover transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded accent-orange-vibrant cursor-pointer" />
                      </td>
                      <td className="py-3 px-2">
                        <div className="w-7 h-7 rounded-lg bg-obsidian-card border border-obsidian-border flex items-center justify-center text-orange-vibrant group-hover:text-gold-metallic group-hover:border-gold-metallic/40 transition-colors">
                          <FileText size={15} />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white group-hover:text-gold-metallic transition-colors">
                        <div className="flex items-center gap-2">
                          <span>{file.name}</span>
                          {file.isFavorite && (
                            <Star size={12} className="text-gold-metallic fill-gold-metallic" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-brand-muted font-mono text-[11px]">
                        {file.openedAt}
                      </td>
                      <td className="py-3 px-4 text-right text-brand-mutedGold font-mono text-[11px]">
                        {file.size}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Modo Grade */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onOpenFile(file)}
                  className="p-4 rounded-2xl bg-obsidian-panel border border-obsidian-border hover:border-gold-metallic/50 hover:bg-obsidian-hover transition-all cursor-pointer shadow-subtle group flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] rounded-xl bg-obsidian-card border border-obsidian-border flex items-center justify-center mb-3 group-hover:scale-102 transition-transform">
                    <FileText size={36} className="text-orange-vibrant group-hover:text-gold-metallic" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-gold-metallic truncate mb-1">
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-brand-muted font-mono">
                      <span>{file.openedAt}</span>
                      <span className="text-brand-mutedGold">{file.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
