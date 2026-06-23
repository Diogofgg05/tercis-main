import type { Budget, BudgetItem, CalculatedItem } from './types';
import { calcItem, grandTotal } from './calc';

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const STATUS_LABELS: Record<string, string> = {
  rascunho:'Rascunho',enviado:'Enviado',aprovado:'Aprovado',
  rejeitado:'Rejeitado',em_execucao:'Em Execução',concluido:'Concluído',
};

export function exportToPDF(budget: Budget): void {
  const items: CalculatedItem[] = (budget.items ?? []).map(calcItem);
  const total = grandTotal(items);
  const taxAmount = budget.include_tax ? total * (budget.tax_rate / 100) : 0;
  const totalWithTax = total + taxAmount;
  const dateStr = new Date(budget.date).toLocaleDateString('pt-PT');
  const validStr = new Date(budget.valid_until).toLocaleDateString('pt-PT');
  const companyName = (budget.company as any)?.name ?? '';

  const rows = items.map((item, i) => `
    <tr class="${i % 2 === 0 ? '' : 'alt'}">
      <td class="code">${esc(item.code)}</td>
      <td>${esc(item.description)}</td>
      <td class="sm">${esc(item.reference)}</td>
      <td class="sm">${esc(item.brand)}</td>
      <td class="r">${item.quantity}</td>
      <td class="r">${item.unit_cost.toLocaleString('pt-PT', {minimumFractionDigits:2})} €</td>
      <td class="r">${item.margin.toFixed(1)}%</td>
      <td class="r">${item.pvp.toLocaleString('pt-PT', {minimumFractionDigits:2})} €</td>
      <td class="r">${item.discount.toFixed(1)}%</td>
      <td class="r">${item.finalPrice.toLocaleString('pt-PT', {minimumFractionDigits:2})} €</td>
      <td class="r bold">${item.subtotal.toLocaleString('pt-PT', {minimumFractionDigits:2})} €</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8">
<title>${esc(budget.ref)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:10px;color:#1e293b;background:#fff;padding:28px 32px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;padding-bottom:16px;border-bottom:2.5px solid #1e40af}
.brand h1{font-size:20px;font-weight:900;color:#1e40af;letter-spacing:-0.5px}
.brand p{font-size:9px;color:#94a3b8;margin-top:2px}
.meta{text-align:right}
.meta .ref{font-size:16px;font-weight:800;color:#0f172a}
.meta p{font-size:9px;color:#64748b;margin-top:2px}
.pill{display:inline-block;background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:999px;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:3px}
.info{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px}
.ib{background:#f8fafc;border:1px solid #e2e8f0;border-radius:5px;padding:7px 10px}
.ib label{font-size:7.5px;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;display:block;margin-bottom:2px}
.ib span{font-size:11px;font-weight:600;color:#1e293b}
table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:9px}
thead th{background:#1e293b;color:#fff;padding:6px 5px;text-align:left;font-size:8px;text-transform:uppercase;letter-spacing:.5px}
th.r,td.r{text-align:right}
td{padding:5px 5px;border-bottom:1px solid #f1f5f9;color:#334155;vertical-align:middle}
tr.alt td{background:#f8fafc}
td.code{font-family:monospace;font-weight:700;color:#1d4ed8}
td.sm{color:#64748b;font-size:8.5px}
td.bold{font-weight:700;color:#0f172a}
.tot{display:flex;justify-content:flex-end;margin-bottom:16px}
.tot table{width:240px;border-collapse:collapse}
.tot td{padding:4px 8px;font-size:10px}
.tot .l{color:#64748b}.tot .v{text-align:right;font-weight:600}
.tot .fin td{background:#1e40af;color:#fff;padding:7px 8px;font-size:12px;font-weight:800}
.tot .fin .v{color:#fff}
.foot{text-align:center;font-size:8px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:10px}
@media print{body{padding:0}}
</style></head><body>
<div class="hdr">
  <div class="brand"><h1>ORÇAMENTO</h1><p>QuadroElétrico — Gestão de Orçamentos</p></div>
  <div class="meta"><div class="ref">${esc(budget.ref)}</div>
  <p>Data: <strong>${dateStr}</strong> &bull; Válido até: <strong>${validStr}</strong></p>
  <span class="pill">${esc(STATUS_LABELS[budget.status] ?? budget.status)}</span>
  ${budget.sector ? `<p style="margin-top:3px;font-size:9px;color:#64748b">${esc(budget.sector)}</p>` : ''}
  </div>
</div>
<div class="info">
  <div class="ib"><label>Designação</label><span>${esc(budget.name)}</span></div>
  <div class="ib"><label>Cliente</label><span>${esc(companyName || '—')}</span></div>
  <div class="ib"><label>Contacto</label><span>${esc(budget.client_contact || budget.client_email || '—')}</span></div>
</div>
${budget.notes ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:5px;padding:8px 12px;margin-bottom:14px;font-size:9.5px;color:#78350f">${esc(budget.notes)}</div>` : ''}
<table>
<thead><tr>
  <th>Cód.</th><th>Descrição</th><th>Referência</th><th>Marca</th>
  <th class="r">Qtd</th><th class="r">Custo Un.</th><th class="r">Margem</th>
  <th class="r">PVP</th><th class="r">Desc.</th><th class="r">Pr.Final</th><th class="r">Subtotal</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>
<div class="tot"><table>
  <tr><td class="l">Subtotal</td><td class="v">${total.toLocaleString('pt-PT',{minimumFractionDigits:2})} €</td></tr>
  ${budget.include_tax ? `<tr><td class="l">IVA ${budget.tax_rate}%</td><td class="v">${taxAmount.toLocaleString('pt-PT',{minimumFractionDigits:2})} €</td></tr>` : ''}
  <tr class="fin"><td class="l">TOTAL${budget.include_tax?' c/ IVA':''}</td><td class="v">${totalWithTax.toLocaleString('pt-PT',{minimumFractionDigits:2})} €</td></tr>
</table></div>
<div class="foot">Gerado em ${new Date().toLocaleString('pt-PT')} &bull; Válido 30 dias &bull; Não constitui fatura</div>
</body></html>`;

  const win = window.open('','_blank');
  if(!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(()=>win.print(),500);
}
