'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Layers,
  FileEdit,
  FileOutput,
  BookOpen,
  Stamp,
  Shield,
  Ruler,
  SlidersHorizontal,
  Plus,
  X,
  UploadCloud,
  LayoutList,
  LayoutGrid,
  FileText,
  Check,
} from 'lucide-react';
import { RecentFile } from '@/types/pdf';

interface HomeScreenProps {
  recentFiles: RecentFile[];
  onOpenFile: (file: RecentFile) => void;
  onUploadFile: (file: File) => void;
  onGoToToolsTab: () => void;
  onQuickAction: (action: string) => void;
}

interface QuickToolDef {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const ALL_AVAILABLE_QUICK_TOOLS: QuickToolDef[] = [
  { id: 'create', name: 'Criar PDF', icon: <PlusCircle size={15} className="text-orange-vibrant" /> },
  { id: 'share', name: 'Compartilhar', icon: <Share2 size={15} className="text-gold-metallic" /> },
  { id: 'sign', name: 'Preencher e assinar', icon: <FileSignature size={15} className="text-orange-vibrant" /> },
  { id: 'comment', name: 'Comentário', icon: <MessageSquare size={15} className="text-gold-metallic" /> },
  { id: 'optimize', name: 'Otimizar PDF', icon: <Zap size={15} className="text-gold-amber" /> },
  { id: 'combine', name: 'Combinar arquivos', icon: <Layers size={15} className="text-gold-metallic" /> },
  { id: 'edit', name: 'Editar PDF', icon: <FileEdit size={15} className="text-orange-vibrant" /> },
  { id: 'organize', name: 'Organizar páginas', icon: <BookOpen size={15} className="text-gold-amber" /> },
  { id: 'export', name: 'Exportar PDF', icon: <FileOutput size={15} className="text-gold-metallic" /> },
  { id: 'stamp', name: 'Carimbo', icon: <Stamp size={15} className="text-gold-amber" /> },
  { id: 'protect', name: 'Proteger', icon: <Shield size={15} className="text-gold-metallic" /> },
  { id: 'measure', name: 'Medir', icon: <Ruler size={15} className="text-gold-metallic" /> },
];

const DEFAULT_ACTIVE_TOOL_IDS = ['create', 'share', 'sign', 'comment', 'optimize'];

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

  /*
    [PONTO DE CONTROLE: PC-4]
    - Ferramentas rápidas minimalistas, compactas e quase transparentes.
    - Personalização total: usuário pode adicionar, remover e gerenciar ferramentas rápidas salvas.
  */
  const [activeToolIds, setActiveToolIds] = useState<string[]>(DEFAULT_ACTIVE_TOOL_IDS);
  const [isEditingQuickTools, setIsEditingQuickTools] = useState<boolean>(false);

