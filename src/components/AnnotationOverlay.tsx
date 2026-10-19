'use client';

import React, { useState } from 'react';
import {
  ToolMode,
  PageAnnotations,
  DrawingPath,
  TextAnnotation,
  StampAnnotation,
  StickyNote,
  ShapeAnnotation,
  SignatureAnnotation,
  FormMarkAnnotation,
  Point,
} from '@/types/pdf';
import { X, Check, MessageSquare, Trash2, Calendar } from 'lucide-react';

interface AnnotationOverlayProps {
  width: number;
  height: number;
  activeTool: ToolMode;
  selectedColor: string;
  strokeSize: number;
  annotations: PageAnnotations;
  activeStampType: 'APROVADO' | 'CONFERIDO' | 'URGENTE' | 'MEDIDO GPR' | 'EM ANÁLISE' | null;
  activeSignatureDataUrl: string | null;
  onUpdateAnnotations: (newAnnotations: PageAnnotations) => void;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  width,
  height,
  activeTool,
  selectedColor,
  strokeSize,
  annotations,
  activeStampType,
  activeSignatureDataUrl,
  onUpdateAnnotations,
}) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [currentShapePreview, setCurrentShapePreview] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [tempTextValue, setTempTextValue] = useState('');
  const [openStickyNoteId, setOpenStickyNoteId] = useState<string | null>(null);

  const getNormalizedPoint = (e: React.MouseEvent<HTMLDivElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const pt = getNormalizedPoint(e);

    // 1. Desenho Livre / Marca-texto / Sublinhado / Tachado
    if (['draw', 'highlight', 'underline', 'strikeout'].includes(activeTool)) {
      setIsInteracting(true);
      setCurrentPath([pt]);
    }
    // 2. Formas Geométricas (Retângulo, Círculo, Seta, Linha)
    else if (['rectangle', 'circle', 'arrow', 'line'].includes(activeTool)) {
      setIsInteracting(true);
      setStartPoint(pt);
      setCurrentShapePreview({ startX: pt.x, startY: pt.y, endX: pt.x, endY: pt.y });
    }
    // 3. Texto Livre
    else if (activeTool === 'text') {
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
        texts: [...(annotations.texts || []), newText],
      });
      setEditingTextId(newTextId);
      setTempTextValue(newText.text);
    }
    // 4. Nota Adesiva (Sticky Note estilo Acrobat)
    else if (activeTool === 'sticky_note') {
      const newNoteId = `note_${Date.now()}`;
      const newNote: StickyNote = {
        id: newNoteId,
        x: pt.x,
        y: pt.y,
        text: 'Adicione suas observações de revisão aqui...',
        author: 'Revisor GPR',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: selectedColor,
        isOpen: true,
      };

      onUpdateAnnotations({
        ...annotations,
        stickyNotes: [...(annotations.stickyNotes || []), newNote],
      });
      setOpenStickyNoteId(newNoteId);
    }
    // 5. Carimbo
    else if (activeTool === 'stamp' && activeStampType) {
      const newStamp: StampAnnotation = {
        id: `stamp_${Date.now()}`,
        x: pt.x,
        y: pt.y,
        type: activeStampType,
        color: selectedColor,
        timestamp: new Date().toLocaleDateString('pt-BR'),
      };

      onUpdateAnnotations({
        ...annotations,
        stamps: [...(annotations.stamps || []), newStamp],
      });
    }
    // 6. Assinatura Manuscrita
    else if (activeTool === 'signature' && activeSignatureDataUrl) {
      const newSig: SignatureAnnotation = {
        id: `sig_${Date.now()}`,
        x: pt.x,
        y: pt.y,
        width: 140,
        height: 50,
        dataUrl: activeSignatureDataUrl,
      };

      onUpdateAnnotations({
        ...annotations,
        signatures: [...(annotations.signatures || []), newSig],
      });
    }
    // 7. Preenchimento de Formulário (Check, Cross, Dot)
    else if (['check', 'cross', 'dot'].includes(activeTool)) {
      const newMark: FormMarkAnnotation = {
        id: `mark_${Date.now()}`,
        x: pt.x,
        y: pt.y,
        type: activeTool as any,
        color: selectedColor,
        size: 18,
      };

      onUpdateAnnotations({
        ...annotations,
        formMarks: [...(annotations.formMarks || []), newMark],
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteracting) return;
    const pt = getNormalizedPoint(e);

    if (['draw', 'highlight', 'underline', 'strikeout'].includes(activeTool)) {
      setCurrentPath((prev) => [...prev, pt]);
    } else if (startPoint && ['rectangle', 'circle', 'arrow', 'line'].includes(activeTool)) {
      setCurrentShapePreview({
        startX: startPoint.x,
        startY: startPoint.y,
        endX: pt.x,
        endY: pt.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isInteracting) return;
    setIsInteracting(false);

    // Salva traço de caneta / marca-texto
    if (currentPath.length > 1) {
      const isHigh = activeTool === 'highlight';
      const isUnder = activeTool === 'underline';
      const isStrike = activeTool === 'strikeout';

      const newDrawing: DrawingPath = {
        id: `draw_${Date.now()}`,
        points: currentPath,
        color: selectedColor,
        size: isHigh ? 22 : isUnder || isStrike ? 3 : strokeSize,
        opacity: isHigh ? 0.35 : 1,
        tool: activeTool as any,
      };

      onUpdateAnnotations({
        ...annotations,
        drawings: [...(annotations.drawings || []), newDrawing],
      });
    }

    // Salva forma geométrica
    if (currentShapePreview && startPoint) {
      const dist = Math.hypot(
        currentShapePreview.endX - currentShapePreview.startX,
        currentShapePreview.endY - currentShapePreview.startY
      );
      if (dist > 0.01) {
        const newShape: ShapeAnnotation = {
          id: `shape_${Date.now()}`,
          type: activeTool as any,
          startX: currentShapePreview.startX,
          startY: currentShapePreview.startY,
          endX: currentShapePreview.endX,
          endY: currentShapePreview.endY,
          color: selectedColor,
          strokeWidth: strokeSize,
          opacity: 1,
        };

        onUpdateAnnotations({
          ...annotations,
          shapes: [...(annotations.shapes || []), newShape],
        });
      }
    }

    setCurrentPath([]);
    setStartPoint(null);
    setCurrentShapePreview(null);
  };

  // Funções de remoção
  const handleDeleteText = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      texts: (annotations.texts || []).filter((t) => t.id !== id),
    });
    if (editingTextId === id) setEditingTextId(null);
  };

  const handleSaveText = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      texts: (annotations.texts || []).map((t) => (t.id === id ? { ...t, text: tempTextValue } : t)),
    });
    setEditingTextId(null);
  };

  const handleDeleteSticky = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      stickyNotes: (annotations.stickyNotes || []).filter((n) => n.id !== id),
    });
    if (openStickyNoteId === id) setOpenStickyNoteId(null);
  };

  const handleUpdateStickyText = (id: string, text: string) => {
    onUpdateAnnotations({
      ...annotations,
      stickyNotes: (annotations.stickyNotes || []).map((n) => (n.id === id ? { ...n, text } : n)),
    });
  };

  const handleDeleteShape = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      shapes: (annotations.shapes || []).filter((s) => s.id !== id),
    });
  };

  const handleDeleteStamp = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      stamps: (annotations.stamps || []).filter((s) => s.id !== id),
    });
  };

  const handleDeleteSignature = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      signatures: (annotations.signatures || []).filter((s) => s.id !== id),
    });
  };

  const handleDeleteFormMark = (id: string) => {
    onUpdateAnnotations({
      ...annotations,
      formMarks: (annotations.formMarks || []).filter((m) => m.id !== id),
    });
  };

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
        activeTool === 'pan'
          ? 'cursor-grab active:cursor-grabbing'
          : activeTool === 'select'
          ? 'cursor-default'
          : activeTool === 'draw' || activeTool === 'highlight'
          ? 'cursor-crosshair'
          : activeTool === 'text'
          ? 'cursor-text'
          : 'cursor-pointer'
      }`}
    >
      {/* Camada SVG para Desenhos, Destaques e Formas */}
      <svg className="w-full h-full pointer-events-none">
        {/* Desenhos Salvos */}
        {(annotations.drawings || []).map((draw) => (
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

        {/* Formas Geométricas Salvas */}
        {(annotations.shapes || []).map((s) => {
          const x1 = s.startX * width;
          const y1 = s.startY * height;
          const x2 = s.endX * width;
          const y2 = s.endY * height;

          if (s.type === 'rectangle') {
            const rx = Math.min(x1, x2);
            const ry = Math.min(y1, y2);
            const rw = Math.abs(x2 - x1);
            const rh = Math.abs(y2 - y1);
            return (
              <rect
                key={s.id}
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                stroke={s.color}
                strokeWidth={s.strokeWidth}
                fill="none"
                rx={4}
              />
            );
          } else if (s.type === 'circle') {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;
            return (
              <ellipse
                key={s.id}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                stroke={s.color}
                strokeWidth={s.strokeWidth}
                fill="none"
              />
            );
          } else if (s.type === 'line' || s.type === 'arrow') {
            return (
              <line
                key={s.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={s.color}
                strokeWidth={s.strokeWidth}
                strokeLinecap="round"
              />
            );
          }
          return null;
        })}

        {/* Desenho sendo traçado no momento */}
        {isInteracting && currentPath.length > 1 && (
          <path
            d={pointsToSvgPath(currentPath)}
            stroke={selectedColor}
            strokeWidth={activeTool === 'highlight' ? 22 : strokeSize}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={activeTool === 'highlight' ? 0.35 : 1}
          />
        )}

        {/* Pré-visualização da Forma Geométrica */}
        {isInteracting && currentShapePreview && (
          <rect
            x={Math.min(currentShapePreview.startX * width, currentShapePreview.endX * width)}
            y={Math.min(currentShapePreview.startY * height, currentShapePreview.endY * height)}
            width={Math.abs(currentShapePreview.endX * width - currentShapePreview.startX * width)}
            height={Math.abs(currentShapePreview.endY * height - currentShapePreview.startY * height)}
            stroke={selectedColor}
            strokeWidth={strokeSize}
            strokeDasharray="4 4"
            fill="none"
          />
        )}
      </svg>

      {/* Camada de Textos */}
      {(annotations.texts || []).map((item) => {
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
                  className="bg-brand-dark px-2.5 py-1 text-xs text-white rounded-lg border border-brand-cardBorder outline-none font-sans min-w-[150px]"
                />
                <button
                  onClick={() => handleSaveText(item.id)}
                  className="p-1 rounded-lg bg-amber-500 text-black hover:opacity-90"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => handleDeleteText(item.id)}
                  className="p-1 rounded-lg bg-brand-rose text-white hover:opacity-90"
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
                className="cursor-pointer px-2 py-0.5 rounded-lg border border-transparent hover:border-amber-500/50 hover:bg-brand-panel/90 transition-all flex items-center gap-1.5"
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

      {/* Camada de Notas Adesivas (Sticky Notes do Acrobat) */}
      {(annotations.stickyNotes || []).map((note) => {
        const left = note.x * width;
        const top = note.y * height;
        const isOpen = openStickyNoteId === note.id;

        return (
          <div
            key={note.id}
            style={{ left: `${left}px`, top: `${top}px` }}
            onClick={(e) => e.stopPropagation()}
            className="absolute z-30"
          >
            {/* Ícone Balãozinho estilo Acrobat */}
            <button
              onClick={() => setOpenStickyNoteId(isOpen ? null : note.id)}
              className="w-7 h-7 rounded-xl bg-amber-500 text-black flex items-center justify-center shadow-goldGlow hover:scale-110 transition-transform -translate-x-1/2 -translate-y-1/2"
            >
              <MessageSquare size={15} />
            </button>

            {/* Popover da Nota do Revisor */}
            {isOpen && (
              <div className="absolute left-4 top-4 w-64 bg-brand-panel border border-brand-cardBorder rounded-2xl p-3 shadow-goldGlowLg backdrop-blur-xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-brand-cardBorder mb-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <span>{note.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteSticky(note.id)}
                      title="Excluir nota"
                      className="text-brand-rose p-1 rounded hover:bg-brand-rose/20"
                    >
                      <Trash2 size={12} />
                    </button>
                    <button
                      onClick={() => setOpenStickyNoteId(null)}
                      className="text-brand-muted hover:text-white p-1"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={note.text}
                  onChange={(e) => handleUpdateStickyText(note.id, e.target.value)}
                  placeholder="Escreva sua observação técnica..."
                  className="w-full bg-brand-dark border border-brand-cardBorder rounded-xl p-2 text-xs text-white outline-none focus:border-amber-500 font-sans resize-none"
                />

                <div className="flex items-center justify-between pt-2 text-[10px] text-brand-mutedGold">
                  <span>{note.createdAt}</span>
                  <span className="text-amber-400 font-semibold">Salvo auto</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Camada de Carimbos Oficiais */}
      {(annotations.stamps || []).map((stamp) => {
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
              className="px-3.5 py-1.5 rounded-xl border-2 font-black tracking-widest text-xs flex items-center gap-1.5 shadow-goldGlow backdrop-blur-md"
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

      {/* Camada de Assinaturas Manuscritas */}
      {(annotations.signatures || []).map((sig) => {
        const left = sig.x * width;
        const top = sig.y * height;

        return (
          <div
            key={sig.id}
            style={{ left: `${left}px`, top: `${top}px`, width: `${sig.width}px` }}
            onClick={(e) => e.stopPropagation()}
            className="absolute group z-20 cursor-move -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative p-1 rounded-xl border border-transparent group-hover:border-amber-500/50 bg-white/5 backdrop-blur-sm transition-all">
              <img src={sig.dataUrl} alt="Assinatura" className="w-full h-auto pointer-events-none drop-shadow" />
              <button
                onClick={() => handleDeleteSignature(sig.id)}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-brand-panel border border-brand-rose text-brand-rose p-1 rounded-full shadow-md"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Camada de Preenchimento (Checkmark, Cross, Dot) */}
      {(annotations.formMarks || []).map((mark) => {
        const left = mark.x * width;
        const top = mark.y * height;

        return (
          <div
            key={mark.id}
            style={{ left: `${left}px`, top: `${top}px` }}
            onClick={(e) => e.stopPropagation()}
            className="absolute group z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          >
            <div className="flex items-center gap-1">
              {mark.type === 'check' && (
                <Check size={mark.size} style={{ color: mark.color }} strokeWidth={3} />
              )}
              {mark.type === 'cross' && (
                <X size={mark.size} style={{ color: mark.color }} strokeWidth={3} />
              )}
              {mark.type === 'dot' && (
                <div
                  className="rounded-full"
                  style={{
                    backgroundColor: mark.color,
                    width: `${mark.size - 6}px`,
                    height: `${mark.size - 6}px`,
                  }}
                />
              )}
              <button
                onClick={() => handleDeleteFormMark(mark.id)}
                className="opacity-0 group-hover:opacity-100 text-brand-rose p-0.5 rounded hover:bg-brand-rose/20"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
