'use client';

import React from 'react';
import { Stamp, CheckCircle2, AlertTriangle, Clock, ShieldCheck, Bookmark, Crown } from 'lucide-react';

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
    color: '#f59e0b',
    icon: <CheckCircle2 size={16} className="text-amber-400" />,
  },
  {
    type: 'MEDIDO GPR',
    label: 'MEDIDO GPR',
    color: '#f97316',
    icon: <Bookmark size={16} className="text-orange-400" />,
  },
  {
    type: 'CONFERIDO',
    label: 'CONFERIDO',
    color: '#eab308',
    icon: <ShieldCheck size={16} className="text-yellow-400" />,
  },
  {
    type: 'EM ANÁLISE',
    label: 'EM ANÁLISE',
    color: '#d97706',
    icon: <Clock size={16} className="text-amber-500" />,
  },
  {
    type: 'URGENTE',
    label: 'URGENTE',
    color: '#ef4444',
    icon: <AlertTriangle size={16} className="text-rose-400" />,
  },
];

interface StampPickerProps {
  onSelectStamp: (type: StampOption['type'], color: string) => void;
  onClose: () => void;
}

export const StampPicker: React.FC<StampPickerProps> = ({ onSelectStamp, onClose }) => {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-brand-panel border border-brand-cardBorder rounded-2xl p-4 shadow-goldGlowLg w-80 backdrop-blur-xl animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between pb-3 border-b border-brand-cardBorder mb-3">
        <div className="flex items-center gap-2">
          <Crown size={16} className="text-amber-400" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Carimbos Oficiais
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-brand-mutedGold hover:text-white px-2 py-0.5 rounded-lg bg-brand-card border border-brand-cardBorder"
        >
          Fechar
        </button>
      </div>

      <p className="text-[11px] text-brand-muted mb-3 font-medium">
        Escolha o carimbo desejado e clique na página para aplicar:
      </p>

      <div className="space-y-2">
        {STAMPS.map((stamp) => (
          <button
            key={stamp.type}
            onClick={() => {
              onSelectStamp(stamp.type, stamp.color);
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-brand-cardBorder bg-brand-card/60 hover:bg-brand-card hover:border-amber-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-2.5">
              {stamp.icon}
              <span
                className="font-extrabold text-xs tracking-wider px-2.5 py-0.5 rounded-lg border shadow-sm"
                style={{
                  color: stamp.color,
                  borderColor: `${stamp.color}50`,
                  backgroundColor: `${stamp.color}15`,
                }}
              >
                {stamp.label}
              </span>
            </div>
            <span className="text-[10px] text-brand-mutedGold group-hover:text-amber-400 font-semibold">
              Aplicar ➔
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
