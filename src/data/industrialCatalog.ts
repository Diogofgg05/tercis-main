import type { CatalogItem } from '../types';

// SECTOR: HVAC & Climatização
export const hvacItems: CatalogItem[] = [
  { id:'H001',code:'CTRL-SM-RDU340',description:'Controlador HVAC Siemens RDU340',reference:'S55770-T223',brand:'Siemens',category:'Controladores',sector:'HVAC & Climatização',unit:'un',unit_cost:285.00,supplier:'Siemens'},
  { id:'H002',code:'CTRL-HW-T775B',description:'Controlador Programável Honeywell T775B',reference:'T775B2030',brand:'Honeywell',category:'Controladores',sector:'HVAC & Climatização',unit:'un',unit_cost:195.00,supplier:'Honeywell'},
  { id:'H003',code:'VFD-DF-VLT2800',description:'Danfoss VLT2800 1.1kW HVAC',reference:'195N0001',brand:'Danfoss',category:'Variadores HVAC',sector:'HVAC & Climatização',unit:'un',unit_cost:245.00,supplier:'Danfoss'},
  { id:'H004',code:'VFD-DF-HVAC102-5.5',description:'Danfoss FC102 HVAC Drive 5.5kW',reference:'131B4239',brand:'Danfoss',category:'Variadores HVAC',sector:'HVAC & Climatização',unit:'un',unit_cost:680.00,supplier:'Danfoss'},
  { id:'H005',code:'SN-SM-QFA2060',description:'Sensor Temp/Humidade Siemens QFA2060',reference:'S55720-S168',brand:'Siemens',category:'Sensores HVAC',sector:'HVAC & Climatização',unit:'un',unit_cost:68.00,supplier:'Siemens'},
  { id:'H006',code:'SN-SM-QAM2120',description:'Sensor Temperatura Conduta Siemens',reference:'S55720-S137',brand:'Siemens',category:'Sensores HVAC',sector:'HVAC & Climatização',unit:'un',unit_cost:45.00,supplier:'Siemens'},
  { id:'H007',code:'SN-SM-QBE2102',description:'Sensor Pressão Diferencial 0-500Pa',reference:'S55720-S114',brand:'Siemens',category:'Sensores HVAC',sector:'HVAC & Climatização',unit:'un',unit_cost:98.00,supplier:'Siemens'},
  { id:'H008',code:'VA-SM-VMP47',description:'Válvula Motorizada 2 Vias DN25',reference:'S55201-V138',brand:'Siemens',category:'Válvulas',sector:'HVAC & Climatização',unit:'un',unit_cost:128.00,supplier:'Siemens'},
  { id:'H009',code:'VA-SM-VMP47-40',description:'Válvula Motorizada 3 Vias DN40',reference:'S55201-V141',brand:'Siemens',category:'Válvulas',sector:'HVAC & Climatização',unit:'un',unit_cost:195.00,supplier:'Siemens'},
  { id:'H010',code:'AT-SM-GDB161',description:'Atuador Válvula Belimo GDB161',reference:'GDB161.1E',brand:'Belimo',category:'Atuadores',sector:'HVAC & Climatização',unit:'un',unit_cost:85.00,supplier:'Belimo'},
  { id:'H011',code:'AT-BL-LMB24A',description:'Atuador Comporta Belimo LMB24A',reference:'LMB24A',brand:'Belimo',category:'Atuadores',sector:'HVAC & Climatização',unit:'un',unit_cost:145.00,supplier:'Belimo'},
  { id:'H012',code:'TRM-HW-T6360',description:'Termostato Honeywell T6360 230V',reference:'T6360A1004',brand:'Honeywell',category:'Termostatos',sector:'HVAC & Climatização',unit:'un',unit_cost:35.00,supplier:'Honeywell'},
  { id:'H013',code:'CO2-SM-QPA2002',description:'Sensor CO2 Siemens QPA2002',reference:'S55720-S142',brand:'Siemens',category:'Sensores HVAC',sector:'HVAC & Climatização',unit:'un',unit_cost:185.00,supplier:'Siemens'},
];

