// Validation utilities for chatbot

// Spanish phone number validation
// Format: optional +34/0034/34 followed by 6-9 (mobile/landline) and 8 more digits
export const validateSpanishPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  const phoneRegex = /^(?:\+34|0034|34)?[6-9]\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

// Basic email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Extract phone from message
export const extractPhone = (message: string): string | null => {
  const phoneRegex = /(?:\+34|0034|34)?[\s\-]?[6-9][\d\s\-]{7,11}/g;
  const match = message.match(phoneRegex);
  if (match) {
    return match[0].replace(/[\s\-]/g, '');
  }
  return null;
};

// Extract email from message
export const extractEmail = (message: string): string | null => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const match = message.match(emailRegex);
  return match ? match[0] : null;
};

// Sanitize sensitive data (credit cards, etc.)
export const sanitizeMessage = (message: string): string => {
  // Remove potential credit card numbers (16 digits with optional spaces/dashes)
  let sanitized = message.replace(/\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g, '[DATOS REDACTADOS]');
  
  // Remove potential CVV (3-4 digits after credit card context)
  sanitized = sanitized.replace(/\b(cvv|cvc|csv)[\s:]*\d{3,4}\b/gi, '[DATOS REDACTADOS]');
  
  // Remove potential IBAN
  sanitized = sanitized.replace(/\b[A-Z]{2}\d{2}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{0,4}\b/gi, '[DATOS REDACTADOS]');
  
  return sanitized;
};

// Check if location is in coverage area
export const BIZKAIA_LOCATIONS = [
  'bilbao', 'getxo', 'las arenas', 'algorta', 'sopela', 'berango', 'urduliz', 
  'mungia', 'barakaldo', 'santurtzi', 'portugalete', 'erandio', 'leioa',
  'sestao', 'basauri', 'galdakao', 'durango', 'gernika', 'bermeo', 'plentzia',
  'gorliz', 'bakio', 'derio', 'zamudio', 'sondika', 'loiu', 'arrigorriaga',
  'etxebarri', 'bedia', 'lemoa', 'amorebieta', 'igorre'
];

export const ADJACENT_COVERAGE = [
  // Álava
  'vitoria', 'gasteiz', 'vitoria-gasteiz',
  // Gipuzkoa
  'donostia', 'san sebastián', 'san sebastian', 'eibar', 'zarautz', 'tolosa',
  // Cantabria
  'santander', 'castro urdiales', 'laredo', 'santoña',
  // Norte de Burgos
  'miranda de ebro', 'medina de pomar'
];

export const isInCoverageArea = (location: string): { inCoverage: boolean; isPrimary: boolean } => {
  const locationLower = location.toLowerCase();
  
  if (BIZKAIA_LOCATIONS.some(loc => locationLower.includes(loc))) {
    return { inCoverage: true, isPrimary: true };
  }
  
  if (ADJACENT_COVERAGE.some(loc => locationLower.includes(loc))) {
    return { inCoverage: true, isPrimary: false };
  }
  
  return { inCoverage: false, isPrimary: false };
};

// Extract location from message
export const extractLocation = (message: string): string | null => {
  const messageLower = message.toLowerCase();
  
  // Check Bizkaia locations first
  for (const location of BIZKAIA_LOCATIONS) {
    if (messageLower.includes(location)) {
      return location.charAt(0).toUpperCase() + location.slice(1);
    }
  }
  
  // Check adjacent areas
  for (const location of ADJACENT_COVERAGE) {
    if (messageLower.includes(location)) {
      return location.charAt(0).toUpperCase() + location.slice(1);
    }
  }
  
  return null;
};
