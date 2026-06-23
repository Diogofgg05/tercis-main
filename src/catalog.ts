import type { CatalogItem } from './types';

export const CATALOG: Partial<CatalogItem>[] = [
  // Disjuntores
  { code: 'DJ01', description: 'Disjuntor 1P 6A', reference: 'iC60N-6A-1P', brand: 'Schneider', unit_cost: 11.20, category: 'Disjuntores' },
  { code: 'DJ02', description: 'Disjuntor 1P 10A', reference: 'iC60N-10A-1P', brand: 'Schneider', unit_cost: 12.50, category: 'Disjuntores' },
  { code: 'DJ03', description: 'Disjuntor 1P 16A', reference: 'iC60N-16A-1P', brand: 'Schneider', unit_cost: 13.80, category: 'Disjuntores' },
  { code: 'DJ04', description: 'Disjuntor 1P 20A', reference: 'iC60N-20A-1P', brand: 'Schneider', unit_cost: 14.20, category: 'Disjuntores' },
  { code: 'DJ05', description: 'Disjuntor 1P 25A', reference: 'iC60N-25A-1P', brand: 'Schneider', unit_cost: 15.00, category: 'Disjuntores' },
  { code: 'DJ06', description: 'Disjuntor 3P 10A', reference: 'iC60N-10A-3P', brand: 'Schneider', unit_cost: 34.50, category: 'Disjuntores' },
  { code: 'DJ07', description: 'Disjuntor 3P 20A', reference: 'iC60N-20A-3P', brand: 'Schneider', unit_cost: 38.50, category: 'Disjuntores' },
  { code: 'DJ08', description: 'Disjuntor 3P 32A', reference: 'iC60N-32A-3P', brand: 'Schneider', unit_cost: 45.00, category: 'Disjuntores' },
  { code: 'DJ09', description: 'Disjuntor 3P 63A', reference: 'iC60N-63A-3P', brand: 'Schneider', unit_cost: 62.00, category: 'Disjuntores' },
  { code: 'DJ10', description: 'Disjuntor Geral 3P 125A', reference: 'NS125N', brand: 'Schneider', unit_cost: 185.00, category: 'Disjuntores' },
  // Contactores
  { code: 'CT01', description: 'Contactor 3P 9A', reference: '3RT2016-1AP01', brand: 'Siemens', unit_cost: 38.90, category: 'Contactores' },
  { code: 'CT02', description: 'Contactor 3P 25A', reference: '3RT2026-1AP01', brand: 'Siemens', unit_cost: 48.90, category: 'Contactores' },
  { code: 'CT03', description: 'Contactor 3P 40A', reference: '3RT2035-1AP01', brand: 'Siemens', unit_cost: 67.50, category: 'Contactores' },
  { code: 'CT04', description: 'Contactor 3P 63A', reference: '3RT2045-1AP01', brand: 'Siemens', unit_cost: 89.00, category: 'Contactores' },
  { code: 'CT05', description: 'Contactor 3P 95A', reference: '3RT2056-1AP01', brand: 'Siemens', unit_cost: 135.00, category: 'Contactores' },
  // Relés Térmicos
  { code: 'RT01', description: 'Relé Térmico 2.8-4A', reference: '3RU2116-1DB0', brand: 'Siemens', unit_cost: 32.00, category: 'Protecções' },
  { code: 'RT02', description: 'Relé Térmico 6-10A', reference: '3RU2116-1JB0', brand: 'Siemens', unit_cost: 35.00, category: 'Protecções' },
  { code: 'RT03', description: 'Relé Térmico 25-40A', reference: '3RU2136-4FB0', brand: 'Siemens', unit_cost: 42.00, category: 'Protecções' },
  // Diferenciais
  { code: 'DF01', description: 'Diferencial 25A 30mA 2P', reference: 'DX3-AC25-2P', brand: 'Legrand', unit_cost: 45.00, category: 'Diferenciais' },
  { code: 'DF02', description: 'Diferencial 40A 30mA 2P', reference: 'DX3-AC40-2P', brand: 'Legrand', unit_cost: 55.00, category: 'Diferenciais' },
  { code: 'DF03', description: 'Diferencial 40A 30mA 4P', reference: 'DX3-AC40-4P', brand: 'Legrand', unit_cost: 82.00, category: 'Diferenciais' },
  { code: 'DF04', description: 'Diferencial 63A 30mA 4P', reference: 'DX3-AC63-4P', brand: 'Legrand', unit_cost: 98.00, category: 'Diferenciais' },
  { code: 'DF05', description: 'Diferencial 63A 300mA 4P', reference: 'DX3-AC63-4P-300', brand: 'Legrand', unit_cost: 95.00, category: 'Diferenciais' },
  // Transformadores
  { code: 'TR01', description: 'Transformador 230/24V 50VA', reference: 'ABB-T50VA', brand: 'ABB', unit_cost: 55.00, category: 'Transformadores' },
  { code: 'TR02', description: 'Transformador 230/24V 100VA', reference: 'ABB-T100VA', brand: 'ABB', unit_cost: 75.00, category: 'Transformadores' },
  { code: 'TR03', description: 'Transformador 230/24V 160VA', reference: 'ABB-T160VA', brand: 'ABB', unit_cost: 95.00, category: 'Transformadores' },
  { code: 'TR04', description: 'Transformador 400/24V 250VA', reference: 'ABB-T250VA', brand: 'ABB', unit_cost: 120.00, category: 'Transformadores' },
  // Fusíveis
  { code: 'FU01', description: 'Fusível 10A gG 10x38', reference: 'DF2BA10', brand: 'Schneider', unit_cost: 2.80, category: 'Fusíveis' },
  { code: 'FU02', description: 'Fusível 16A gG 10x38', reference: 'DF2BA16', brand: 'Schneider', unit_cost: 3.10, category: 'Fusíveis' },
  { code: 'FU03', description: 'Fusível 25A gG 10x38', reference: 'DF2BA25', brand: 'Schneider', unit_cost: 3.50, category: 'Fusíveis' },
  { code: 'FU04', description: 'Base Fusível 32A 10x38', reference: 'DF2CN32', brand: 'Schneider', unit_cost: 8.50, category: 'Fusíveis' },
  // Botoneiras
  { code: 'BT01', description: 'Botoneira Verde NA Ø22', reference: 'ZB5-AA3', brand: 'Schneider', unit_cost: 8.50, category: 'Comando' },
  { code: 'BT02', description: 'Botoneira Vermelha NF Ø22', reference: 'ZB5-AA4', brand: 'Schneider', unit_cost: 8.50, category: 'Comando' },
  { code: 'BT03', description: 'Paragem de Emergência Ø40', reference: 'ZB5-AS4', brand: 'Schneider', unit_cost: 22.00, category: 'Comando' },
  { code: 'BT04', description: 'Selector 3 posições Ø22', reference: 'ZB5-AD3', brand: 'Schneider', unit_cost: 15.00, category: 'Comando' },
  { code: 'BT05', description: 'Selector com chave Ø22', reference: 'ZB5-AG3', brand: 'Schneider', unit_cost: 28.00, category: 'Comando' },
  // Sinaleiros
  { code: 'SN01', description: 'Sinaleiro Verde 24V Ø22', reference: 'ZB5-AV03', brand: 'Schneider', unit_cost: 7.20, category: 'Sinalização' },
  { code: 'SN02', description: 'Sinaleiro Vermelho 24V Ø22', reference: 'ZB5-AV04', brand: 'Schneider', unit_cost: 7.20, category: 'Sinalização' },
  { code: 'SN03', description: 'Sinaleiro Amarelo 24V Ø22', reference: 'ZB5-AV5', brand: 'Schneider', unit_cost: 7.20, category: 'Sinalização' },
  { code: 'SN04', description: 'Sinaleiro Azul 24V Ø22', reference: 'ZB5-AV6', brand: 'Schneider', unit_cost: 7.20, category: 'Sinalização' },
  { code: 'SN05', description: 'Torre Sinalização 3 cores', reference: 'XVBC-3', brand: 'Schneider', unit_cost: 48.00, category: 'Sinalização' },
  // Cabos
  { code: 'CA01', description: 'Cabo H07V-K 0.75mm² Azul (m)', reference: 'H07VK-0.75-BL', brand: 'Nexans', unit_cost: 0.65, category: 'Cabos' },
  { code: 'CA02', description: 'Cabo H07V-K 1.5mm² Azul (m)', reference: 'H07VK-1.5-BL', brand: 'Nexans', unit_cost: 0.85, category: 'Cabos' },
  { code: 'CA03', description: 'Cabo H07V-K 1.5mm² Amarelo/Verde (m)', reference: 'H07VK-1.5-AV', brand: 'Nexans', unit_cost: 0.85, category: 'Cabos' },
  { code: 'CA04', description: 'Cabo H07V-K 2.5mm² Vermelho (m)', reference: 'H07VK-2.5-VM', brand: 'Nexans', unit_cost: 1.20, category: 'Cabos' },
  { code: 'CA05', description: 'Cabo H07V-K 4mm² Cinza (m)', reference: 'H07VK-4-CZ', brand: 'Nexans', unit_cost: 1.80, category: 'Cabos' },
  { code: 'CA06', description: 'Cabo H07V-K 6mm² Preto (m)', reference: 'H07VK-6-PT', brand: 'Nexans', unit_cost: 2.60, category: 'Cabos' },
  // Bornes
  { code: 'BR01', description: 'Borne 2.5mm² passagem', reference: 'ST-2.5', brand: 'Phoenix Contact', unit_cost: 1.45, category: 'Bornes' },
  { code: 'BR02', description: 'Borne 4mm² passagem', reference: 'ST-4', brand: 'Phoenix Contact', unit_cost: 1.85, category: 'Bornes' },
  { code: 'BR03', description: 'Borne 6mm² passagem', reference: 'ST-6', brand: 'Phoenix Contact', unit_cost: 2.40, category: 'Bornes' },
  { code: 'BR04', description: 'Borne 10mm² passagem', reference: 'ST-10', brand: 'Phoenix Contact', unit_cost: 3.20, category: 'Bornes' },
  { code: 'BR05', description: 'Borne terra 2.5mm²', reference: 'ST-2.5-PE', brand: 'Phoenix Contact', unit_cost: 2.10, category: 'Bornes' },
  { code: 'BR06', description: 'Marcador para bornes (100un)', reference: 'ZB-5', brand: 'Phoenix Contact', unit_cost: 4.50, category: 'Bornes' },
  // Estrutura
  { code: 'TL01', description: 'Trilho DIN 35mm (m)', reference: 'TH-35/7.5', brand: 'Gewiss', unit_cost: 4.50, category: 'Estrutura' },
  { code: 'TL02', description: 'Calha PVC 25x25mm (m)', reference: 'CW-2525', brand: 'Gewiss', unit_cost: 3.20, category: 'Estrutura' },
  { code: 'TL03', description: 'Calha PVC 40x40mm (m)', reference: 'CW-4040', brand: 'Gewiss', unit_cost: 4.80, category: 'Estrutura' },
  { code: 'TL04', description: 'Calha PVC 60x60mm (m)', reference: 'CW-6060', brand: 'Gewiss', unit_cost: 7.50, category: 'Estrutura' },
  { code: 'TL05', description: 'Calha PVC 80x60mm (m)', reference: 'CW-8060', brand: 'Gewiss', unit_cost: 9.80, category: 'Estrutura' },
  // Quadros
  { code: 'QD01', description: 'Quadro Modular 24 módulos IP65', reference: 'GW40-004', brand: 'Gewiss', unit_cost: 98.00, category: 'Quadros' },
  { code: 'QD02', description: 'Quadro Modular 36 módulos IP65', reference: 'GW40-006', brand: 'Gewiss', unit_cost: 145.00, category: 'Quadros' },
  { code: 'QD03', description: 'Quadro Modular 72 módulos IP65', reference: 'GW40-012', brand: 'Gewiss', unit_cost: 220.00, category: 'Quadros' },
  { code: 'QD04', description: 'Armário Metálico 600x800x250 IP65', reference: 'AM-600800', brand: 'Rittal', unit_cost: 380.00, category: 'Quadros' },
  { code: 'QD05', description: 'Armário Metálico 800x1000x300 IP65', reference: 'AM-8001000', brand: 'Rittal', unit_cost: 580.00, category: 'Quadros' },
  // Automação
  { code: 'PLC01', description: 'PLC S7-1200 CPU 1212C DC/DC/DC', reference: '6ES7212-1AE40-0XB0', brand: 'Siemens', unit_cost: 385.00, category: 'Automação' },
  { code: 'PLC02', description: 'PLC S7-1200 CPU 1214C DC/DC/DC', reference: '6ES7214-1AG40-0XB0', brand: 'Siemens', unit_cost: 465.00, category: 'Automação' },
  { code: 'IO01', description: 'Módulo I/O Digital SM1222 8DO', reference: '6ES7222-1BH32-0XB0', brand: 'Siemens', unit_cost: 145.00, category: 'Automação' },
  { code: 'IO02', description: 'Módulo I/O Digital SM1221 8DI', reference: '6ES7221-1BF32-0XB0', brand: 'Siemens', unit_cost: 125.00, category: 'Automação' },
  { code: 'IO03', description: 'Módulo Analógico SM1232 4AO', reference: '6ES7232-4HD32-0XB0', brand: 'Siemens', unit_cost: 195.00, category: 'Automação' },
  { code: 'HMI01', description: 'Painel HMI KTP700 Basic 7"', reference: '6AV2123-2GB03-0AX0', brand: 'Siemens', unit_cost: 620.00, category: 'Automação' },
  // Alimentação
  { code: 'PS01', description: 'Fonte Alimentação 24VDC 2.5A', reference: 'ABL1REM24025', brand: 'Schneider', unit_cost: 65.00, category: 'Alimentação' },
  { code: 'PS02', description: 'Fonte Alimentação 24VDC 5A', reference: 'ABL1REM24050', brand: 'Schneider', unit_cost: 88.00, category: 'Alimentação' },
  { code: 'PS03', description: 'Fonte Alimentação 24VDC 10A', reference: 'ABL1REM24100', brand: 'Schneider', unit_cost: 125.00, category: 'Alimentação' },
  { code: 'UPS01', description: 'UPS 24VDC 40W DIN Rail', reference: 'QUINT-UPS/24DC/24DC/20', brand: 'Phoenix Contact', unit_cost: 285.00, category: 'Alimentação' },
  // Mão de obra
  { code: 'MO01', description: 'Mão de Obra Montagem (h)', reference: 'MO-MONT', brand: 'Serviço', unit_cost: 45.00, category: 'Mão de Obra' },
  { code: 'MO02', description: 'Mão de Obra Cablagem (h)', reference: 'MO-CABL', brand: 'Serviço', unit_cost: 42.00, category: 'Mão de Obra' },
  { code: 'MO03', description: 'Mão de Obra Programação PLC (h)', reference: 'MO-PROG', brand: 'Serviço', unit_cost: 75.00, category: 'Mão de Obra' },
  { code: 'MO04', description: 'Mão de Obra Colocação em Serviço (h)', reference: 'MO-COMIS', brand: 'Serviço', unit_cost: 65.00, category: 'Mão de Obra' },
];

export const CATEGORIES = [...new Set(CATALOG.map((c) => c.category))].sort();
