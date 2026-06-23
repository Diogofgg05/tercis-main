import type { CatalogItem } from '../types';

// SECTOR: Segurança & CCTV
export const securityItems: CatalogItem[] = [
  { id:'S001',code:'CAM-HK-DS-2CD2143',description:'Câmara IP Hikvision 4MP Dome IR30m',reference:'DS-2CD2143G2-I',brand:'Hikvision',category:'Câmaras IP',sector:'Segurança & CCTV',unit:'un',unit_cost:95.00,supplier:'Hikvision'},
  { id:'S002',code:'CAM-HK-DS-2CD2T47',description:'Câmara IP Hikvision 4MP Bullet IR80m',reference:'DS-2CD2T47G2-L',brand:'Hikvision',category:'Câmaras IP',sector:'Segurança & CCTV',unit:'un',unit_cost:125.00,supplier:'Hikvision'},
  { id:'S003',code:'CAM-HK-PTZ-8MP',description:'Câmara PTZ Hikvision 8MP 25x Zoom',reference:'DS-2DE4A425IWG-E',brand:'Hikvision',category:'PTZ',sector:'Segurança & CCTV',unit:'un',unit_cost:580.00,supplier:'Hikvision'},
  { id:'S004',code:'NVR-HK-4K-8',description:'NVR Hikvision 4K 8 canais 2TB',reference:'DS-7608NI-K2',brand:'Hikvision',category:'NVRs',sector:'Segurança & CCTV',unit:'un',unit_cost:380.00,supplier:'Hikvision'},
  { id:'S005',code:'NVR-HK-4K-32',description:'NVR Hikvision 4K 32 canais 4TB',reference:'DS-9632NI-M8',brand:'Hikvision',category:'NVRs',sector:'Segurança & CCTV',unit:'un',unit_cost:980.00,supplier:'Hikvision'},
  { id:'S006',code:'AC-HK-DS-K1T500',description:'Terminal Controlo Acesso RFID + PIN',reference:'DS-K1T500S',brand:'Hikvision',category:'Controlo Acesso',sector:'Segurança & CCTV',unit:'un',unit_cost:185.00,supplier:'Hikvision'},
  { id:'S007',code:'AC-HK-DS-K2600',description:'Controlador Acesso 2 Portas',reference:'DS-K2602',brand:'Hikvision',category:'Controlo Acesso',sector:'Segurança & CCTV',unit:'un',unit_cost:145.00,supplier:'Hikvision'},
  { id:'S008',code:'ALM-PC-IQ16',description:'Central Alarme DSC PowerSeries 16Z',reference:'PC1616',brand:'DSC',category:'Centrais Alarme',sector:'Segurança & CCTV',unit:'un',unit_cost:185.00,supplier:'DSC'},
  { id:'S009',code:'DET-BE-IQ360',description:'Detetor PIR 360° Tecto',reference:'IQ360DL',brand:'Bosch',category:'Detectores',sector:'Segurança & CCTV',unit:'un',unit_cost:45.00,supplier:'Bosch Security'},
  { id:'S010',code:'DET-BE-DS151',description:'Detetor Volumétrico Dual-Tec',reference:'DS151i',brand:'Bosch',category:'Detectores',sector:'Segurança & CCTV',unit:'un',unit_cost:65.00,supplier:'Bosch Security'},
  { id:'S011',code:'INT-BE-FS520',description:'Detetor de Fumo Fotoelétrico Bosch',reference:'FCP-500',brand:'Bosch',category:'Detecção Incêndio',sector:'Segurança & CCTV',unit:'un',unit_cost:38.00,supplier:'Bosch Security'},
  { id:'S012',code:'SRN-SC-TXSF',description:'Sirene Interior 32 Sons',reference:'TXSF',brand:'DSC',category:'Sirenes',sector:'Segurança & CCTV',unit:'un',unit_cost:28.00,supplier:'DSC'},
];

