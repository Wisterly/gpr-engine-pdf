'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  PlusCircle,
  Layers,
  FileEdit,
  FileOutput,
  BookOpen,
  Send,
  MessageSquare,
  FileSignature,
  Scan,
  Shield,
  Zap,
  MoreHorizontal,
} from 'lucide-react';

interface RightRetractableToolboxProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelectTool: (toolId: string) => void;
  onGoToToolsTab: () => void;
}

interface ToolEntry {
  id: string;
  name: string;
  icon: React.ReactNode;
  isNew?: boolean;
}

const TOOLS_LIST: ToolEntry[] = [
  { id: 'create', name: 'Criar PDF', icon: <PlusCircle size={17} className="text-orange-vibrant" /> },
  { id: 'combine', name: 'Combinar arquivos', icon: <Layers size={17} className="text-gold-metallic" /> },
  { id: 'edit', name: 'Editar PDF', icon: <FileEdit size={17} className="text-orange-vibrant" /> },
  {
    id: 'export',
    name: 'Exportar PDF (Word, Excel, Imagem, CAD)',
    icon: <FileOutput size={17} className="text-gold-metallic" />,
  },
  { id: 'organize', name: 'Organizar páginas', icon: <BookOpen size={17} className="text-gold-amber" /> },
  {
    id: 'review',
    name: 'Enviar para revisão',
    icon: <Send size={17} className="text-orange-vibrant" />,
    isNew: true,
  },
  { id: 'comment', name: 'Comentário', icon: <MessageSquare size={17} className="text-gold-metallic" /> },
  { id: 'fill_sign', name: 'Preencher e assinar', icon: <FileSignature size={17} className="text-orange-vibrant" /> },
  { id: 'scan', name: 'Aprimorar digitalizações', icon: <Scan size={17} className="text-gold-amber" /> },
  { id: 'protect', name: 'Proteger', icon: <Shield size={17} className="text-gold-metallic" /> },
  { id: 'optimize', name: 'Otimizar PDF', icon: <Zap size={17} className="text-gold-metallic" /> },
];

export const RightRetractableToolbox: React.FC<RightRetractableToolboxProps> = ({
  isExpanded,
  onToggleExpand,
  onSelectTool,
  onGoToToolsTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = searchQuery.trim()
    ? TOOLS_LIST.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : TOOLS_LIST;

  return (
    <div className="relative flex select-none z-20">
      {/* Botão de alternância na linha divisória vertical esquerda (◂ / ▸) */}
      <button
        onClick={onToggleExpand}
        title={isExpanded ? 'Recolher caixa de ferramentas' : 'Expandir caixa de ferramentas'}
        className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-obsidian-panel border border-obsidian-border text-gold-metallic hover:text-white flex items-center justify-center shadow-goldGlow hover:scale-110 transition-transform z-30"
      >
        {isExpanded ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      {/* Painel: 52px quando recolhido, 280px quando ampliado */}
      <aside
        className={`border-l border-obsidian-border bg-obsidian-panel flex flex-col transition-all duration-300 overflow-hidden ${
          isExpanded ? 'w-[280px]' : 'w-[52px]'
        }`}
      >
        {isExpanded ? (
          /* ESTADO AMPLIADO (280px) */
          <div className="flex-1 flex flex-col h-full">
            {/* Topo do Painel */}
            <div className="p-3 border-b border-obsidian-border flex items-center gap-2 bg-obsidian-bg/50">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ferramentas de pesquisa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-obsidian-panelDark border border-obsidian-border rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-brand-muted outline-none focus:border-gold-metallic"
                />
                <Search size={13} className="absolute left-2.5 top-2.5 text-gold-metallic" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-brand-muted hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <button
                onClick={onToggleExpand}
                title="Fechar"
                className="p-1 rounded-lg text-brand-muted hover:text-white hover:bg-obsidian-hover"
              >
                <X size={15} />
              </button>
            </div>

            {/* Lista Vertical de Ferramentas */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-obsidian-hover text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div className="p-1.5 rounded-lg bg-obsidian-panelDark border border-obsidian-border group-hover:border-gold-metallic/40 transition-colors shrink-0">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-semibold text-white group-hover:text-gold-metallic transition-colors truncate">
                      {tool.name}
                    </span>
                  </div>

                  {tool.isNew && (
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-gradient-orange-gold text-black shrink-0 shadow-sm">
                      NOVO
                    </span>
                  )}
                </button>
              ))}

              {/* Item 12: Mais ferramentas */}
              <button
                onClick={onGoToToolsTab}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-obsidian-card hover:bg-obsidian-hover text-gold-metallic border border-obsidian-border mt-3 text-xs font-bold transition-all"
              >
                <div className="p-1.5 rounded-lg bg-obsidian-panel shrink-0">
                  <MoreHorizontal size={17} />
                </div>
                <span>Mais ferramentas</span>
              </button>
            </div>
          </div>
        ) : (
          /* ESTADO RECOLHIDO (52px - Ícones compactos empilhados) */
          <div className="flex-1 flex flex-col items-center py-3 gap-2 overflow-y-auto scrollbar-none">
            <button
              onClick={onToggleExpand}
              title="Pesquisar ferramentas"
              className="p-2 rounded-xl text-gold-metallic hover:bg-obsidian-hover transition-colors mb-1"
            >
              <Search size={16} />
            </button>

            {TOOLS_LIST.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                title={tool.name}
                className="p-2 rounded-xl hover:bg-obsidian-hover transition-all hover:scale-110 relative group"
              >
                {tool.icon}
                {tool.isNew && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-vibrant" />
                )}
              </button>
            ))}

            <button
              onClick={onGoToToolsTab}
              title="Mais ferramentas"
              className="mt-auto p-2 rounded-xl text-gold-metallic hover:bg-obsidian-hover transition-colors"
            >
              <MoreHorizontal size={17} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
