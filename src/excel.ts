import type { Budget, CalculatedItem } from './types';
import { calcItem, grandTotal } from './calc';

function cell(v: string | number, t: 'String'|'Number' = 'String') {
  return `<Cell><Data ss:Type="${t}">${String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</Data></Cell>`;
}
function hdr(v: string) { return `<Cell ss:StyleID="h"><Data ss:Type="String">${v.replace(/&/g,'&amp;')}</Data></Cell>`; }
function ttl(v: string|number, t: 'String'|'Number'='String') { return `<Cell ss:StyleID="t"><Data ss:Type="${t}">${String(v).replace(/&/g,'&amp;')}</Data></Cell>`; }
function lbl(v: string) { return `<Cell ss:StyleID="l"><Data ss:Type="String">${v.replace(/&/g,'&amp;')}</Data></Cell>`; }

export function exportToExcel(budget: Budget): void {
  const items: CalculatedItem[] = (budget.items ?? []).map(calcItem);
  const total = grandTotal(items);
  const taxAmt = budget.include_tax ? total * (budget.tax_rate / 100) : 0;
  const totalFinal = total + taxAmt;
  const dateStr = new Date(budget.date).toLocaleDateString('pt-PT');
  const validStr = new Date(budget.valid_until).toLocaleDateString('pt-PT');
  const companyName = (budget.company as any)?.name ?? '';

  const dataRows = items.map((item, i) => `
    <Row>
      ${cell(i + 1, 'Number')}${cell(item.code)}${cell(item.description)}${cell(item.reference)}
      ${cell(item.brand)}${cell(item.category)}${cell(item.sector)}${cell(item.unit)}
      ${cell(item.quantity,'Number')}${cell(parseFloat(item.unit_cost.toFixed(4)),'Number')}
      ${cell(parseFloat(item.margin.toFixed(2)),'Number')}${cell(parseFloat(item.pvp.toFixed(4)),'Number')}
      ${cell(parseFloat(item.discount.toFixed(2)),'Number')}${cell(parseFloat(item.finalPrice.toFixed(4)),'Number')}
      ${cell(parseFloat(item.subtotal.toFixed(2)),'Number')}${cell(item.notes||'')}
    </Row>`).join('');

  const catMap = new Map<string, number>();
  items.forEach(i => catMap.set(i.sector, (catMap.get(i.sector)??0)+i.subtotal));
  const catRows = Array.from(catMap.entries()).map(([cat,v]) => `<Row>${cell(cat)}${cell(parseFloat(v.toFixed(2)),'Number')}</Row>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
  <Style ss:ID="h"><Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="10"/><Interior ss:Color="#1E293B" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/></Style>
  <Style ss:ID="t"><Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/><Interior ss:Color="#1E40AF" ss:Pattern="Solid"/></Style>
  <Style ss:ID="l"><Font ss:Bold="1" ss:Color="#64748B"/></Style>
  <Style ss:ID="ti"><Font ss:Bold="1" ss:Size="16" ss:Color="#1E40AF"/></Style>
</Styles>
<Worksheet ss:Name="Orçamento">
<Table>
  <Column ss:Width="40"/><Column ss:Width="70"/><Column ss:Width="200"/><Column ss:Width="130"/>
  <Column ss:Width="110"/><Column ss:Width="95"/><Column ss:Width="110"/><Column ss:Width="40"/>
  <Column ss:Width="50"/><Column ss:Width="80"/><Column ss:Width="60"/><Column ss:Width="80"/>
  <Column ss:Width="60"/><Column ss:Width="80"/><Column ss:Width="90"/><Column ss:Width="160"/>
  <Row ss:Height="28"><Cell ss:StyleID="ti"><Data ss:Type="String">ORÇAMENTO ${budget.ref}</Data></Cell></Row>
  <Row>${lbl('Designação:')}${cell(budget.name)}</Row>
  <Row>${lbl('Cliente:')}${cell(companyName||'—')}</Row>
  <Row>${lbl('Setor:')}${cell(budget.sector||'—')}</Row>
  <Row>${lbl('Data:')}${cell(dateStr)}</Row>
  <Row>${lbl('Válido até:')}${cell(validStr)}</Row>
  ${budget.client_contact?`<Row>${lbl('Contacto:')}${cell(budget.client_contact)}</Row>`:''}
  ${budget.notes?`<Row>${lbl('Observações:')}${cell(budget.notes)}</Row>`:''}
  <Row/>
  <Row ss:Height="20">
    ${hdr('#')}${hdr('Código')}${hdr('Descrição')}${hdr('Referência')}${hdr('Marca')}
    ${hdr('Categoria')}${hdr('Setor')}${hdr('Un.')}${hdr('Qtd.')}${hdr('Custo Un. (€)')}
    ${hdr('Margem (%)')}${hdr('PVP (€)')}${hdr('Desc. (%)')}${hdr('Pr. Final (€)')}${hdr('Subtotal (€)')}${hdr('Notas')}
  </Row>
  ${dataRows}
  <Row/>
  <Row><Cell ss:Index="14">${lbl('Subtotal:')}</Cell>${cell(parseFloat(total.toFixed(2)),'Number')}</Row>
  ${budget.include_tax?`<Row><Cell ss:Index="14">${lbl(`IVA ${budget.tax_rate}%:`)}</Cell>${cell(parseFloat(taxAmt.toFixed(2)),'Number')}</Row>`:''}
  <Row><Cell ss:Index="14">${ttl('TOTAL:')}</Cell>${ttl(parseFloat(totalFinal.toFixed(2)),'Number')}</Row>
</Table></Worksheet>
<Worksheet ss:Name="Por Setor">
<Table>
  <Column ss:Width="180"/><Column ss:Width="120"/>
  <Row ss:Height="24"><Cell ss:StyleID="ti"><Data ss:Type="String">RESUMO POR SETOR</Data></Cell></Row>
  <Row>${lbl('Orçamento:')}${cell(budget.ref+' — '+budget.name)}</Row><Row/>
  <Row>${hdr('Setor')}${hdr('Subtotal (€)')}</Row>
  ${catRows}
  <Row/><Row>${ttl('TOTAL')}${ttl(parseFloat(total.toFixed(2)),'Number')}</Row>
</Table></Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${budget.ref}-${budget.name.replace(/\s+/g,'_').slice(0,30)}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