// SECTOR: Instrumentação & Controlo
export const instrumentationItems: CatalogItem[] = [
  { id:'I001',code:'PT-EH-PMC71',description:'Transmissor Pressão Endress+Hauser 0-10bar',reference:'PMC71-1XC1/0',brand:'Endress+Hauser',category:'Transmissores Pressão',sector:'Instrumentação & Controlo',unit:'un',unit_cost:280.00,supplier:'Endress+Hauser'},
  { id:'I002',code:'PT-EH-PMP55',description:'Transmissor Nível 0-10m 4-20mA',reference:'PMP55-AA2MJMAAE',brand:'Endress+Hauser',category:'Transmissores Pressão',sector:'Instrumentação & Controlo',unit:'un',unit_cost:380.00,supplier:'Endress+Hauser'},
  { id:'I003',code:'TT-EH-TMT142',description:'Transmissor Temperatura 4-20mA PT100',reference:'TMT142-A1ABAK',brand:'Endress+Hauser',category:'Transmissores Temperatura',sector:'Instrumentação & Controlo',unit:'un',unit_cost:185.00,supplier:'Endress+Hauser'},
  { id:'I004',code:'TT-WK-T32',description:'Termopar tipo K com cabeça',reference:'TT-K-032',brand:'Wika',category:'Transmissores Temperatura',sector:'Instrumentação & Controlo',unit:'un',unit_cost:65.00,supplier:'Wika'},
  { id:'I005',code:'FT-EH-Promag',description:'Caudalímetro Eletromagnético DN50 4-20mA',reference:'5W5B15-AACCACAA',brand:'Endress+Hauser',category:'Caudalímetros',sector:'Instrumentação & Controlo',unit:'un',unit_cost:980.00,supplier:'Endress+Hauser'},
  { id:'I006',code:'FT-SM-SITRANS F',description:'Caudalímetro Ultrassónico DN80',reference:'7ME6120-2LC13',brand:'Siemens',category:'Caudalímetros',sector:'Instrumentação & Controlo',unit:'un',unit_cost:1250.00,supplier:'Siemens'},
  { id:'I007',code:'AI-EH-RIA45',description:'Analisador pH/Condutividade EH RIA45',reference:'RIA45-A21A',brand:'Endress+Hauser',category:'Analisadores',sector:'Instrumentação & Controlo',unit:'un',unit_cost:285.00,supplier:'Endress+Hauser'},
  { id:'I008',code:'PID-EH-RIC45',description:'Controlador PID DIN RIC45 4-20mA',reference:'RIC45-A1',brand:'Endress+Hauser',category:'Controladores PID',sector:'Instrumentação & Controlo',unit:'un',unit_cost:185.00,supplier:'Endress+Hauser'},
  { id:'I009',code:'DIS-OM-K3HB',description:'Display Universal Omron K3HB',reference:'K3HB-XAD',brand:'Omron',category:'Indicadores',sector:'Instrumentação & Controlo',unit:'un',unit_cost:145.00,supplier:'Omron'},
  { id:'I010',code:'PT-WK-111',description:'Manómetro Inox 0-16bar Ø63',reference:'111.20.063.100.1.600',brand:'Wika',category:'Manómetros',sector:'Instrumentação & Controlo',unit:'un',unit_cost:28.00,supplier:'Wika'},
  { id:'I011',code:'TH-WK-A52',description:'Termómetro Bimetálico -40+60°C',reference:'A52.063.050.1.K',brand:'Wika',category:'Termómetros',sector:'Instrumentação & Controlo',unit:'un',unit_cost:38.00,supplier:'Wika'},
  { id:'I012',code:'VI-EH-Levelflex',description:'Medidor de Nível por TDR EH FMP54',reference:'FMP54-ABCJ2DJABG',brand:'Endress+Hauser',category:'Medição Nível',sector:'Instrumentação & Controlo',unit:'un',unit_cost:1850.00,supplier:'Endress+Hauser'},
];

