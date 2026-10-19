'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Layers,
  FileText,
  FileEdit,
  FileOutput,
  Scan,
  Video,
  Share2,
  Send,
  MessageSquare,
  Stamp,
  GitCompare,
  Ruler,
  FileSignature,
  FileSpreadsheet,
  Award,
  Shield,
  EyeOff,
  BookOpen,
  Zap,
  Printer,
  Sparkles,
  Sliders,
  PlayCircle,
  Bookmark,
  Code,
  ChevronDown,
} from 'lucide-react';
import { ToolCategory, ToolItem } from '@/types/pdf';

interface ToolsCatalogScreenProps {
  onSelectTool: (toolId: string) => void;
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    title: 'Criar e editar',
    items: [
      { id: 'create', name: 'Criar PDF', actionText: 'Abrir ▾', icon: 'create', category: 'Criar e editar' },
      { id: 'combine', name: 'Combinar arquivos', actionText: 'Abrir ▾', icon: 'combine', category: 'Criar e editar' },
      { id: 'organize', name: 'Organizar páginas', actionText: 'Abrir ▾', icon: 'organize', category: 'Criar e editar' },
      { id: 'edit', name: 'Editar PDF', actionText: 'Abrir ▾', icon: 'edit', category: 'Criar e editar' },
      { id: 'export', name: 'Exportar PDF', actionText: 'Abrir ▾', icon: 'export', category: 'Criar e editar', description: 'Word, Excel, CAD' },
      { id: 'scan', name: 'Aprimorar digitalizações', actionText: 'Abrir ▾', icon: 'scan', category: 'Criar e editar' },
      { id: 'media', name: 'Mídia avançada', actionText: 'Adicionar ▾', icon: 'media', category: 'Criar e editar' },
    ],
  },
  {
    title: 'Compartilhar e revisar',
    items: [
      { id: 'share', name: 'Compartilhar', actionText: 'Adicionar ▾', icon: 'share', category: 'Compartilhar e revisar' },
      { id: 'review', name: 'Enviar para revisão', actionText: 'Abrir ▾', icon: 'review', isNew: true, category: 'Compartilhar e revisar' },
      { id: 'comment', name: 'Comentário', actionText: 'Abrir ▾', icon: 'comment', category: 'Compartilhar e revisar' },
      { id: 'stamp', name: 'Carimbo', actionText: 'Adicionar ▾', icon: 'stamp', category: 'Compartilhar e revisar' },
      { id: 'compare', name: 'Comparar arquivos', actionText: 'Adicionar ▾', icon: 'compare', category: 'Compartilhar e revisar' },
      { id: 'measure', name: 'Medir', actionText: 'Adicionar ▾', icon: 'measure', category: 'Compartilhar e revisar' },
    ],
  },
  {
    title: 'Formulários e assinaturas',
    items: [
      { id: 'fill_sign', name: 'Preencher e assinar', actionText: 'Abrir ▾', icon: 'fill_sign', category: 'Formulários e assinaturas' },
      { id: 'prepare_form', name: 'Preparar formulário', actionText: 'Adicionar ▾', icon: 'prepare_form', category: 'Formulários e assinaturas' },
      { id: 'certificates', name: 'Certificados', actionText: 'Adicionar ▾', icon: 'certificates', category: 'Formulários e assinaturas' },
    ],
  },
  {
    title: 'Proteger e padronizar',
    items: [
      { id: 'protect', name: 'Proteger', actionText: 'Abrir ▾', icon: 'protect', category: 'Proteger e padronizar' },
      { id: 'redact', name: 'Redigir', actionText: 'Adicionar ▾', icon: 'redact', category: 'Proteger e padronizar' },
      { id: 'pdf_standards', name: 'Padrões de PDF', actionText: 'Adicionar ▾', icon: 'pdf_standards', category: 'Proteger e padronizar' },
      { id: 'optimize', name: 'Otimizar PDF', actionText: 'Abrir ▾', icon: 'optimize', category: 'Proteger e padronizar' },
      { id: 'print_prod', name: 'Produção de impressão', actionText: 'Adicionar ▾', icon: 'print_prod', category: 'Proteger e padronizar' },
      { id: 'accessibility', name: 'Acessibilidade', actionText: 'Adicionar ▾', icon: 'accessibility', category: 'Proteger e padronizar' },
    ],
  },
  {
    title: 'Personalizar',
    items: [
      { id: 'custom_tool', name: 'Criar ferramenta personalizada', actionText: 'Adicionar ▾', icon: 'custom_tool', category: 'Personalizar' },
      { id: 'action_wizard', name: 'Assistente de ação', actionText: 'Adicionar ▾', icon: 'action_wizard', category: 'Personalizar' },
      { id: 'index_tool', name: 'Índice', actionText: 'Adicionar ▾', icon: 'index_tool', category: 'Personalizar' },
      { id: 'js_tool', name: 'JavaScript', actionText: 'Adicionar ▾', icon: 'js_tool', category: 'Personalizar' },
    ],
  },
];

