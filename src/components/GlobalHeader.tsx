'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  X,
  Layers,
  Home,
  Wrench,
  ChevronDown,
  User,
  Shield,
  FileCheck,
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = ['Arquivo', 'Editar', 'Visualizar', 'Conversão GPR', 'Janela', 'Ajuda'];

  return (
    <header className="w-full flex flex-col bg-obsidian-panel border-b border-obsidian-border select-none z-30">
      {/* Faixa 1: Menu de Sistema */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-obsidian-border/70 text-xs text-brand-muted bg-obsidian-bg">
        <div className="flex items-center gap-4">
          {/* Logo GPR ENGINE com ícone geométrico dourado */}
          <div className="flex items-center gap-2 cursor-pointer pr-2 border-r border-obsidian-border/70">
            <div className="w-5 h-5 rounded bg-gradient-orange-gold flex items-center justify-center text-black font-black text-[11px] shadow-goldGlow">
              <span className="font-mono">◆</span>
            </div>
            <span className="font-black text-xs tracking-wider text-white">
              GPR <span className="text-transparent bg-clip-text bg-gradient-orange-gold">ENGINE</span>
            </span>
          </div>

          {/* Menus Dropdown */}
          <div className="flex items-center gap-1 text-[11px]">
            {menus.map((m) => (
              <div key={m} className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === m ? null : m)}
                  className={`px-2 py-1 rounded hover:bg-obsidian-panelDark hover:text-white transition-colors ${
                    activeMenu === m ? 'bg-obsidian-panelDark text-white' : ''
                  }`}
                >
                  {m}
                </button>
                {activeMenu === m && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-obsidian-panelDark border border-obsidian-border rounded-xl shadow-subtle p-1 z-50 animate-in fade-in zoom-in-95 text-xs text-white">
                    <button
                      onClick={() => {
                        onNewDocumentClick();
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-obsidian-hover hover:text-gold-metallic flex items-center justify-between"
                    >
                      <span>Abrir Arquivo...</span>
                      <span className="text-[10px] text-brand-muted font-mono">Ctrl+O</span>
                    </button>
                    <button
                      onClick={() => setActiveMenu(null)}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-obsidian-hover hover:text-gold-metallic flex items-center justify-between"
                    >
                      <span>Exportar PDF...</span>
                      <span className="text-[10px] text-brand-muted font-mono">Ctrl+S</span>
                    </button>
                    <div className="my-1 border-t border-obsidian-border/60" />
                    <button
                      onClick={() => setActiveMenu(null)}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-obsidian-hover hover:text-gold-metallic"
                    >
                      Preferências do Sistema
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de Status / Conta */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="hidden sm:inline-flex items-center gap-1 text-gold-metallic bg-obsidian-card px-2 py-0.5 rounded border border-obsidian-border">
            <Shield size={11} />
            <span>Licença Pro Ativa</span>
          </span>
          <div className="flex items-center gap-1.5 pl-2">
            <div className="w-5 h-5 rounded-full bg-gradient-orange-gold flex items-center justify-center text-black font-bold text-[10px]">
              W
            </div>
            <span className="text-white font-medium">Wisterly</span>
          </div>
        </div>
      </div>

      {/* Faixa 2: Navegação por Abas + Busca */}
      <div className="h-10 px-2 flex items-center justify-between bg-obsidian-panel">
        {/* Abas */}
        <div className="flex items-center gap-1 overflow-x-auto h-full scrollbar-none">
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

        {/* Extrema Direita: Busca Global */}
        <div className="relative pl-3">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-44 lg:w-56 bg-obsidian-bg border border-obsidian-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-brand-muted outline-none focus:border-gold-metallic transition-all"
          />
          <Search size={13} className="absolute left-5.5 top-2.5 text-gold-metallic pointer-events-none" />
        </div>
      </div>
    </header>
  );
};
