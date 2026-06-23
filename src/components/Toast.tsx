import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Props {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const CFG = {
  success: { icon: <CheckCircle2 size={16} />, base: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  error: { icon: <XCircle size={16} />, base: 'bg-red-50 border-red-200 text-red-800' },
  info: { icon: <Info size={16} />, base: 'bg-blue-50 border-blue-200 text-blue-800' },
};

export function Toast({ message, type, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const cfg = CFG[type];
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-sm animate-slide-up ${cfg.base}`}>
      {cfg.icon}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onDismiss} className="ml-2 opacity-50 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}
