import type { BudgetItem, CalculatedItem, Budget } from './types';

type PricedItem = BudgetItem | CalculatedItem;

function money(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calcItem(item: BudgetItem): CalculatedItem {
  const unitCost = Number.isFinite(item.unit_cost) ? Math.max(0, item.unit_cost) : 0;
  const margin = Number.isFinite(item.margin) ? Math.max(0, item.margin) : 0;
  const discount = Number.isFinite(item.discount) ? Math.min(100, Math.max(0, item.discount)) : 0;
  const quantity = Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0;
  const pvp = money(unitCost * (1 + margin / 100));
  const finalPrice = money(pvp * (1 - discount / 100));
  const subtotal = money(finalPrice * quantity);
  return { ...item, quantity, margin, discount, pvp, finalPrice, subtotal };
}

export function grandTotal(items: PricedItem[]): number {
  return items.reduce((sum, item) => {
    if ('subtotal' in item) return sum + item.subtotal;
    return sum + calcItem(item).subtotal;
  }, 0);
}

export function totalWithTax(budget: Budget, items: PricedItem[]): number {
  const base = grandTotal(items);
  return budget.include_tax ? base * (1 + budget.tax_rate / 100) : base;
}

export function avgMargin(items: BudgetItem[]): number {
  if (items.length === 0) return 0;
  return items.reduce((s, i) => s + i.margin, 0) / items.length;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}

export function formatPercent(value: number, digits = 1): string {
  return value.toFixed(digits) + '%';
}
