import type { CatalogItem } from '../types';
import { electricalItems } from './electricalCatalog';
import { automationItems } from './automationCatalog';
import { hvacItems, renewableItems, telecomItems, lightingItems } from './industrialCatalog';
import { securityItems, instrumentationItems, hydraulicsItems, laborItems } from './otherCatalog';

export const ALL_CATALOG_ITEMS: CatalogItem[] = [
  ...electricalItems,
  ...automationItems,
  ...hvacItems,
  ...renewableItems,
  ...telecomItems,
  ...lightingItems,
  ...securityItems,
  ...instrumentationItems,
  ...hydraulicsItems,
  ...laborItems,
];

export const SECTORS = [
  { id: 'Eletricidade Industrial', label: 'Eletricidade Industrial', color: 'bg-blue-100 text-blue-800', icon: '⚡' },
  { id: 'Automação Industrial', label: 'Automação Industrial', color: 'bg-violet-100 text-violet-800', icon: '🤖' },
  { id: 'HVAC & Climatização', label: 'HVAC & Climatização', color: 'bg-sky-100 text-sky-800', icon: '❄️' },
  { id: 'Energias Renováveis', label: 'Energias Renováveis', color: 'bg-emerald-100 text-emerald-800', icon: '☀️' },
  { id: 'Telecomunicações & Redes', label: 'Telecomunicações & Redes', color: 'bg-orange-100 text-orange-800', icon: '📡' },
  { id: 'Iluminação Técnica', label: 'Iluminação Técnica', color: 'bg-yellow-100 text-yellow-800', icon: '💡' },
  { id: 'Segurança & CCTV', label: 'Segurança & CCTV', color: 'bg-red-100 text-red-800', icon: '📷' },
  { id: 'Instrumentação & Controlo', label: 'Instrumentação & Controlo', color: 'bg-teal-100 text-teal-800', icon: '📊' },
  { id: 'Hidráulica & Pneumática', label: 'Hidráulica & Pneumática', color: 'bg-cyan-100 text-cyan-800', icon: '🔧' },
  { id: 'Serviços', label: 'Serviços & Mão de Obra', color: 'bg-slate-100 text-slate-700', icon: '👷' },
];

export const SECTOR_IDS = SECTORS.map((s) => s.id);

export function getSector(id: string) {
  return SECTORS.find((s) => s.id === id) ?? SECTORS[0];
}

export const SUPPLIERS = [
  'ABB', 'APC', 'Belimo', 'Bosch Rexroth', 'Bosch Security', 'Cisco',
  'Danfoss', 'DSC', 'Endress+Hauser', 'Festo', 'Fortinet', 'Fronius',
  'Gewiss', 'Hager', 'Heidenhain', 'Helvar', 'Hikvision', 'Honeywell',
  'HP Enterprise', 'IFM Electronic', 'Legrand', 'Nexans', 'Omron',
  'Parker', 'Philips', 'Phoenix Contact', 'Pylontech', 'Rittal',
  'Schneider Electric', 'SEW-Eurodrive', 'Sick', 'Siemens', 'SMA Solar',
  'Tridonic', 'Ubiquiti', 'Victron Energy', 'Wago', 'Weidmuller', 'Wika',
];
