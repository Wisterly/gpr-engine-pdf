'use client';

import React from 'react';
import { Stamp, CheckCircle2, AlertTriangle, Clock, ShieldCheck, Bookmark } from 'lucide-react';

interface StampOption {
  type: 'APROVADO' | 'CONFERIDO' | 'URGENTE' | 'MEDIDO GPR' | 'EM ANÁLISE';
  label: string;
  color: string;
  icon: React.ReactNode;
}

const STAMPS: StampOption[] = [
  {
    type: 'APROVADO',
    label: 'APROVADO',
    color: '#10b981',
    icon: <CheckCircle2 size={16} className="text-emerald-400" />,
  },
  {
    type: 'CONFERIDO',
    label: 'CONFERIDO',
    color: '#3b82f6',
    icon: <ShieldCheck size={16} className="text-blue-400" />,
  },
  {
    type: 'MEDIDO GPR',
    label: 'MEDIDO GPR',
    color: '#06b6d4',
    icon: <Bookmark size={16} className="text-cyan-400" />,
  },
  {
    type: 'EM ANÁLISE',
    label: 'EM ANÁLISE',
    color: '#f59e0b',
    icon: <Clock size={16} className="text-amber-400" />,
  },
  {
    type: 'URGENTE',
    label: 'URGENTE',
    color: '#f43f5e',
    icon: <AlertTriangle size={16} className="text-rose-400" />,
  },
];

interface StampPickerProps {
  onSelectStamp: (type: StampOption['type'], color: string) => void;
  onClose: () => void;
}

export const StampPicker: React.FC<StampPickerProps> = ({ onSelectStamp, onClose }) => {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-brand-panel border border-brand-cardBorder rounded-2xl p-4 shadow-glass w-80 backdrop-blur animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between pb-3 border-b border-brand-cardBorder mb-3">
        <div className="flex items-center gap-2">
          <Stamp size={16} className="text-brand-accent" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Escolha um Carimbo
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-brand-muted hover:text-white px-2 py-0.5 rounded bg-brand-card"
        >
          Fechar
        </button>
      </div>

      <p className="text-[11px] text-brand-muted mb-3">
        Selecione um carimbo e clique em qualquer área do documento para aplicar:
      </p>

      <div className="space-y-2">
        {STAMPS.map((stamp) => (
          <button
            key={stamp.type}
            onClick={() => {
              onSelectStamp(stamp.type, stamp.color);
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-brand-cardBorder/70 bg-brand-card/50 hover:bg-brand-card transition-all text-left group"
          >
            <div className="flex items-center gap-2.5">
              {stamp.icon}
              <span
                className="font-bold text-xs tracking-wider px-2 py-0.5 rounded border"
                style={{
                  color: stamp.color,
                  borderColor: `${stamp.color}40`,
                  backgroundColor: `${stamp.color}15`,
                }}
              >
                {stamp.label}
              </span>
            </div>
            <span className="text-[10px] text-brand-muted group-hover:text-white">Aplicar ➔</span>
          </button>
        ))}
      </div>
    </div>
  );
};