const renderCleanIcon = (iconName: string) => {
  switch (iconName) {
    case 'create':
      return <PlusCircle size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'combine':
      return <Layers size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'organize':
      return <BookOpen size={22} className="text-gold-amber" strokeWidth={1.75} />;
    case 'edit':
      return <FileEdit size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'export':
      return <FileOutput size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'scan':
      return <Scan size={22} className="text-gold-amber" strokeWidth={1.75} />;
    case 'media':
      return <Video size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'share':
      return <Share2 size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'review':
      return <Send size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'comment':
      return <MessageSquare size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'stamp':
      return <Stamp size={22} className="text-gold-amber" strokeWidth={1.75} />;
    case 'compare':
      return <GitCompare size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'measure':
      return <Ruler size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'fill_sign':
      return <FileSignature size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'prepare_form':
      return <FileSpreadsheet size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'certificates':
      return <Award size={22} className="text-gold-amber" strokeWidth={1.75} />;
    case 'protect':
      return <Shield size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'redact':
      return <EyeOff size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'pdf_standards':
      return <FileText size={22} className="text-gold-amber" strokeWidth={1.75} />;
    case 'optimize':
      return <Zap size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'print_prod':
      return <Printer size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'accessibility':
      return <Sparkles size={22} className="text-gold-amber" strokeWidth={1.75} />;
    case 'custom_tool':
      return <Sliders size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'action_wizard':
      return <PlayCircle size={22} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'index_tool':
      return <Bookmark size={22} className="text-gold-amber" strokeWidth={1.75} />;
    case 'js_tool':
      return <Code size={22} className="text-gold-metallic" strokeWidth={1.75} />;
    default:
      return <FileText size={22} className="text-gold-metallic" strokeWidth={1.75} />;
  }
};

export const ToolsCatalogScreen: React.FC<ToolsCatalogScreenProps> = ({ onSelectTool }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!filterQuery.trim()) return TOOL_CATEGORIES;
    const q = filterQuery.toLowerCase();
    return TOOL_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [filterQuery]);

  return (
    <div className="flex-1 flex overflow-hidden bg-obsidian-bg select-none">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Topo: Barra de Pesquisa Compacta */}
        <div className="sticky top-0 z-10 px-8 py-3.5 bg-obsidian-panel/90 backdrop-blur border-b border-obsidian-border flex items-center justify-between gap-4">
          <div className="relative max-w-lg w-full">
            <input
              type="text"
              placeholder="Ferramentas de pesquisa..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-obsidian-bg border border-obsidian-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-brand-muted outline-none focus:border-gold-metallic transition-all shadow-inner"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-gold-metallic pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <span className="text-[11px]">Catálogo GPR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-vibrant" />
          </div>
        </div>

        {/* 
          [PONTO DE CONTROLE: PC-5]
          Layout Clean, sem bordas quadradas pesadas ao redor dos ícones,
          altura reduzida, espaçamento compacto e visual fluído.
        */}
        <div className="p-6 space-y-7 max-w-6xl w-full mx-auto">
          {filteredCategories.map((cat) => (
            <section key={cat.title} className="space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-obsidian-border/50">
                <h3 className="text-xs font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-orange-gold" />
                  <span>{cat.title}</span>
                </h3>
                <span className="text-[10px] font-mono text-brand-mutedGold">
                  {cat.items.length} itens
                </span>
              </div>

              {/* Grid Compacto e Clean (Sem caixas ou bordas pesadas ao redor) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                {cat.items.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool(tool.id)}
                    className="relative flex flex-col items-center justify-between p-2 rounded-xl hover:bg-obsidian-panel/60 transition-all cursor-pointer group text-center min-h-[115px]"
                  >
                    {/* Selo NOVO */}
                    {tool.isNew && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 rounded text-[7px] font-black uppercase tracking-wider bg-gradient-orange-gold text-black shadow-sm">
                        NOVO
                      </span>
                    )}

                    {/* Ícone Puro Flutuante (Sem caixa quadrada com bordas) */}
                    <div className="my-1 text-gold-metallic group-hover:scale-115 transition-transform duration-200">
                      {renderCleanIcon(tool.icon)}
                    </div>

                    {/* Nome da Ferramenta */}
                    <h4 className="text-[11px] font-semibold text-brand-text group-hover:text-gold-metallic transition-colors leading-tight line-clamp-2 px-1">
                      {tool.name}
                    </h4>

                    {/* Botão Dropdown Clean */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTool(tool.id);
                      }}
                      className="mt-1 py-0.5 px-2.5 rounded-lg text-[10px] font-medium text-brand-muted group-hover:text-white border border-transparent group-hover:border-obsidian-border hover:bg-obsidian-panelDark transition-all"
                    >
                      <span>{tool.actionText}</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