  // Carrega preferências salvas no navegador
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gpr_custom_quick_tools');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveToolIds(parsed);
        }
      }
    } catch (e) {
      // Ignora erro de storage
    }
  }, []);

  const toggleToolActive = (toolId: string) => {
    let updated: string[];
    if (activeToolIds.includes(toolId)) {
      if (activeToolIds.length <= 1) {
        alert('Você deve manter pelo menos uma ferramenta rápida ativa.');
        return;
      }
      updated = activeToolIds.filter((id) => id !== toolId);
    } else {
      updated = [...activeToolIds, toolId];
    }
    setActiveToolIds(updated);
    try {
      localStorage.setItem('gpr_custom_quick_tools', JSON.stringify(updated));
    } catch (e) {}
  };

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

  const currentVisibleQuickTools = ALL_AVAILABLE_QUICK_TOOLS.filter((t) =>
    activeToolIds.includes(t.id)
  );

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

      {/* 
        [PONTO DE CONTROLE: PC-1]
        Sidebar Esquerda (240px) com a caixa inferior 'GPR Engine Pro' removida.
      */}
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
            onClick={() => alert('Conexão com contas em nuvem disponível para sincronização.')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-brand-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <UserPlus size={15} className="text-orange-vibrant" />
            <span>Adicionar uma conta...</span>
          </button>
        </div>
      </aside>

      {/* Área Principal da Aba Início */}
      <main className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* 
          [PONTO DE CONTROLE: PC-4]
          Barra de Ferramentas Rápidas Minimalista, Intimista & Editável
        */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 px-3 rounded-2xl bg-obsidian-panel/30 border border-obsidian-border/60 backdrop-blur-sm">
          {/* Tira horizontal de ícones e nomes sutis */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {currentVisibleQuickTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onQuickAction(tool.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-panel/40 hover:bg-obsidian-panelDark/80 border border-obsidian-border/40 hover:border-gold-metallic/40 text-brand-text hover:text-gold-metallic text-xs font-medium transition-all group shrink-0"
              >
                <span className="group-hover:scale-110 transition-transform">{tool.icon}</span>
                <span className="text-[11px]">{tool.name}</span>
              </button>
            ))}

            {/* Botão de Adicionar / Personalizar Ferramentas Rápidas */}
            <button
              onClick={() => setIsEditingQuickTools(true)}
              title="Personalizar ferramentas rápidas"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-dashed border-obsidian-border hover:border-gold-metallic/60 text-brand-muted hover:text-gold-metallic text-[11px] transition-all shrink-0 ml-1"
            >
              <SlidersHorizontal size={13} />
              <span>Editar barra</span>
            </button>
          </div>

          {/* Importação Rápida Compacta */}
          <button
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-vibrant/10 to-gold-metallic/10 hover:from-orange-vibrant/20 hover:to-gold-metallic/20 border border-gold-metallic/30 text-gold-metallic text-xs font-semibold transition-all shrink-0"
          >
            <UploadCloud size={15} />
            <span>Importar PDF</span>
          </button>
        </div>

        {/* Modal de Personalização das Ferramentas Rápidas [PC-4] */}
        {isEditingQuickTools && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="max-w-md w-full bg-obsidian-panel border border-obsidian-border rounded-3xl p-5 shadow-goldGlow select-none">
              <div className="flex items-center justify-between pb-3 border-b border-obsidian-border mb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-gold-metallic" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Personalizar Ferramentas Rápidas
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditingQuickTools(false)}
                  className="p-1 rounded-lg text-brand-muted hover:text-white hover:bg-obsidian-hover"
                >
                  <X size={15} />
                </button>
              </div>

              <p className="text-[11px] text-brand-muted mb-3">
                Selecione quais atalhos você deseja manter visíveis na barra superior da tela inicial:
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {ALL_AVAILABLE_QUICK_TOOLS.map((tool) => {
                  const isChecked = activeToolIds.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      onClick={() => toggleToolActive(tool.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-obsidian-panelDark border-gold-metallic/50 text-white'
                          : 'bg-obsidian-bg/50 border-obsidian-border text-brand-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-medium truncate">
                        {tool.icon}
                        <span className="truncate">{tool.name}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                          isChecked ? 'bg-gradient-orange-gold text-black' : 'border border-obsidian-border'
                        }`}
                      >
                        {isChecked && <Check size={11} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-obsidian-border mt-4">
                <button
                  onClick={() => {
                    setActiveToolIds(DEFAULT_ACTIVE_TOOL_IDS);
                    localStorage.removeItem('gpr_custom_quick_tools');
                  }}
                  className="text-[11px] text-brand-muted hover:text-gold-metallic"
                >
                  Restaurar padrão
                </button>
                <button
                  onClick={() => setIsEditingQuickTools(false)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-orange-gold text-black text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
                >
                  Concluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Seção Recentes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-obsidian-border/70">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock size={15} className="text-orange-vibrant" />
              <span>{activeSideMenu === 'favorites' ? 'Documentos Favoritos' : 'Arquivos Recentes'}</span>
              <span className="text-[10px] font-mono text-brand-mutedGold font-normal">
                ({displayedFiles.length})
              </span>
            </h3>

            {/* Alternância Lista vs Grade */}
            <div className="flex items-center gap-1 bg-obsidian-panel p-0.5 rounded-xl border border-obsidian-border">
              <button
                onClick={() => setViewMode('list')}
                title="Visualização em Lista"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-orange-gold text-black shadow-sm font-bold'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                <LayoutList size={13} />
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
                <LayoutGrid size={13} />
              </button>
            </div>
          </div>

          {/* Tabela de Arquivos (Modo Lista) */}
          {viewMode === 'list' ? (
            <div className="border border-obsidian-border rounded-2xl bg-obsidian-panel overflow-hidden shadow-subtle">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-obsidian-border bg-obsidian-panelDark text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                    <th className="py-2.5 px-4 w-10">
                      <input type="checkbox" className="rounded accent-orange-vibrant cursor-pointer" />
                    </th>
                    <th className="py-2.5 px-2 w-10"></th>
                    <th className="py-2.5 px-4">Nome</th>
                    <th className="py-2.5 px-4">Aberto em</th>
                    <th className="py-2.5 px-4 text-right">Tamanho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-border/60">
                  {displayedFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => onOpenFile(file)}
                      className="hover:bg-obsidian-hover transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded accent-orange-vibrant cursor-pointer" />
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="w-6 h-6 rounded-lg bg-obsidian-card border border-obsidian-border flex items-center justify-center text-orange-vibrant group-hover:text-gold-metallic group-hover:border-gold-metallic/40 transition-colors">
                          <FileText size={14} />
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-white group-hover:text-gold-metallic transition-colors">
                        <div className="flex items-center gap-2">
                          <span>{file.name}</span>
                          {file.isFavorite && (
                            <Star size={11} className="text-gold-metallic fill-gold-metallic" />
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-brand-muted font-mono text-[11px]">
                        {file.openedAt}
                      </td>
                      <td className="py-2.5 px-4 text-right text-brand-mutedGold font-mono text-[11px]">
                        {file.size}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Modo Grade */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayedFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onOpenFile(file)}
                  className="p-3.5 rounded-2xl bg-obsidian-panel border border-obsidian-border hover:border-gold-metallic/50 hover:bg-obsidian-hover transition-all cursor-pointer shadow-subtle group flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] rounded-xl bg-obsidian-card border border-obsidian-border flex items-center justify-center mb-2.5 group-hover:scale-102 transition-transform">
                    <FileText size={32} className="text-orange-vibrant group-hover:text-gold-metallic" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-gold-metallic truncate mb-0.5">
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-brand-muted font-mono">
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
