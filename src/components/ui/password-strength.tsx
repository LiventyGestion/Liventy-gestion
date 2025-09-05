import React from 'react';
import { cn } from '@/lib/utils';
import { validatePassword, PasswordValidation } from '@/utils/security';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  className 
}) => {
  const validation: PasswordValidation = validatePassword(password);

  if (!password) return null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'Fuerte';
      case 'medium':
        return 'Media';
      default:
        return 'Débil';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              getStrengthColor(validation.strength)
            )}
            style={{
              width: validation.strength === 'strong' ? '100%' : 
                     validation.strength === 'medium' ? '66%' : '33%'
            }}
          />
        </div>
        <span className={cn(
          'text-sm font-medium',
          validation.strength === 'strong' ? 'text-green-600' :
          validation.strength === 'medium' ? 'text-yellow-600' : 'text-red-600'
        )}>
          {getStrengthText(validation.strength)}
        </span>
      </div>
      
      {validation.errors.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {validation.errors.map((error, index) => (
            <li key={index} className="flex items-center space-x-1">
              <span className="text-red-500">•</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};