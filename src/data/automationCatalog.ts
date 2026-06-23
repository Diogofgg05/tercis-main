import type { CatalogItem } from '../types';

// SECTOR: Automação Industrial
export const automationItems: CatalogItem[] = [
  // PLCs Siemens S7-1200
  { id:'A001',code:'PLC-SM-1212C',description:'SIMATIC S7-1200 CPU 1212C DC/DC/DC',reference:'6ES7212-1AE40-0XB0',brand:'Siemens',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:385.00,supplier:'Siemens'},
  { id:'A002',code:'PLC-SM-1214C',description:'SIMATIC S7-1200 CPU 1214C DC/DC/DC',reference:'6ES7214-1AG40-0XB0',brand:'Siemens',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:465.00,supplier:'Siemens'},
  { id:'A003',code:'PLC-SM-1215C',description:'SIMATIC S7-1200 CPU 1215C DC/DC/DC',reference:'6ES7215-1AG40-0XB0',brand:'Siemens',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:585.00,supplier:'Siemens'},
  { id:'A004',code:'PLC-SM-1516',description:'SIMATIC S7-1500 CPU 1516-3 PN/DP',reference:'6ES7516-3AN02-0AB0',brand:'Siemens',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:1850.00,supplier:'Siemens'},
  // PLCs Schneider Electric Modicon
  { id:'A005',code:'PLC-SC-M221-16',description:'Modicon M221 16I/O 24VDC',reference:'TM221CE16R',brand:'Schneider',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:245.00,supplier:'Schneider Electric'},
  { id:'A006',code:'PLC-SC-M241',description:'Modicon M241 24 E/S TM241CEC24R',reference:'TM241CEC24R',brand:'Schneider',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:385.00,supplier:'Schneider Electric'},
  { id:'A007',code:'PLC-SC-M340',description:'Modicon M340 CPU 313 Ethernet',reference:'BMX P34 2020',brand:'Schneider',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:980.00,supplier:'Schneider Electric'},
  // PLCs ABB AC500
  { id:'A008',code:'PLC-ABB-PM571',description:'ABB AC500 CPU PM571 Ethernet',reference:'1SAP130100R0271',brand:'ABB',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:620.00,supplier:'ABB'},
  // PLCs Omron
  { id:'A009',code:'PLC-OM-NX1P',description:'Omron NX1P2 CPU 1.7ns/inst',reference:'NX1P2-9024DT1',brand:'Omron',category:'PLCs',sector:'Automação Industrial',unit:'un',unit_cost:445.00,supplier:'Omron'},
  // Módulos I/O
  { id:'A010',code:'IO-SM-8DI',description:'Módulo 8DI 24VDC S7-1200',reference:'6ES7221-1BF32-0XB0',brand:'Siemens',category:'Módulos I/O',sector:'Automação Industrial',unit:'un',unit_cost:125.00,supplier:'Siemens'},
  { id:'A011',code:'IO-SM-8DO',description:'Módulo 8DO 24VDC S7-1200',reference:'6ES7222-1BF32-0XB0',brand:'Siemens',category:'Módulos I/O',sector:'Automação Industrial',unit:'un',unit_cost:145.00,supplier:'Siemens'},
  { id:'A012',code:'IO-SM-4AI',description:'Módulo 4AI ±10V/0-20mA S7-1200',reference:'6ES7231-4HD32-0XB0',brand:'Siemens',category:'Módulos I/O',sector:'Automação Industrial',unit:'un',unit_cost:185.00,supplier:'Siemens'},
  { id:'A013',code:'IO-SM-4AO',description:'Módulo 4AO ±10V/0-20mA S7-1200',reference:'6ES7232-4HD32-0XB0',brand:'Siemens',category:'Módulos I/O',sector:'Automação Industrial',unit:'un',unit_cost:195.00,supplier:'Siemens'},
  { id:'A014',code:'IO-WG-16DI',description:'WAGO 750 Módulo 16DI 24VDC',reference:'750-1405',brand:'Wago',category:'Módulos I/O',sector:'Automação Industrial',unit:'un',unit_cost:68.00,supplier:'Wago'},
  // HMIs Siemens
  { id:'A015',code:'HMI-SM-KTP400',description:'SIMATIC KTP400 Basic 4" PN',reference:'6AV2123-2DB03-0AX0',brand:'Siemens',category:'HMIs',sector:'Automação Industrial',unit:'un',unit_cost:420.00,supplier:'Siemens'},
  { id:'A016',code:'HMI-SM-KTP700',description:'SIMATIC KTP700 Basic 7" PN',reference:'6AV2123-2GB03-0AX0',brand:'Siemens',category:'HMIs',sector:'Automação Industrial',unit:'un',unit_cost:620.00,supplier:'Siemens'},
  { id:'A017',code:'HMI-SM-KTP900',description:'SIMATIC KTP900 Basic 9" PN',reference:'6AV2123-2JB03-0AX0',brand:'Siemens',category:'HMIs',sector:'Automação Industrial',unit:'un',unit_cost:920.00,supplier:'Siemens'},
  { id:'A018',code:'HMI-SM-TP1200',description:'SIMATIC TP1200 Comfort 12" PN/DP',reference:'6AV2124-0MC01-0AX0',brand:'Siemens',category:'HMIs',sector:'Automação Industrial',unit:'un',unit_cost:1850.00,supplier:'Siemens'},
  // Variadores ABB
  { id:'A019',code:'VFD-ABB-ACS355-1.5',description:'ABB ACS355 1.5kW 3Fase 400V',reference:'ACS355-03E-03A3-4',brand:'ABB',category:'Variadores',sector:'Automação Industrial',unit:'un',unit_cost:285.00,supplier:'ABB'},
  { id:'A020',code:'VFD-ABB-ACS355-4',description:'ABB ACS355 4kW 3Fase 400V',reference:'ACS355-03E-08A8-4',brand:'ABB',category:'Variadores',sector:'Automação Industrial',unit:'un',unit_cost:445.00,supplier:'ABB'},
  { id:'A021',code:'VFD-ABB-ACS880-11',description:'ABB ACS880 11kW 3Fase 400V',reference:'ACS880-01-025A-3',brand:'ABB',category:'Variadores',sector:'Automação Industrial',unit:'un',unit_cost:1250.00,supplier:'ABB'},
  // Variadores Siemens SINAMICS
  { id:'A022',code:'VFD-SM-G120-2.2',description:'SINAMICS G120 2.2kW Frame A',reference:'6SL3210-1KE14-3UF1',brand:'Siemens',category:'Variadores',sector:'Automação Industrial',unit:'un',unit_cost:380.00,supplier:'Siemens'},
  { id:'A023',code:'VFD-SM-G120-7.5',description:'SINAMICS G120 7.5kW Frame B',reference:'6SL3210-1KE21-3UF1',brand:'Siemens',category:'Variadores',sector:'Automação Industrial',unit:'un',unit_cost:780.00,supplier:'Siemens'},
  // Variadores Danfoss
  { id:'A024',code:'VFD-DF-FC302-1.5',description:'Danfoss FC302 1.5kW IP55',reference:'FC302P1K5T5E20H2BG',brand:'Danfoss',category:'Variadores',sector:'Automação Industrial',unit:'un',unit_cost:320.00,supplier:'Danfoss'},
  { id:'A025',code:'VFD-DF-FC302-11',description:'Danfoss FC302 11kW IP20',reference:'FC302P11KT4E20H2BG',brand:'Danfoss',category:'Variadores',sector:'Automação Industrial',unit:'un',unit_cost:1180.00,supplier:'Danfoss'},
  // Arrancadores Suaves ABB
  { id:'A026',code:'SS-ABB-PSR9',description:'ABB Arrancador Suave PSR9-600-11 9A',reference:'1SFA896104R1100',brand:'ABB',category:'Arrancadores Suaves',sector:'Automação Industrial',unit:'un',unit_cost:180.00,supplier:'ABB'},
  { id:'A027',code:'SS-ABB-PSR30',description:'ABB Arrancador Suave PSR30-600-81 30A',reference:'1SFA896111R8100',brand:'ABB',category:'Arrancadores Suaves',sector:'Automação Industrial',unit:'un',unit_cost:380.00,supplier:'ABB'},
  // Sensores
  { id:'A028',code:'SN-IFM-O1D',description:'Sensor Ultrasónico IFM O1D100',reference:'O1D100',brand:'IFM',category:'Sensores',sector:'Automação Industrial',unit:'un',unit_cost:185.00,supplier:'IFM Electronic'},
  { id:'A029',code:'SN-OM-E2E-NA',description:'Sensor Indutivo Omron E2E-X5MY1',reference:'E2E-X5MY1-Z',brand:'Omron',category:'Sensores',sector:'Automação Industrial',unit:'un',unit_cost:38.00,supplier:'Omron'},
  { id:'A030',code:'SN-SK-WL18G',description:'Sensor Fotoelétrico SICK WL18G-3P330',reference:'1064928',brand:'Sick',category:'Sensores',sector:'Automação Industrial',unit:'un',unit_cost:95.00,supplier:'Sick'},
  // Safety
  { id:'A031',code:'SF-SM-3TK',description:'Módulo de Segurança Siemens 3TK2825',reference:'3TK2825-1BB40',brand:'Siemens',category:'Segurança Funcional',sector:'Automação Industrial',unit:'un',unit_cost:165.00,supplier:'Siemens'},
  { id:'A032',code:'SF-PC-PSR-SCP',description:'Módulo Segurança PSR-SCP-24UC/ESA4',reference:'2981374',brand:'Phoenix Contact',category:'Segurança Funcional',sector:'Automação Industrial',unit:'un',unit_cost:145.00,supplier:'Phoenix Contact'},
  // Encoders
  { id:'A033',code:'ENC-HD-58N',description:'Encoder Incremental Heidenhain ROD 426',reference:'ROD 426',brand:'Heidenhain',category:'Encoders',sector:'Automação Industrial',unit:'un',unit_cost:285.00,supplier:'Heidenhain'},
  // SEW-Eurodrive
  { id:'A034',code:'GM-SEW-DRE90',description:'Motorredutor SEW DRE90L4 1.5kW',reference:'01380432',brand:'SEW-Eurodrive',category:'Motorredutores',sector:'Automação Industrial',unit:'un',unit_cost:485.00,supplier:'SEW-Eurodrive'},
  { id:'A035',code:'VFD-SEW-MC07B',description:'Variador SEW MOVITRAC MC07B 1.5kW',reference:'08246131',brand:'SEW-Eurodrive',category:'Variadores',sector:'Automação Industrial',unit:'un',unit_cost:420.00,supplier:'SEW-Eurodrive'},
];