// SECTOR: Hidráulica & Pneumática
export const hydraulicsItems: CatalogItem[] = [
  { id:'P001',code:'VS-FT-VUVG-6',description:'Válvula Solenóide Festo VUVG-6 5/2 24VDC',reference:'573403',brand:'Festo',category:'Válvulas Solenóide',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:68.00,supplier:'Festo'},
  { id:'P002',code:'VS-FT-MFH14',description:'Válvula 5/3 Festo MFH-5-1/4 Centro Exaur.',reference:'31001',brand:'Festo',category:'Válvulas Solenóide',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:95.00,supplier:'Festo'},
  { id:'P003',code:'CIL-FT-DNC-40',description:'Cilindro Pneumático Festo DNC-40-100-PPV',reference:'19250',brand:'Festo',category:'Cilindros',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:42.00,supplier:'Festo'},
  { id:'P004',code:'CIL-FT-DNC-63',description:'Cilindro Pneumático Festo DNC-63-200-PPV',reference:'19276',brand:'Festo',category:'Cilindros',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:68.00,supplier:'Festo'},
  { id:'P005',code:'UT-PK-PW40',description:'Unidade FRL Parker PW40 G1/2',reference:'PW40-110RS',brand:'Parker',category:'Unidades FRL',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:125.00,supplier:'Parker'},
  { id:'P006',code:'SP-FT-VPPM',description:'Regulador Pressão Proporcional Festo VPPM',reference:'557892',brand:'Festo',category:'Reguladores Pressão',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:285.00,supplier:'Festo'},
  { id:'P007',code:'PT-FT-SPTW',description:'Sensor Pressão Pneumática Festo SPTW-10',reference:'1536612',brand:'Festo',category:'Sensores Pneumáticos',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:85.00,supplier:'Festo'},
  { id:'P008',code:'VS-HY-SDHE',description:'Válvula Hidráulica Prop. Bosch Rexroth',reference:'R900720196',brand:'Bosch Rexroth',category:'Válvulas Hidráulicas',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:485.00,supplier:'Bosch Rexroth'},
  { id:'P009',code:'CA-PNE-8x1',description:'Tubo Poliuretano 8x1mm (m)',reference:'PLU-8X1-T',brand:'Festo',category:'Tubagem',sector:'Hidráulica & Pneumática',unit:'m',unit_cost:0.85,supplier:'Festo'},
  { id:'P010',code:'FT-FT-QS6H',description:'Ligação Rápida Festo QS-6H Ø6mm',reference:'153029',brand:'Festo',category:'Conexões',sector:'Hidráulica & Pneumática',unit:'un',unit_cost:3.80,supplier:'Festo'},
];

// SECTOR: Mão de Obra
export const laborItems: CatalogItem[] = [
  { id:'M001',code:'MO-MONT',description:'Mão de Obra Montagem Mecânica (h)',reference:'MO-MONT',brand:'Serviço',category:'Mão de Obra',sector:'Serviços',unit:'h',unit_cost:40.00,supplier:'Interno'},
  { id:'M002',code:'MO-CABL',description:'Mão de Obra Cablagem Elétrica (h)',reference:'MO-CABL',brand:'Serviço',category:'Mão de Obra',sector:'Serviços',unit:'h',unit_cost:42.00,supplier:'Interno'},
  { id:'M003',code:'MO-PROG-PLC',description:'Programação PLC (h)',reference:'MO-PROG-PLC',brand:'Serviço',category:'Programação',sector:'Serviços',unit:'h',unit_cost:75.00,supplier:'Interno'},
  { id:'M004',code:'MO-PROG-HMI',description:'Programação HMI/SCADA (h)',reference:'MO-PROG-HMI',brand:'Serviço',category:'Programação',sector:'Serviços',unit:'h',unit_cost:80.00,supplier:'Interno'},
  { id:'M005',code:'MO-COMIS',description:'Colocação em Serviço (h)',reference:'MO-COMIS',brand:'Serviço',category:'Comissionamento',sector:'Serviços',unit:'h',unit_cost:65.00,supplier:'Interno'},
  { id:'M006',code:'MO-DOC',description:'Documentação Técnica (h)',reference:'MO-DOC',brand:'Serviço',category:'Documentação',sector:'Serviços',unit:'h',unit_cost:55.00,supplier:'Interno'},
  { id:'M007',code:'MO-SUP-DIST',description:'Deslocação (km)',reference:'MO-KM',brand:'Serviço',category:'Deslocação',sector:'Serviços',unit:'km',unit_cost:0.38,supplier:'Interno'},
  { id:'M008',code:'MO-FORM',description:'Formação Operador (h)',reference:'MO-FORM',brand:'Serviço',category:'Formação',sector:'Serviços',unit:'h',unit_cost:85.00,supplier:'Interno'},
  { id:'M009',code:'MO-MANUT',description:'Visita Manutenção Preventiva',reference:'MO-MANUT',brand:'Serviço',category:'Manutenção',sector:'Serviços',unit:'un',unit_cost:320.00,supplier:'Interno'},
  { id:'M010',code:'MO-PROJ',description:'Gestão de Projeto (h)',reference:'MO-PROJ',brand:'Serviço',category:'Gestão',sector:'Serviços',unit:'h',unit_cost:90.00,supplier:'Interno'},
];