// SECTOR: Energias Renováveis
export const renewableItems: CatalogItem[] = [
  { id:'R001',code:'INV-SMA-SB3.6',description:'Inversor Solar SMA Sunny Boy 3.6kW',reference:'SB3.6-1AV-40',brand:'SMA',category:'Inversores Solar',sector:'Energias Renováveis',unit:'un',unit_cost:780.00,supplier:'SMA Solar'},
  { id:'R002',code:'INV-SMA-SB6.0',description:'Inversor Solar SMA Sunny Boy 6.0kW',reference:'SB6.0-1SP-US-40',brand:'SMA',category:'Inversores Solar',sector:'Energias Renováveis',unit:'un',unit_cost:1080.00,supplier:'SMA Solar'},
  { id:'R003',code:'INV-FR-Symo10',description:'Inversor Trifásico Fronius Symo 10kW',reference:'43-0001-101',brand:'Fronius',category:'Inversores Solar',sector:'Energias Renováveis',unit:'un',unit_cost:1680.00,supplier:'Fronius'},
  { id:'R004',code:'INV-FR-Gen24-5',description:'Inversor Fronius GEN24 Plus 5kW',reference:'4210127',brand:'Fronius',category:'Inversores Solar',sector:'Energias Renováveis',unit:'un',unit_cost:1450.00,supplier:'Fronius'},
  { id:'R005',code:'INV-ABB-TRIO-8',description:'ABB TRIO-8.5-TL 8.5kW Trifásico',reference:'PVI-8.5-TL',brand:'ABB',category:'Inversores Solar',sector:'Energias Renováveis',unit:'un',unit_cost:1580.00,supplier:'ABB'},
  { id:'R006',code:'OPT-SMA-BOY25',description:'Otimizador SMA Energy Meter',reference:'EMETER-20',brand:'SMA',category:'Monitorização',sector:'Energias Renováveis',unit:'un',unit_cost:185.00,supplier:'SMA Solar'},
  { id:'R007',code:'PV-MONI-DL',description:'Data Logger Solar Fronius Datamanager',reference:'43-0001-192',brand:'Fronius',category:'Monitorização',sector:'Energias Renováveis',unit:'un',unit_cost:145.00,supplier:'Fronius'},
  { id:'R008',code:'MPPT-SC-SCC-60A',description:'Controlador MPPT Solar 60A 48V',reference:'SmartSolar-60/48',brand:'Victron Energy',category:'Carregadores',sector:'Energias Renováveis',unit:'un',unit_cost:285.00,supplier:'Victron Energy'},
  { id:'R009',code:'BAT-VE-LFP200',description:'Bateria LiFePO4 200Ah 24V Pylontech',reference:'US2000C',brand:'Pylontech',category:'Baterias',sector:'Energias Renováveis',unit:'un',unit_cost:980.00,supplier:'Pylontech'},
  { id:'R010',code:'INV-HYB-VE-5',description:'Inversor Híbrido Victron Quattro 5kVA',reference:'PMP052105100',brand:'Victron Energy',category:'Inversores Híbridos',sector:'Energias Renováveis',unit:'un',unit_cost:1850.00,supplier:'Victron Energy'},
  { id:'R011',code:'SUP-SC-DJ2P32',description:'Disjuntor DC 2P 32A FV',reference:'A9N61526',brand:'Schneider',category:'Proteção DC',sector:'Energias Renováveis',unit:'un',unit_cost:48.00,supplier:'Schneider Electric'},
  { id:'R012',code:'SUP-SC-SPD-DC',description:'Protecção Sobretensão DC 1000V',reference:'A9L15690',brand:'Schneider',category:'Proteção DC',sector:'Energias Renováveis',unit:'un',unit_cost:95.00,supplier:'Schneider Electric'},
];

