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

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number }> = new Map();

  isAllowed(identifier: string, maxAttempts: number = 5, windowMs: number = 3600000): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - record.firstAttempt > windowMs) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return true;
    }

    // Check if under limit
    if (record.count < maxAttempts) {
      record.count++;
      return true;
    }

    return false;
  }

  getRemainingTime(identifier: string, windowMs: number = 3600000): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;

    const elapsed = Date.now() - record.firstAttempt;
    return Math.max(0, windowMs - elapsed);
  }
}