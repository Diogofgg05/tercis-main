import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import type { CalculatedItem } from '../types';
import { formatCurrency } from '../calc';

interface Props {
  items: CalculatedItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: 'quantity' | 'margin' | 'discount' | 'notes', value: number | string) => void;
  readOnly?: boolean;
}

function NumInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  width = 'w-16',
  suffix,
  disabled = false,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: string;
  suffix?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onFocus={(e) => !disabled && e.target.select()}
        onChange={(e) => {
          const v = step === 1 ? parseInt(e.target.value, 10) : parseFloat(e.target.value);
          if (!isNaN(v) && v >= (min ?? -Infinity) && v <= (max ?? Infinity)) onChange(v);
        }}
        className={`${width} text-center border border-slate-200 rounded-lg px-1 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
      />
      {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
    </div>
  );
}

export function ItemsTable({ items, onRemove, onUpdate, readOnly = false }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <GripVertical size={24} className="opacity-50" />
        </div>
        <p className="font-semibold text-slate-500 text-sm">Nenhum item adicionado</p>
        <p className="text-xs mt-1 text-slate-400">Selecione um componente acima e clique em "Adicionar"</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-800">
            {[
              { label: '#', cls: 'w-8 text-center' },
              { label: 'Código', cls: '' },
              { label: 'Descrição', cls: '' },
              { label: 'Ref.', cls: 'hidden lg:table-cell' },
              { label: 'Marca', cls: 'hidden md:table-cell' },
              { label: 'Un.', cls: 'hidden xl:table-cell text-center' },
              { label: 'Qtd.', cls: 'text-right' },
              { label: 'Custo Un.', cls: 'text-right' },
              { label: 'Margem%', cls: 'text-right' },
              { label: 'PVP', cls: 'text-right' },
              { label: 'Desc.%', cls: 'text-right' },
              { label: 'Pr.Final', cls: 'text-right' },
              { label: 'Subtotal', cls: 'text-right font-bold' },
              { label: 'Notas', cls: 'hidden xl:table-cell' },
              ...(readOnly ? [] : [{ label: '', cls: 'w-8' }]),
            ].map((h) => (
              <th
                key={h.label}
                className={`px-3 py-3 text-left font-semibold text-[10px] uppercase tracking-wider text-slate-300 whitespace-nowrap ${h.cls}`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={item.id}
              className={`border-b border-slate-100 transition-colors ${
                i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              } hover:bg-blue-50/40`}
            >
              <td className="px-3 py-2.5 text-center text-slate-400 font-mono text-[10px]">{i + 1}</td>
              <td className="px-3 py-2.5">
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                  {item.code}
                </span>
              </td>
              <td className="px-3 py-2.5 max-w-[200px]">
                <span className="truncate block font-medium text-slate-700" title={item.description}>
                  {item.description}
                </span>
              </td>
              <td className="px-3 py-2.5 text-slate-500 hidden lg:table-cell whitespace-nowrap text-[10px]">
                {item.reference}
              </td>
              <td className="px-3 py-2.5 hidden md:table-cell">
                <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full text-[10px]">
                  {item.brand}
                </span>
              </td>
              <td className="px-3 py-2.5 hidden xl:table-cell text-slate-400 text-[10px] text-center">
                {item.unit}
              </td>
              <td className="px-3 py-2.5 text-right">
                <NumInput
                  value={item.quantity}
                  onChange={(v) => onUpdate(item.id, 'quantity', v)}
                  min={1}
                  step={1}
                  width="w-14"
                  disabled={readOnly}
                />
              </td>
              <td className="px-3 py-2.5 text-right text-slate-600 font-medium whitespace-nowrap">
                {formatCurrency(item.unit_cost)}
              </td>
              <td className="px-3 py-2.5 text-right">
                <NumInput
                  value={item.margin}
                  onChange={(v) => onUpdate(item.id, 'margin', v)}
                  min={0}
                  step={0.5}
                  suffix="%"
                  width="w-14"
                  disabled={readOnly}
                />
              </td>
              <td className="px-3 py-2.5 text-right text-slate-700 font-medium whitespace-nowrap">
                {formatCurrency(item.pvp)}
              </td>
              <td className="px-3 py-2.5 text-right">
                <NumInput
                  value={item.discount}
                  onChange={(v) => onUpdate(item.id, 'discount', v)}
                  min={0}
                  max={100}
                  step={0.5}
                  suffix="%"
                  width="w-14"
                  disabled={readOnly}
                />
              </td>
              <td className="px-3 py-2.5 text-right text-slate-700 whitespace-nowrap">
                {formatCurrency(item.finalPrice)}
              </td>
              <td className="px-3 py-2.5 text-right whitespace-nowrap">
                <span className="font-bold text-slate-900">{formatCurrency(item.subtotal)}</span>
              </td>
              <td className="px-3 py-2.5 hidden xl:table-cell">
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => onUpdate(item.id, 'notes', e.target.value)}
                  placeholder="Notas..."
                  disabled={readOnly}
                  className="w-full border-0 bg-transparent text-slate-500 text-xs placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border focus:border-slate-200 focus:rounded px-1 disabled:cursor-not-allowed"
                />
              </td>
              {!readOnly && (
                <td className="px-3 py-2.5 text-center">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
