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

  // Special character check (optional but recommended)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Calculate strength
  const criteria = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    hasSpecialChar,
    password.length >= 12
  ];

  const score = criteria.filter(Boolean).length;

  if (score >= 5) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
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