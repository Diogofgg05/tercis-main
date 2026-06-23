import React from 'react';
import { FolderOpen, Trash2, Calendar, User } from 'lucide-react';
import type { Budget } from '../types';

interface Props {
  budgets: Budget[];
  onLoad: (b: Budget) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function BudgetList({ budgets, onLoad, onDelete, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FolderOpen size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Orçamentos Guardados</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-light leading-none"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {budgets.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>Nenhum orçamento guardado</p>
            </div>
          ) : (
            budgets
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/40 transition-all group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate">{b.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {b.company?.name || '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(b.date).toLocaleDateString('pt-PT')}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {b.items?.length ?? 0} {(b.items?.length ?? 0) === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => { onLoad(b); onClose(); }}
                      className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Carregar
                    </button>
                    <button
                      onClick={() => onDelete(b.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
