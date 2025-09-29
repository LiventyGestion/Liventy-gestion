// Security utilities for input validation and sanitization

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  // Minimum length check
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }

  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  // Special character check (required for strong passwords)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (!hasSpecialChar) {
    errors.push('Debe contener al menos un carácter especial');
  }

  // Check for common patterns
  if (/(123|abc|password|admin|user)/i.test(password)) {
    errors.push('No debe contener patrones comunes');
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('No debe tener más de 2 caracteres repetidos consecutivos');
  }

  // Calculate strength
  const criteria = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    hasSpecialChar,
    password.length >= 12,
    !/(123|abc|password|admin|user)/i.test(password),
    !/(.)\1{2,}/.test(password)
  ];

  const score = criteria.filter(Boolean).length;

  if (score >= 6) {
    strength = 'strong';
  } else if (score >= 4) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0 && score >= 5, // Raised minimum requirement
    errors,
    strength
  };
};

// Enhanced password strength validation with detailed feedback
export const validatePasswordStrength = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNoCommonPatterns = !/(123|abc|password|admin|user)/i.test(password);
  const hasNoRepeatedChars = !/(.)\1{2,}/.test(password);

  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    hasNoCommonPatterns,
    hasNoRepeatedChars,
    password.length >= 12
  ].reduce((acc, curr) => acc + (curr ? 1 : 0), 0);

  let strength = '';
  let color = '';
  
  if (score < 4) {
    strength = 'Muy Débil';
    color = 'text-red-600';
  } else if (score < 6) {
    strength = 'Débil';
    color = 'text-red-500';
  } else if (score < 7) {
    strength = 'Media';
    color = 'text-yellow-500';
  } else if (score < 8) {
    strength = 'Fuerte';
    color = 'text-green-500';
  } else {
    strength = 'Muy Fuerte';
    color = 'text-green-600';
  }

  const requirements = [
    { met: password.length >= minLength, text: `Mínimo ${minLength} caracteres` },
    { met: hasUpperCase, text: 'Una mayúscula' },
    { met: hasLowerCase, text: 'Una minúscula' },
    { met: hasNumbers, text: 'Un número' },
    { met: hasSpecialChar, text: 'Un carácter especial' },
    { met: hasNoCommonPatterns, text: 'Sin patrones comunes' },
    { met: hasNoRepeatedChars, text: 'Sin caracteres repetidos' }
  ];

  return { 
    score, 
    strength, 
    color, 
    isValid: score >= 5,
    requirements 
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim().substring(0, 254);
};

export const sanitizeName = (name: string): string => {
  return name
    .trim()
    .replace(/[<>\/\\]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 100); // Limit length
};

// Enhanced Rate limiting utility class with IP tracking
export class RateLimiter {
  private attempts = new Map<string, { count: number; firstAttempt: number; lastAttempt: number }>();
  
  isAllowed(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const existing = this.attempts.get(identifier);
    
    // Clean up old entries
    this.cleanup(now, windowMs);
    
    if (!existing) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now, lastAttempt: now });
      return true;
    }
    
    // Check if window has expired
    if (now - existing.firstAttempt > windowMs) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now, lastAttempt: now });
      return true;
    }
    
    // Check if under limit
    if (existing.count < maxAttempts) {
      existing.count++;
      existing.lastAttempt = now;
      return true;
    }
    
    return false;
  }
  
  getRemainingTime(identifier: string, windowMs: number = 15 * 60 * 1000): number {
    const existing = this.attempts.get(identifier);
    if (!existing) return 0;
    
    const remaining = windowMs - (Date.now() - existing.firstAttempt);
    return Math.max(0, remaining);
  }
  
  private cleanup(now: number, windowMs: number): void {
    for (const [key, value] of this.attempts.entries()) {
      if (now - value.firstAttempt > windowMs) {
        this.attempts.delete(key);
      }
    }
  }
}

// Enhanced security utilities
export const getClientIP = (): string => {
  // Try to get the real IP from various headers in order of preference
  if (typeof window !== 'undefined') {
    // In browser environment, we can't directly get the IP
    // This would need to be handled on the server side
    return 'client-browser';
  }
  return 'unknown';
};

export const logSecurityEvent = async (
  eventType: string,
  details: any,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
) => {
  try {
    // This would typically call the SecurityMonitor utility
    console.log(`Security Event [${severity.toUpperCase()}]: ${eventType}`, details);
    
    // In a real implementation, you might want to:
    // await SecurityMonitor.logSecurityEvent(eventType, details, severity);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export const detectSuspiciousPattern = (
  events: Array<{ timestamp: number; type: string; identifier: string }>
): boolean => {
  if (events.length < 3) return false;
  
  // Check for rapid succession of events from same identifier
  const recentEvents = events.filter(e => Date.now() - e.timestamp < 60000); // Last minute
  const identifierGroups = recentEvents.reduce((acc, event) => {
    acc[event.identifier] = (acc[event.identifier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Flag if any identifier has more than 5 events in the last minute
  return Object.values(identifierGroups).some(count => count > 5);
};

export const enhancedInputSanitization = (input: string, options: {
  allowHTML?: boolean;
  maxLength?: number;
  removeScripts?: boolean;
} = {}): string => {
  const {
    allowHTML = false,
    maxLength = 1000,
    removeScripts = true
  } = options;
  
  let sanitized = input.trim();
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  if (!allowHTML) {
    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  if (removeScripts) {
    // Remove javascript: protocols and event handlers
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+=/gi, '');
  }
  
  // Remove null bytes and other dangerous characters
  sanitized = sanitized.replace(/\0/g, '');
  sanitized = sanitized.replace(/\x00/g, '');
  
  return sanitized;
};

// Role-based access control utilities
export const hasRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

export const isAdmin = (userRole: string): boolean => {
  return userRole === 'admin';
};

export const canAccessAdminFeatures = (userRole: string): boolean => {
  return hasRole(userRole, ['admin']);
};

// Enhanced security validation
export const validateEmailDomain = (email: string): boolean => {
  const suspiciousDomains = [
    'disposablemail.com', 'tempmail.org', '10minutemail.com', 
    'guerrillamail.com', 'mailinator.com', 'throwaway.email'
  ];
  
  const domain = email.split('@')[1];
  return !suspiciousDomains.includes(domain?.toLowerCase());
};

export const detectSuspiciousActivity = (userAgent: string, ipAddress?: string): boolean => {
  const suspiciousPatterns = [
    /bot/i, /crawler/i, /scraper/i, /spider/i, /automated/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
};

// Session security
export const validateSessionToken = (token: string): boolean => {
  if (!token || token.length < 16) return false;
  
  // Check for suspicious patterns in session tokens
  const suspiciousPatterns = [
    /^[0]{10,}/, // Too many zeros
    /^[1]{10,}/, // Too many ones
    /(.)\1{10,}/ // Too many repeated characters
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(token));
};