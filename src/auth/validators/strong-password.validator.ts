import { registerDecorator, ValidationOptions } from 'class-validator';

export interface StrongPasswordOptions {
  minLength?: number;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export function IsStrongPassword(
  options: StrongPasswordOptions = {},
  validationOptions?: ValidationOptions,
) {
  const {
    minLength = 8,
    requireLowercase = true,
    requireUppercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Check minimum length
          if (value.length < minLength) return false;

          // Check for common weak passwords
          const commonPasswords = [
            'password',
            '123456',
            '123456789',
            '12345678',
            'qwerty',
            'abc123',
            'password123',
            'admin',
            'letmein',
          ];
          if (commonPasswords.includes(value.toLowerCase())) return false;

          // Check character requirements
          if (requireLowercase && !/[a-z]/.test(value)) return false;
          if (requireUppercase && !/[A-Z]/.test(value)) return false;
          if (requireNumbers && !/\d/.test(value)) return false;
          if (
            requireSpecialChars &&
            !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
          )
            return false;

          return true;
        },
        defaultMessage() {
          const requirements = [];
          requirements.push(`at least ${minLength} characters long`);
          if (requireLowercase) requirements.push('one lowercase letter');
          if (requireUppercase) requirements.push('one uppercase letter');
          if (requireNumbers) requirements.push('one digit');
          if (requireSpecialChars) requirements.push('one special character');

          return `Password must be ${requirements.join(
            ', ',
          )} and cannot be a common password`;
        },
      },
    });
  };
}
