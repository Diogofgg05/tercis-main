import type { CatalogItem } from '../types';

// SECTOR: Eletricidade Industrial
export const electricalItems: CatalogItem[] = [
  // Disjuntores Schneider
  { id:'E001',code:'DJ-SC-1P06',description:'Disjuntor 1P 6A curva C',reference:'A9F74106',brand:'Schneider',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:9.80,supplier:'Schneider Electric'},
  { id:'E002',code:'DJ-SC-1P10',description:'Disjuntor 1P 10A curva C',reference:'A9F74110',brand:'Schneider',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:11.20,supplier:'Schneider Electric'},
  { id:'E003',code:'DJ-SC-1P16',description:'Disjuntor 1P 16A curva C',reference:'A9F74116',brand:'Schneider',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:12.50,supplier:'Schneider Electric'},
  { id:'E004',code:'DJ-SC-1P20',description:'Disjuntor 1P 20A curva C',reference:'A9F74120',brand:'Schneider',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:13.20,supplier:'Schneider Electric'},
  { id:'E005',code:'DJ-SC-1P25',description:'Disjuntor 1P 25A curva C',reference:'A9F74125',brand:'Schneider',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:14.60,supplier:'Schneider Electric'},
  { id:'E006',code:'DJ-SC-3P20',description:'Disjuntor 3P 20A curva C',reference:'A9F74320',brand:'Schneider',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:36.80,supplier:'Schneider Electric'},
  { id:'E007',code:'DJ-SC-3P32',description:'Disjuntor 3P 32A curva C',reference:'A9F74332',brand:'Schneider',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:42.50,supplier:'Schneider Electric'},
  { id:'E008',code:'DJ-SC-3P63',description:'Disjuntor 3P 63A curva C',reference:'A9F74363',brand:'Schneider',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:58.00,supplier:'Schneider Electric'},
  { id:'E009',code:'DJ-ABB-3P125',description:'Disjuntor MCCB 3P 125A',reference:'T1N125',brand:'ABB',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:185.00,supplier:'ABB'},
  { id:'E010',code:'DJ-ABB-3P250',description:'Disjuntor MCCB 3P 250A',reference:'T3N250',brand:'ABB',category:'Disjuntores',sector:'Eletricidade Industrial',unit:'un',unit_cost:420.00,supplier:'ABB'},
  // Diferenciais
  { id:'E011',code:'DF-LG-2P40',description:'Diferencial 2P 40A 30mA tipo AC',reference:'A9Z21240',brand:'Legrand',category:'Diferenciais',sector:'Eletricidade Industrial',unit:'un',unit_cost:52.00,supplier:'Legrand'},
  { id:'E012',code:'DF-LG-4P40',description:'Diferencial 4P 40A 30mA tipo AC',reference:'A9Z24440',brand:'Legrand',category:'Diferenciais',sector:'Eletricidade Industrial',unit:'un',unit_cost:85.00,supplier:'Legrand'},
  { id:'E013',code:'DF-LG-4P63',description:'Diferencial 4P 63A 30mA tipo AC',reference:'A9Z24463',brand:'Legrand',category:'Diferenciais',sector:'Eletricidade Industrial',unit:'un',unit_cost:110.00,supplier:'Legrand'},
  { id:'E014',code:'DF-HG-4P63A',description:'Diferencial 4P 63A 300mA tipo A',reference:'MFN463A',brand:'Hager',category:'Diferenciais',sector:'Eletricidade Industrial',unit:'un',unit_cost:98.00,supplier:'Hager'},
  // Contactores Siemens
  { id:'E015',code:'CT-SM-9A',description:'Contactor 3P 9A 230V AC',reference:'3RT2016-1AP01',brand:'Siemens',category:'Contactores',sector:'Eletricidade Industrial',unit:'un',unit_cost:38.50,supplier:'Siemens'},
  { id:'E016',code:'CT-SM-25A',description:'Contactor 3P 25A 230V AC',reference:'3RT2026-1AP01',brand:'Siemens',category:'Contactores',sector:'Eletricidade Industrial',unit:'un',unit_cost:52.00,supplier:'Siemens'},
  { id:'E017',code:'CT-SM-40A',description:'Contactor 3P 40A 230V AC',reference:'3RT2035-1AP01',brand:'Siemens',category:'Contactores',sector:'Eletricidade Industrial',unit:'un',unit_cost:75.00,supplier:'Siemens'},
  { id:'E018',code:'CT-SM-65A',description:'Contactor 3P 65A 230V AC',reference:'3RT2045-1AP01',brand:'Siemens',category:'Contactores',sector:'Eletricidade Industrial',unit:'un',unit_cost:98.00,supplier:'Siemens'},
  // Relés Térmicos
  { id:'E019',code:'RT-SM-6-10',description:'Relé Térmico 6-10A',reference:'3RU2116-1JB0',brand:'Siemens',category:'Protecções',sector:'Eletricidade Industrial',unit:'un',unit_cost:34.00,supplier:'Siemens'},
  { id:'E020',code:'RT-SM-25-40',description:'Relé Térmico 25-40A',reference:'3RU2136-4FB0',brand:'Siemens',category:'Protecções',sector:'Eletricidade Industrial',unit:'un',unit_cost:45.00,supplier:'Siemens'},
  // Transformadores ABB
  { id:'E021',code:'TR-ABB-50VA',description:'Transformador 230/24V 50VA',reference:'ABL6TS10B',brand:'ABB',category:'Transformadores',sector:'Eletricidade Industrial',unit:'un',unit_cost:55.00,supplier:'ABB'},
  { id:'E022',code:'TR-ABB-100VA',description:'Transformador 230/24V 100VA',reference:'ABL6TS10G',brand:'ABB',category:'Transformadores',sector:'Eletricidade Industrial',unit:'un',unit_cost:72.00,supplier:'ABB'},
  { id:'E023',code:'TR-ABB-250VA',description:'Transformador 400/24V 250VA',reference:'ABL6TS25G',brand:'ABB',category:'Transformadores',sector:'Eletricidade Industrial',unit:'un',unit_cost:118.00,supplier:'ABB'},
  // Bornes Phoenix Contact
  { id:'E024',code:'BR-PC-2.5',description:'Borne passagem 2.5mm²',reference:'ST 2,5',brand:'Phoenix Contact',category:'Bornes',sector:'Eletricidade Industrial',unit:'un',unit_cost:1.45,supplier:'Phoenix Contact'},
  { id:'E025',code:'BR-PC-4',description:'Borne passagem 4mm²',reference:'ST 4',brand:'Phoenix Contact',category:'Bornes',sector:'Eletricidade Industrial',unit:'un',unit_cost:1.85,supplier:'Phoenix Contact'},
  { id:'E026',code:'BR-PC-10',description:'Borne passagem 10mm²',reference:'ST 10',brand:'Phoenix Contact',category:'Bornes',sector:'Eletricidade Industrial',unit:'un',unit_cost:3.20,supplier:'Phoenix Contact'},
  { id:'E027',code:'BR-PC-PE',description:'Borne terra 2.5mm²',reference:'ST 2,5-PE',brand:'Phoenix Contact',category:'Bornes',sector:'Eletricidade Industrial',unit:'un',unit_cost:2.10,supplier:'Phoenix Contact'},
  { id:'E028',code:'BR-WM-4',description:'Borne passagem 4mm² (Weidmuller)',reference:'WDU 4',brand:'Weidmuller',category:'Bornes',sector:'Eletricidade Industrial',unit:'un',unit_cost:1.95,supplier:'Weidmuller'},
  // Cabos
  { id:'E029',code:'CA-NX-1.5BL',description:'Cabo H07V-K 1.5mm² Azul (m)',reference:'H07VK-1.5-BL',brand:'Nexans',category:'Cabos',sector:'Eletricidade Industrial',unit:'m',unit_cost:0.88,supplier:'Nexans'},
  { id:'E030',code:'CA-NX-1.5AV',description:'Cabo H07V-K 1.5mm² Amarelo/Verde (m)',reference:'H07VK-1.5-AV',brand:'Nexans',category:'Cabos',sector:'Eletricidade Industrial',unit:'m',unit_cost:0.88,supplier:'Nexans'},
  { id:'E031',code:'CA-NX-2.5',description:'Cabo H07V-K 2.5mm² Vermelho (m)',reference:'H07VK-2.5-VM',brand:'Nexans',category:'Cabos',sector:'Eletricidade Industrial',unit:'m',unit_cost:1.25,supplier:'Nexans'},
  { id:'E032',code:'CA-NX-4',description:'Cabo H07V-K 4mm² Cinza (m)',reference:'H07VK-4-CZ',brand:'Nexans',category:'Cabos',sector:'Eletricidade Industrial',unit:'m',unit_cost:1.90,supplier:'Nexans'},
  { id:'E033',code:'CA-NX-6',description:'Cabo H07V-K 6mm² Preto (m)',reference:'H07VK-6-PT',brand:'Nexans',category:'Cabos',sector:'Eletricidade Industrial',unit:'m',unit_cost:2.80,supplier:'Nexans'},
  // Estrutura
  { id:'E034',code:'TL-GW-DIN',description:'Trilho DIN 35mm (m)',reference:'TH35/7.5-M',brand:'Gewiss',category:'Estrutura',sector:'Eletricidade Industrial',unit:'m',unit_cost:4.80,supplier:'Gewiss'},
  { id:'E035',code:'TL-GW-40x40',description:'Calha PVC 40x40mm (m)',reference:'CW-4040-M',brand:'Gewiss',category:'Estrutura',sector:'Eletricidade Industrial',unit:'m',unit_cost:5.20,supplier:'Gewiss'},
  { id:'E036',code:'TL-GW-60x60',description:'Calha PVC 60x60mm (m)',reference:'CW-6060-M',brand:'Gewiss',category:'Estrutura',sector:'Eletricidade Industrial',unit:'m',unit_cost:7.80,supplier:'Gewiss'},
  // Quadros
  { id:'E037',code:'QD-RI-600800',description:'Armário Rittal 600x800x250 IP65',reference:'TS 8606.500',brand:'Rittal',category:'Quadros',sector:'Eletricidade Industrial',unit:'un',unit_cost:385.00,supplier:'Rittal'},
  { id:'E038',code:'QD-RI-8001000',description:'Armário Rittal 800x1000x300 IP65',reference:'TS 8608.500',brand:'Rittal',category:'Quadros',sector:'Eletricidade Industrial',unit:'un',unit_cost:580.00,supplier:'Rittal'},
  { id:'E039',code:'QD-GW-36M',description:'Quadro Modular 36 módulos IP65',reference:'GW40-006',brand:'Gewiss',category:'Quadros',sector:'Eletricidade Industrial',unit:'un',unit_cost:148.00,supplier:'Gewiss'},
  // Fonte de Alimentação
  { id:'E040',code:'PS-PC-24V5A',description:'Fonte Alimentação 24VDC 5A DIN Rail',reference:'QUINT4-PS/1AC/24DC/5',brand:'Phoenix Contact',category:'Alimentação',sector:'Eletricidade Industrial',unit:'un',unit_cost:145.00,supplier:'Phoenix Contact'},
  { id:'E041',code:'PS-PC-24V10A',description:'Fonte Alimentação 24VDC 10A DIN Rail',reference:'QUINT4-PS/1AC/24DC/10',brand:'Phoenix Contact',category:'Alimentação',sector:'Eletricidade Industrial',unit:'un',unit_cost:210.00,supplier:'Phoenix Contact'},
];
