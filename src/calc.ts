import type { BudgetItem, CalculatedItem, Budget } from './types';

type PricedItem = BudgetItem | CalculatedItem;

export function calcItem(item: BudgetItem): CalculatedItem {
  const pvp = item.unit_cost * (1 + item.margin / 100);
  const finalPrice = pvp * (1 - item.discount / 100);
  const subtotal = finalPrice * item.quantity;
  return { ...item, pvp, finalPrice, subtotal };
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
