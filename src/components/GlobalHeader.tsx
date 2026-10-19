'use client';

import React from 'react';
import {
  FileText,
  Search,
  Plus,
  X,
  Home,
  Wrench,
} from 'lucide-react';
import { OpenTab } from '@/types/pdf';

interface GlobalHeaderProps {
  tabs: OpenTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewDocumentClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewDocumentClick,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="w-full flex flex-col bg-obsidian-panel border-b border-obsidian-border select-none z-30 shadow-subtle">
      {/* 
        [PONTO DE CONTROLE: PC-2 e PC-3]
        - [PC-2]: Menus superiores de sistema (Arquivo, Editar, Visualizar...) removidos para visual limpo.
        - [PC-3]: Selo 'Licença Pro Ativa' removido do canto superior direito.
      */}
      <div className="h-12 px-3 flex items-center justify-between bg-obsidian-panel">
        {/* Esquerda: Logo GPR ENGINE + Abas Integradas */}
        <div className="flex items-center gap-3 overflow-x-auto h-full scrollbar-none">
          {/* Logo GPR ENGINE */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 cursor-pointer pr-3 border-r border-obsidian-border/80 shrink-0"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-orange-gold flex items-center justify-center text-black font-black text-xs shadow-goldGlow">
              <span className="font-mono">◆</span>
            </div>
            <span className="font-black text-xs tracking-wider text-white hidden sm:inline">
              GPR <span className="text-transparent bg-clip-text bg-gradient-orange-gold">ENGINE</span>
            </span>
          </div>

          {/* Abas */}
          <div className="flex items-center gap-1 h-full">
            {/* Aba 1: Início */}
            <button
              onClick={() => onSelectTab('home')}
              className={`h-full px-3.5 flex items-center gap-2 text-xs font-bold transition-all relative ${
                activeTabId === 'home'
                  ? 'text-white bg-obsidian-bg'
                  : 'text-brand-muted hover:text-white hover:bg-obsidian-hover'
              }`}
            >
              <Home size={14} className={activeTabId === 'home' ? 'text-orange-vibrant' : ''} />
              <span>Início</span>
              {activeTabId === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-tab-active" />
              )}
            </button>

            {/* Aba 2: Ferramentas */}
            <button
              onClick={() => onSelectTab('tools')}
              className={`h-full px-3.5 flex items-center gap-2 text-xs font-bold transition-all relative ${
                activeTabId === 'tools'
                  ? 'text-white bg-obsidian-bg'
                  : 'text-brand-muted hover:text-white hover:bg-obsidian-hover'
              }`}
            >
              <Wrench size={14} className={activeTabId === 'tools' ? 'text-gold-metallic' : ''} />
              <span>Ferramentas</span>
              {activeTabId === 'tools' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-tab-active" />
              )}
            </button>

            {/* Divisória Vertical sutil */}
            <div className="w-[1px] h-4 bg-obsidian-border mx-1" />

            {/* Abas Dinâmicas de Documentos */}
            {tabs
              .filter((t) => t.type === 'document')
              .map((tab) => {
                const isActive = activeTabId === tab.id;
                return (
                  <div
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`group h-full px-3 flex items-center gap-2 text-xs font-medium cursor-pointer transition-all relative ${
                      isActive
                        ? 'text-white bg-obsidian-bg border-x border-obsidian-border'
                        : 'text-brand-muted hover:text-white hover:bg-obsidian-hover'
                    }`}
                  >
                    <FileText
                      size={13}
                      className={isActive ? 'text-orange-vibrant' : 'text-brand-muted'}
                    />
                    <span className="max-w-[170px] truncate">{tab.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      title="Fechar documento"
                      className="p-0.5 rounded-full hover:bg-obsidian-panelDark text-brand-muted hover:text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-tab-active" />
                    )}
                  </div>
                );
              })}

            {/* Botão + para novo documento */}
            <button
              onClick={onNewDocumentClick}
              title="Abrir novo PDF"
              className="p-1.5 rounded-lg text-brand-muted hover:text-gold-metallic hover:bg-obsidian-hover ml-1 transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* Direita: Busca Global + Perfil Sutil (Sem selo de licença) */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-40 sm:w-52 bg-obsidian-bg border border-obsidian-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-brand-muted outline-none focus:border-gold-metallic transition-all"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-gold-metallic pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-obsidian-border">
            <div className="w-6 h-6 rounded-full bg-gradient-orange-gold flex items-center justify-center text-black font-black text-[11px] shadow-sm">
              W
            </div>
            <span className="text-white font-medium text-xs hidden md:inline">Wisterly</span>
          </div>
        </div>
      </div>
    </header>
  );
};
