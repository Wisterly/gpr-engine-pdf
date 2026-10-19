'use client';

import React, { useState, useRef } from 'react';
import {
  ToolMode,
  PageAnnotations,
  DrawingPath,
  TextAnnotation,
  StampAnnotation,
  Point,
} from '@/types/pdf';
import { X, Check } from 'lucide-react';

interface AnnotationOverlayProps {
  width: number;
  height: number;
  activeTool: ToolMode;
  selectedColor: string;
  annotations: PageAnnotations;
  activeStampType: 'APROVADO' | 'CONFERIDO' | 'URGENTE' | 'MEDIDO GPR' | 'EM ANÁLISE' | null;
  onUpdateAnnotations: (newAnnotations: PageAnnotations) => void;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  width,
  height,
  activeTool,
  selectedColor,
  annotations,
  activeStampType,
  onUpdateAnnotations,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [tempTextValue, setTempTextValue] = useState('');

  // Converte posição do ponteiro do mouse para fração normalizada (0 a 1)
  const getNormalizedPoint = (e: React.MouseEvent<HTMLDivElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'draw' || activeTool === 'highlight') {
      setIsDrawing(true);
      const pt = getNormalizedPoint(e);
      setCurrentPath([pt]);
    } else if (activeTool === 'text') {
      const pt = getNormalizedPoint(e);
      const newTextId = `txt_${Date.now()}`;
      const newText: TextAnnotation = {
        id: newTextId,
        x: pt.x,
        y: pt.y,
        text: 'Novo texto...',
        fontSize: 16,
        color: selectedColor,
      };

      onUpdateAnnotations({
        ...annotations,
        texts: [...annotations.texts, newText],
      });
      setEditingTextId(newTextId);
      setTempTextValue(newText.text);
    } else if (activeTool === 'stamp' && activeStampType) {
      const pt = getNormalizedPoint(e);
      const newStamp: StampAnnotation = {
        id: `stamp_${Date.now()}`,
        x: pt.x,
        y: pt.y,
        type: activeStampType,
        color: selectedColor,
      };

      onUpdateAnnotations({
        ...annotations,
        stamps: [...annotations.stamps, newStamp],
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const pt = getNormalizedPoint(e);
    setCurrentPath((prev) => [...prev, pt]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPath.length > 1) {
      const newDrawing: DrawingPath = {
        id: `draw_${Date.now()}`,
        points: currentPath,
        color: selectedColor,
        size: activeTool === 'highlight' ? 20 : 3,
        opacity: activeTool === 'highlight' ? 0.35 : 1,
        tool: activeTool === 'highlight' ? 'highlight' : 'draw',
      };

      onUpdateAnnotations({
        ...annotations,
        drawings: [...annotations.drawings, newDrawing],
      });
    }

    setCurrentPath([]);
  };

  const handleDeleteText = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      texts: annotations.texts.filter((t) => t.id !== id),
    });
    if (editingTextId === id) setEditingTextId(null);
  };

  const handleSaveText = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      texts: annotations.texts.map((t) => (t.id === id ? { ...t, text: tempTextValue } : t)),
    });
    setEditingTextId(null);
  };

  const handleDeleteStamp = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      stamps: annotations.stamps.filter((s) => s.id !== id),
    });
  };

  // Converte pontos normalizados em string SVG 'd'
  const pointsToSvgPath = (points: Point[]) => {
    if (points.length < 2) return '';
    return points.reduce((acc, pt, i) => {
      const px = pt.x * width;
      const py = pt.y * height;
      return i === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`;
    }, '');
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ width, height }}
      className={`absolute inset-0 z-10 ${
        activeTool === 'select'
          ? 'cursor-default'
          : activeTool === 'draw' || activeTool === 'highlight'
          ? 'cursor-crosshair'
          : activeTool === 'text'
          ? 'cursor-text'
          : 'cursor-cell'
      }`}
    >
      {/* Camada SVG para desenhos vetoriais e marca-texto */}
      <svg className="w-full h-full pointer-events-none">
        {/* Desenhos já salvos */}
        {annotations.drawings.map((draw) => (
          <path
            key={draw.id}
            d={pointsToSvgPath(draw.points)}
            stroke={draw.color}
            strokeWidth={draw.size}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={draw.opacity}
          />
        ))}

        {/* Traço sendo desenhado no momento */}
        {isDrawing && currentPath.length > 1 && (
          <path
            d={pointsToSvgPath(currentPath)}
            stroke={selectedColor}
            strokeWidth={activeTool === 'highlight' ? 20 : 3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={activeTool === 'highlight' ? 0.35 : 1}
          />
        )}
      </svg>

      {/* Camada de Textos Anotados */}
      {annotations.texts.map((item) => {
        const left = item.x * width;
        const top = item.y * height;
        const isEditing = editingTextId === item.id;

        return (
          <div
            key={item.id}
            style={{ left: `${left}px`, top: `${top}px` }}
            onClick={(e) => e.stopPropagation()}
            className="absolute group z-20 -translate-y-1/2"
          >
            {isEditing ? (
              <div className="flex items-center gap-1 bg-brand-panel p-1.5 rounded-xl border border-amber-500 shadow-goldGlow">
                <input
                  type="text"
                  autoFocus
                  value={tempTextValue}
                  onChange={(e) => setTempTextValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveText(item.id);
                    if (e.key === 'Escape') setEditingTextId(null);
                  }}
                  className="bg-brand-dark px-2 py-1 text-xs text-white rounded border border-brand-cardBorder outline-none font-sans min-w-[140px]"
                />
                <button
                  onClick={() => handleSaveText(item.id)}
                  title="Salvar Texto"
                  className="p-1 rounded bg-brand-emerald text-white hover:opacity-90"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => handleDeleteText(item.id)}
                  title="Remover"
                  className="p-1 rounded bg-brand-rose text-white hover:opacity-90"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div
                onDoubleClick={() => {
                  setEditingTextId(item.id);
                  setTempTextValue(item.text);
                }}
                className="cursor-pointer px-2 py-0.5 rounded border border-transparent hover:border-brand-accent/50 hover:bg-brand-panel/80 transition-all flex items-center gap-1.5"
              >
                <span
                  style={{ color: item.color, fontSize: `${item.fontSize || 16}px` }}
                  className="font-medium drop-shadow-sm select-text"
                >
                  {item.text}
                </span>
                <button
                  onClick={() => handleDeleteText(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-brand-rose p-0.5 rounded hover:bg-brand-rose/20 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Camada de Carimbos */}
      {annotations.stamps.map((stamp) => {
        const left = stamp.x * width;
        const top = stamp.y * height;

        return (
          <div
            key={stamp.id}
            style={{ left: `${left}px`, top: `${top}px` }}
            onClick={(e) => e.stopPropagation()}
            className="absolute group z-20 cursor-move -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="px-3 py-1.5 rounded-lg border-2 font-black tracking-widest text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-sm"
              style={{
                color: stamp.color,
                borderColor: stamp.color,
                backgroundColor: `${stamp.color}15`,
              }}
            >
              <span>{stamp.type}</span>
              <button
                onClick={() => handleDeleteStamp(stamp.id)}
                className="opacity-0 group-hover:opacity-100 text-brand-rose p-0.5 rounded hover:bg-brand-rose/20 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