// SECTOR: Telecomunicações & Redes
export const telecomItems: CatalogItem[] = [
  { id:'T001',code:'SW-CP-SG110D-8',description:'Switch Cisco SG110D-08 8P sem gerido',reference:'SG110D-08-EU',brand:'Cisco',category:'Switches',sector:'Telecomunicações & Redes',unit:'un',unit_cost:68.00,supplier:'Cisco'},
  { id:'T002',code:'SW-CP-SG350-28',description:'Switch Gerido Cisco SG350-28P 28P PoE',reference:'SG350-28P-K9-EU',brand:'Cisco',category:'Switches',sector:'Telecomunicações & Redes',unit:'un',unit_cost:580.00,supplier:'Cisco'},
  { id:'T003',code:'SW-HP-1920S-24',description:'Switch HPE 1920S 24P Gerido',reference:'JL381A',brand:'HP Enterprise',category:'Switches',sector:'Telecomunicações & Redes',unit:'un',unit_cost:420.00,supplier:'HP Enterprise'},
  { id:'T004',code:'AP-UB-U6LR',description:'Access Point Ubiquiti U6 Long Range WiFi6',reference:'U6-LR',brand:'Ubiquiti',category:'WiFi',sector:'Telecomunicações & Redes',unit:'un',unit_cost:185.00,supplier:'Ubiquiti'},
  { id:'T005',code:'PP-LC-1U24',description:'Patch Panel 24P CAT6 1U',reference:'PP-K24',brand:'Legrand',category:'Patch Panels',sector:'Telecomunicações & Redes',unit:'un',unit_cost:42.00,supplier:'Legrand'},
  { id:'T006',code:'CA-CAT6-GY',description:'Cabo de Rede CAT6 U/UTP Cinza (m)',reference:'CAT6-305M',brand:'Legrand',category:'Cabos de Rede',sector:'Telecomunicações & Redes',unit:'m',unit_cost:0.48,supplier:'Legrand'},
  { id:'T007',code:'CA-FO-SM',description:'Cabo Fibra Óptica SM 2F OS2 (m)',reference:'FO-SM-2F',brand:'Nexans',category:'Fibra Óptica',sector:'Telecomunicações & Redes',unit:'m',unit_cost:1.20,supplier:'Nexans'},
  { id:'T008',code:'ARM-RM-12U',description:'Armário Rede 12U 600x600 Fechado',reference:'RAK-12U',brand:'Legrand',category:'Armários',sector:'Telecomunicações & Redes',unit:'un',unit_cost:285.00,supplier:'Legrand'},
  { id:'T009',code:'ARM-RM-22U',description:'Armário Rede 22U 600x800 Fechado',reference:'RAK-22U',brand:'Legrand',category:'Armários',sector:'Telecomunicações & Redes',unit:'un',unit_cost:480.00,supplier:'Legrand'},
  { id:'T010',code:'FW-FT-60E',description:'Firewall Fortinet FortiGate 60E',reference:'FG-60E',brand:'Fortinet',category:'Firewalls',sector:'Telecomunicações & Redes',unit:'un',unit_cost:620.00,supplier:'Fortinet'},
  { id:'T011',code:'UPS-APC-1500',description:'UPS APC Smart-UPS 1500VA RM',reference:'SMT1500RMI2UC',brand:'APC',category:'UPS',sector:'Telecomunicações & Redes',unit:'un',unit_cost:780.00,supplier:'APC'},
  { id:'T012',code:'PDU-APC-8T',description:'PDU APC 1U 8 Tomadas',reference:'AP9505',brand:'APC',category:'PDUs',sector:'Telecomunicações & Redes',unit:'un',unit_cost:85.00,supplier:'APC'},
];

// SECTOR: Iluminação Técnica
export const lightingItems: CatalogItem[] = [
  { id:'L001',code:'DALI-LG-GW-88',description:'Gateway DALI KNX Legrand 88 endereços',reference:'048500',brand:'Legrand',category:'Controlo DALI',sector:'Iluminação Técnica',unit:'un',unit_cost:285.00,supplier:'Legrand'},
  { id:'L002',code:'DALI-HE-PRG225',description:'Programador DALI Helvar DIGIDIM 225',reference:'225-012',brand:'Helvar',category:'Controlo DALI',sector:'Iluminação Técnica',unit:'un',unit_cost:185.00,supplier:'Helvar'},
  { id:'L003',code:'DRIV-TRS-LCAI50',description:'Driver LED Tridonic LC 50W DALI',reference:'28000395',brand:'Tridonic',category:'Drivers LED',sector:'Iluminação Técnica',unit:'un',unit_cost:48.00,supplier:'Tridonic'},
  { id:'L004',code:'DRIV-TRS-LCAI75',description:'Driver LED Tridonic LC 75W DALI',reference:'28000396',brand:'Tridonic',category:'Drivers LED',sector:'Iluminação Técnica',unit:'un',unit_cost:65.00,supplier:'Tridonic'},
  { id:'L005',code:'SN-LG-0404B',description:'Detector Presença IR Tecto 360° 24V',reference:'048040',brand:'Legrand',category:'Detectores',sector:'Iluminação Técnica',unit:'un',unit_cost:42.00,supplier:'Legrand'},
  { id:'L006',code:'SN-LG-LUX',description:'Sensor Luminosidade DALI',reference:'048600',brand:'Legrand',category:'Detectores',sector:'Iluminação Técnica',unit:'un',unit_cost:55.00,supplier:'Legrand'},
  { id:'L007',code:'LED-EM-BL-300',description:'Bloco Autónomo Emergência LED 3h',reference:'EM-AL-300',brand:'Legrand',category:'Emergência',sector:'Iluminação Técnica',unit:'un',unit_cost:38.00,supplier:'Legrand'},
  { id:'L008',code:'PAINEL-LED-60',description:'Painel LED 600x600 40W 4000K DALI',reference:'PN-LED-40W',brand:'Philips',category:'Luminárias',sector:'Iluminação Técnica',unit:'un',unit_cost:58.00,supplier:'Philips'},
];
