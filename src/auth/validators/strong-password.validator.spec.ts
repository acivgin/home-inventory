import { validate } from 'class-validator';
import { SignUpDTO } from '../dto/auth.dto';

describe('IsStrongPassword Validator', () => {
  it('should reject weak passwords', async () => {
    const dto = new SignUpDTO();
    dto.email = 'test@example.com';
    dto.password = '123456'; // Weak password

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');

    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints?.isStrongPassword).toContain(
      'Password must be',
    );
  });

  it('should reject common passwords', async () => {
    const dto = new SignUpDTO();
    dto.email = 'test@example.com';
    dto.password = 'password'; // Common password

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');

    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints?.isStrongPassword).toContain(
      'cannot be a common password',
    );
  });

  it('should accept strong passwords', async () => {
    const dto = new SignUpDTO();
    dto.email = 'test@example.com';
    dto.password = 'MyStr0ng!Pass'; // Strong password

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');

    expect(passwordError).toBeUndefined();
  });

  it('should reject passwords without special characters', async () => {
    const dto = new SignUpDTO();
    dto.email = 'test@example.com';
    dto.password = 'MyStrongPass1'; // No special character

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');

    expect(passwordError).toBeDefined();
  });

  it('should reject short passwords', async () => {
    const dto = new SignUpDTO();
    dto.email = 'test@example.com';
    dto.password = 'MyS1!'; // Too short

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');

    expect(passwordError).toBeDefined();
  });
});
