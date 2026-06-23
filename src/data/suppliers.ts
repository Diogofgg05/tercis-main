import type { CatalogItem } from '../types';
import { ALL_CATALOG_ITEMS } from './catalog';

// Supplier contact + metadata
export interface SupplierInfo {
  id: string;
  name: string;
  country: string;
  website: string;
  description: string;
  categories: string[];
  color: string;
}

export const SUPPLIER_INFO: SupplierInfo[] = [
  { id:'abb', name:'ABB', country:'Suíça', website:'https://abb.com', description:'Eletrotecnia, Automação, Drives, Robots', categories:['PLCs','Drives','Motores','Disjuntores','Transformadores'], color:'bg-red-50 border-red-200 text-red-800' },
  { id:'schneider', name:'Schneider Electric', country:'França', website:'https://se.com', description:'Gestão Energia, Automação, Proteção', categories:['PLCs','HMIs','Disjuntores','Contactores','HVAC'], color:'bg-green-50 border-green-200 text-green-800' },
  { id:'siemens', name:'Siemens', country:'Alemanha', website:'https://siemens.com', description:'Automação, Digitalização, Eletrotecnia', categories:['PLCs','HMIs','Drives','Proteção','Building Automation'], color:'bg-blue-50 border-blue-200 text-blue-800' },
  { id:'danfoss', name:'Danfoss', country:'Dinamarca', website:'https://danfoss.com', description:'Drives, HVAC, Refrigeração, Hidráulica', categories:['Drives','HVAC','Inversores'], color:'bg-orange-50 border-orange-200 text-orange-800' },
  { id:'omron', name:'Omron', country:'Japão', website:'https://omron.com', description:'Automação, Robótica, Segurança, Sensores', categories:['PLCs','Sensores','Safety','HMIs'], color:'bg-slate-50 border-slate-200 text-slate-800' },
  { id:'phoenixcontact', name:'Phoenix Contact', country:'Alemanha', website:'https://phoenixcontact.com', description:'Bornes, I/O, Alimentações, Conectores', categories:['Bornes','I/O Modules','Fontes Alimentação'], color:'bg-orange-50 border-orange-200 text-orange-800' },
  { id:'legrand', name:'Legrand', country:'França', website:'https://legrand.pt', description:'Distribuição Elétrica, Redes, Iluminação', categories:['Diferenciais','Armários','Redes','DALI'], color:'bg-slate-50 border-slate-200 text-slate-800' },
  { id:'endresshauser', name:'Endress+Hauser', country:'Suíça', website:'https://endress.com', description:'Instrumentação de Processo, Análise', categories:['Pressão','Temperatura','Caudal','Nível'], color:'bg-teal-50 border-teal-200 text-teal-800' },
  { id:'festo', name:'Festo', country:'Alemanha', website:'https://festo.com', description:'Pneumática, Elétrica, Robótica', categories:['Válvulas','Cilindros','Sensores Pneumáticos'], color:'bg-blue-50 border-blue-200 text-blue-800' },
  { id:'hikvision', name:'Hikvision', country:'China', website:'https://hikvision.com', description:'Video Vigilância, Controlo Acesso, Alarme', categories:['Câmaras IP','NVRs','Controlo Acesso'], color:'bg-red-50 border-red-200 text-red-800' },
];

// Mock API: simulate fetching fresh prices from supplier systems
export async function fetchSupplierItems(supplierId: string): Promise<CatalogItem[]> {
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));

  const supplier = SUPPLIER_INFO.find((s) => s.id === supplierId);
  if (!supplier) return [];

  // Simulate price update: return items with slight price variation (+/- 5%)
  const items = ALL_CATALOG_ITEMS.filter(
    (item) => item.supplier.toLowerCase().replace(/\s/g, '').includes(supplierId.replace(/\s/g, ''))
      || item.brand.toLowerCase().replace(/\s/g, '').includes(supplierId.replace(/\s/g, ''))
  );

  return items.map((item) => ({
    ...item,
    unit_cost: parseFloat((item.unit_cost * (0.97 + Math.random() * 0.06)).toFixed(2)),
  }));
}
