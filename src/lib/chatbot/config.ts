// Chatbot Configuration - URLs will be configured via secrets later
export const CHATBOT_CONFIG = {
  // Brand data
  brand: {
    name: "Liventy Gestión",
    phone: "944 397 330",
    email: "contacto@liventygestion.com",
    coverage: ["Bizkaia", "Álava", "Gipuzkoa", "Cantabria", "Norte de Burgos"],
    coverageMain: "Bizkaia"
  },
  
  // URLs - Use placeholders, will be configured via environment
  urls: {
    propietarios: "/propietarios",
    inquilinos: "/inquilinos",
    contacto: "/contacto",
    herramientas: "/herramientas",
    calendly: "https://calendly.com/liventygestion/llamada-15", // Placeholder
    whatsapp: "https://wa.me/34944397330?text=Hola%20Liventy%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre...", // Placeholder
  },
  
  // Webhooks - Placeholders
  webhooks: {
    n8n: "", // Will be configured via secrets
  },
  
  // Quick replies for the chatbot
  quickReplies: [
    { id: "owner", label: "Soy propietario", intent: "OWNER_PROSPECT" },
    { id: "tenant", label: "Soy inquilino", intent: "TENANT_PROSPECT" },
    { id: "company", label: "Empresa (temporal)", intent: "COMPANY" },
    { id: "pricing", label: "Precios", intent: "PRICING" },
    { id: "process", label: "Cómo trabajáis", intent: "PROCESS" },
    { id: "coverage", label: "Zonas", intent: "COVERAGE" },
  ],
  
  // CTAs
  ctas: {
    valuation: "Valora tu piso gratis",
    schedule: "Agenda una llamada de 15'",
    whatsapp: "Habla por WhatsApp",
  },
  
  // Pricing info
  pricing: {
    start: { name: "Start", price: "1 mensualidad + IVA" },
    full: { name: "Full", price: "8% mensual + IVA (mín. 80€)" },
    corporate: { name: "Corporate", price: "10% mensual o por proyecto" },
    home: { name: "Home (larga)", price: "500€ + IVA" },
  },
  
  // Working hours
  workingHours: {
    weekdays: { start: 9, end: 19 },
    saturday: { start: 10, end: 14 },
    sunday: null,
  },
  
  // Scheduling slots
  defaultSlots: [
    { label: "Hoy 17-19h", value: "hoy_tarde" },
    { label: "Mañana 10-12h", value: "manana_manana" },
  ],
};

// Intent types
export type ChatIntent = 
  | "OWNER_PROSPECT" 
  | "TENANT_PROSPECT" 
  | "COMPANY" 
  | "PRICING" 
  | "PROCESS" 
  | "LEGAL_FAQ" 
  | "COVERAGE" 
  | "SUPPORT" 
  | "GREETING"
  | "OTHER";

// Lead schema
export interface ChatLead {
  nombre?: string;
  email?: string;
  telefono?: string;
  persona_tipo: "propietario" | "inquilino" | "empresa";
  municipio?: string;
  barrio?: string;
  m2?: number;
  habitaciones?: number;
  estado_vivienda?: string;
  fecha_disponible?: string;
  presupuesto_renta?: number;
  canal_preferido?: "llamada" | "whatsapp" | "email";
  franja_horaria?: string;
  comentarios?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  page?: string;
  consent: boolean;
  score: number;
}

// Scoring rules for owners
export const OWNER_SCORING = {
  bizkaiaLocation: 2,
  availableWithin30Days: 2,
  fullManagement: 2,
  qualifyingThreshold: 4,
};
