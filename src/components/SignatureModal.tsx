'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw, PenTool, Type, Sparkles } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
}) => {
  const [tab, setTab] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [fontStyle, setFontStyle] = useState<'cursive' | 'italic'>('cursive');
  const [penColor, setPenColor] = useState('#f59e0b'); // Dourado padrão ou preto
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (!isOpen || tab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen, tab, penColor]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        alert('Por favor, faça sua assinatura antes de salvar.');
        return;
      }
      onSaveSignature(canvas.toDataURL('image/png'));
      onClose();
    } else {
      if (!typedName.trim()) {
        alert('Por favor, digite seu nome.');
        return;
      }
      // Renderiza o texto tipografado num canvas temporário para gerar PNG
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 120;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = penColor;
        ctx.font = 'italic bold 36px "Brush Script MT", cursive, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(typedName, 200, 60);
        onSaveSignature(tempCanvas.toDataURL('image/png'));
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="max-w-lg w-full bg-brand-panel border border-brand-cardBorder rounded-3xl p-6 shadow-goldGlowLg select-none">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-cardBorder mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <PenTool size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Preencher & Assinar
              </h3>
              <p className="text-[11px] text-brand-mutedGold">
                Crie sua assinatura digital oficial no estilo Adobe Acrobat Pro
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-brand-muted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Abas: Desenhar ou Digitar */}
        <div className="flex items-center gap-2 mb-4 bg-brand-dark p-1 rounded-2xl border border-brand-cardBorder">
          <button
            onClick={() => setTab('draw')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'draw'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-goldGlow'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            <PenTool size={14} />
            <span>Desenhar com Caneta</span>
          </button>
          <button
            onClick={() => setTab('type')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'type'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-goldGlow'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            <Type size={14} />
            <span>Digitar Nome</span>
          </button>
        </div>

        {/* Seletor de Cores da Tinta */}
        <div className="flex items-center justify-between mb-3 px-1 text-xs text-brand-muted">
          <span>Cor da Tinta:</span>
          <div className="flex items-center gap-2">
            {[
              { label: 'Dourado Real', value: '#f59e0b' },
              { label: 'Preto Puro', value: '#111111' },
              { label: 'Azul Caneta', value: '#1d4ed8' },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => setPenColor(c.value)}
                title={c.label}
                className={`w-5 h-5 rounded-full border transition-all ${
                  penColor === c.value
                    ? 'scale-125 border-white ring-2 ring-amber-500'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>

        {/* Área de Criação */}
        {tab === 'draw' ? (
          <div className="relative border-2 border-dashed border-brand-cardBorder rounded-2xl bg-white overflow-hidden shadow-inner mb-4">
            <canvas
              ref={canvasRef}
              width={460}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-40 cursor-crosshair block"
            />
            <div className="absolute bottom-2 left-4 text-[10px] text-gray-400 pointer-events-none select-none">
              Assine na linha acima
            </div>
            <button
              onClick={clearCanvas}
              title="Limpar assinatura"
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Digite seu nome completo..."
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full bg-brand-dark border border-brand-cardBorder rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500"
            />
            <div className="p-4 bg-white rounded-2xl flex items-center justify-center min-h-[100px] border border-black/20 shadow-inner">
              <span
                style={{ color: penColor }}
                className="text-3xl italic font-serif select-none"
              >
                {typedName || 'Sua Assinatura'}
              </span>
            </div>
          </div>
        )}

        {/* Rodapé com Ações */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-cardBorder">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-card hover:bg-brand-cardBorder text-brand-muted hover:text-white text-xs font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black text-xs font-black shadow-goldGlow hover:shadow-goldGlowLg transition-all"
          >
            <Check size={14} />
            <span>Aplicar Assinatura no Documento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
