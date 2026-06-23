import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CatalogItem } from '../types';

interface ComponentSelectProps {
  options: CatalogItem[];
  value: CatalogItem | null;
  onChange: (item: CatalogItem) => void;
  sectorFilter?: string;
}

export function ComponentSelect({
  options,
  value,
  onChange,
  sectorFilter,
}: ComponentSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let items = options;

    if (sectorFilter) {
      const matchingOutside = options.filter(
        (item) =>
          item.code.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.brand?.toLowerCase().includes(search.toLowerCase()) ||
          item.reference?.toLowerCase().includes(search.toLowerCase()) ||
          item.category?.toLowerCase().includes(search.toLowerCase())
      );

      items = items.filter((item) => item.sector === sectorFilter);
      if (search && matchingOutside.length > 0) {
        items = matchingOutside;
      }
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.code.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.brand?.toLowerCase().includes(search.toLowerCase()) ||
          item.reference?.toLowerCase().includes(search.toLowerCase()) ||
          item.category?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return items;
  }, [options, search, sectorFilter]);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
      >
        <span className="text-sm">
          {value ? `${value.code} - ${value.description}` : 'Selecione um item...'}
        </span>
        <ChevronDown size={16} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg z-50">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border-b border-gray-200 dark:border-slate-700 text-sm focus:outline-none dark:bg-slate-800 dark:text-white"
          />

          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                Nenhum item encontrado
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded font-mono text-xs font-semibold">
                      {item.code}
                    </span>
                    <span className="text-sm font-medium dark:text-white">
                      {item.description}
                    </span>
                    {item.brand && (
                      <span className="inline-block bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs">
                        {item.brand}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.reference && <span>{item.reference}</span>}
                    <span>€{item.unit_cost.toFixed(2)}</span>
                    <span className="inline-block bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-1.5 rounded">
                      {item.sector}
                    </span>
                    {item.category && <span className="text-xs">{item.category}</span>}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900">
            {filtered.length} items
          </div>
        </div>
      )}
    </div>
  );
}
