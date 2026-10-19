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
      { id: 'export', name: 'Exportar PDF', actionText: 'Abrir ▾', icon: 'export', category: 'Criar e editar', description: 'Word, Excel, Imagem, CAD' },
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

const renderToolIcon = (iconName: string) => {
  switch (iconName) {
    case 'create':
      return <PlusCircle size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'combine':
      return <Layers size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'organize':
      return <BookOpen size={28} className="text-gold-amber" strokeWidth={1.75} />;
    case 'edit':
      return <FileEdit size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'export':
      return <FileOutput size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'scan':
      return <Scan size={28} className="text-gold-amber" strokeWidth={1.75} />;
    case 'media':
      return <Video size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'share':
      return <Share2 size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'review':
      return <Send size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'comment':
      return <MessageSquare size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'stamp':
      return <Stamp size={28} className="text-gold-amber" strokeWidth={1.75} />;
    case 'compare':
      return <GitCompare size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'measure':
      return <Ruler size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'fill_sign':
      return <FileSignature size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'prepare_form':
      return <FileSpreadsheet size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'certificates':
      return <Award size={28} className="text-gold-amber" strokeWidth={1.75} />;
    case 'protect':
      return <Shield size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'redact':
      return <EyeOff size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'pdf_standards':
      return <FileText size={28} className="text-gold-amber" strokeWidth={1.75} />;
    case 'optimize':
      return <Zap size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'print_prod':
      return <Printer size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'accessibility':
      return <Sparkles size={28} className="text-gold-amber" strokeWidth={1.75} />;
    case 'custom_tool':
      return <Sliders size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    case 'action_wizard':
      return <PlayCircle size={28} className="text-orange-vibrant" strokeWidth={1.75} />;
    case 'index_tool':
      return <Bookmark size={28} className="text-gold-amber" strokeWidth={1.75} />;
    case 'js_tool':
      return <Code size={28} className="text-gold-metallic" strokeWidth={1.75} />;
    default:
      return <FileText size={28} className="text-gold-metallic" strokeWidth={1.75} />;
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
        {/* Topo: Barra ampla de Pesquisa de Ferramentas */}
        <div className="sticky top-0 z-10 px-8 py-5 bg-obsidian-panel/95 backdrop-blur border-b border-obsidian-border flex items-center justify-between gap-4">
          <div className="relative max-w-xl w-full">
            <input
              type="text"
              placeholder="Ferramentas de pesquisa..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-obsidian-bg border border-obsidian-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-brand-muted outline-none focus:border-gold-metallic transition-all shadow-inner"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-gold-metallic pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <span>Catálogo Completo GPR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-vibrant animate-ping" />
          </div>
        </div>

        {/* Área Central: Grid Categorizado em 5 Seções */}
        <div className="p-8 space-y-10 max-w-7xl w-full mx-auto">
          {filteredCategories.map((cat) => (
            <section key={cat.title} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-obsidian-border">
                <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-gradient-orange-gold" />
                  <span>{cat.title}</span>
                </h3>
                <span className="text-[11px] font-mono text-brand-mutedGold">
                  {cat.items.length} ferramentas
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {cat.items.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool(tool.id)}
                    className="relative flex flex-col items-center justify-between p-4 rounded-2xl bg-obsidian-panel border border-obsidian-border hover:border-gold-metallic/50 hover:bg-obsidian-hover transition-all cursor-pointer group shadow-subtle text-center min-h-[175px]"
                  >
                    {/* Selo NOVO */}
                    {tool.isNew && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-gradient-orange-gold text-black shadow-sm">
                        NOVO
                      </span>
                    )}

                    {/* Ícone Grande Estilizado */}
                    <div className="w-14 h-14 rounded-2xl bg-obsidian-card border border-obsidian-border flex items-center justify-center my-1 group-hover:scale-110 transition-transform shadow-sm">
                      {renderToolIcon(tool.icon)}
                    </div>

                    {/* Nome da Ferramenta */}
                    <div className="w-full my-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-gold-metallic transition-colors leading-tight line-clamp-2">
                        {tool.name}
                      </h4>
                      {tool.description && (
                        <p className="text-[10px] text-brand-muted mt-0.5 truncate">
                          {tool.description}
                        </p>
                      )}
                    </div>

                    {/* Botão Dropdown Abrir ou Adicionar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTool(tool.id);
                      }}
                      className={`w-full py-1 px-2.5 rounded-xl text-[11px] font-semibold border flex items-center justify-center gap-1 transition-all ${
                        tool.actionText.includes('Abrir')
                          ? 'bg-obsidian-card hover:bg-gradient-orange-gold hover:text-black hover:border-transparent text-white border-obsidian-border'
                          : 'bg-obsidian-card hover:bg-obsidian-panelDark text-brand-muted hover:text-white border-obsidian-border'
                      }`}
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
