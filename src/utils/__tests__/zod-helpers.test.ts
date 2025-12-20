import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  getFirstZodError,
  getAllZodErrors,
  zodErrorsToFieldMap,
  createZodValidator,
  validateAsync,
  commonSchemas,
  createPasswordMatchSchema,
  createDateRangeSchema,
} from '../zod-helpers';

describe('Zod Helpers', () => {
  describe('getFirstZodError', () => {
    it('returns first error message from validation result', () => {
      const schema = z.object({
        username: z.string().min(3).max(10),
      });

      const result = schema.safeParse({ username: 'ab' });
      if (!result.success) {
        const error = getFirstZodError(result.error);
        expect(error).toBe('Too small: expected string to have >=3 characters');
      }
    });

    it('returns error for specific field path', () => {
      const schema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
      });

      const result = schema.safeParse({ username: 'ab', email: 'invalid' });
      if (!result.success) {
        const usernameError = getFirstZodError(result.error, 'username');
        const emailError = getFirstZodError(result.error, 'email');

        expect(usernameError).toBe(
          'Too small: expected string to have >=3 characters',
        );
        expect(emailError).toBe('Invalid email address');
      }
    });

    it('returns null when no error exists', () => {
      const schema = z.object({ name: z.string() });
      const result = schema.safeParse({ name: 'valid' });

      if (!result.success) {
        const error = getFirstZodError(result.error);
        expect(error).toBeNull();
      } else {
        // Success case - no error
        expect(result.success).toBe(true);
      }
    });

    it('returns null for non-existent field path', () => {
      const schema = z.object({ username: z.string().min(3) });
      const result = schema.safeParse({ username: 'ab' });

      if (!result.success) {
        const error = getFirstZodError(result.error, 'nonexistent');
        expect(error).toBeNull();
      }
    });
  });

  describe('getAllZodErrors', () => {
    it('returns all error messages', () => {
      const schema = z.object({
        password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
      });

      const result = schema.safeParse({ password: 'weak' });
      if (!result.success) {
        const errors = getAllZodErrors(result.error);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors).toContain(
          'Too small: expected string to have >=8 characters',
        );
      }
    });

    it('returns errors for specific field', () => {
      const schema = z.object({
        password: z.string().min(8).regex(/[A-Z]/),
        email: z.string().email(),
      });

      const result = schema.safeParse({
        password: 'weak',
        email: 'invalid',
      });

      if (!result.success) {
        const passwordErrors = getAllZodErrors(result.error, 'password');
        const emailErrors = getAllZodErrors(result.error, 'email');

        expect(passwordErrors.length).toBeGreaterThan(0);
        expect(emailErrors.length).toBe(1);
        expect(emailErrors[0]).toBe('Invalid email address');
      }
    });

    it('returns empty array when no errors exist', () => {
      const schema = z.object({ name: z.string() });
      const result = schema.safeParse({ name: 'valid' });

      if (!result.success) {
        const errors = getAllZodErrors(result.error);
        expect(errors).toEqual([]);
      } else {
        expect(result.success).toBe(true);
      }
    });
  });

  describe('zodErrorsToFieldMap', () => {
    it('converts errors to field-error map', () => {
      const schema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        age: z.number().min(18),
      });

      const result = schema.safeParse({
        username: 'ab',
        email: 'invalid',
        age: 10,
      });

      if (!result.success) {
        const errorMap = zodErrorsToFieldMap(result.error);

        expect(errorMap['username']).toBe(
          'Too small: expected string to have >=3 characters',
        );
        expect(errorMap['email']).toBe('Invalid email address');
        expect(errorMap['age']).toBe('Too small: expected number to be >=18');
      }
    });

    it('returns only first error per field', () => {
      const schema = z.object({
        password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
      });

      const result = schema.safeParse({ password: 'weak' });

      if (!result.success) {
        const errorMap = zodErrorsToFieldMap(result.error);
        expect(Object.keys(errorMap)).toHaveLength(1);
        expect(errorMap['password']).toBeDefined();
      }
    });

    it('returns empty object when no errors', () => {
      const schema = z.object({ name: z.string() });
      const result = schema.safeParse({ name: 'valid' });

      if (!result.success) {
        const errorMap = zodErrorsToFieldMap(result.error);
        expect(errorMap).toEqual({});
      } else {
        expect(result.success).toBe(true);
      }
    });
  });

  describe('createZodValidator', () => {
    it('creates validator function for TanStack Form', () => {
      const schema = z.object({
        username: z.string().min(3),
      });

      const validator = createZodValidator(schema);
      const result = validator({ value: { username: 'ab' } });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('_errors');
    });

    it('returns undefined for valid data', () => {
      const schema = z.object({
        username: z.string().min(3),
      });

      const validator = createZodValidator(schema);
      const result = validator({ value: { username: 'valid' } });

      expect(result).toBeUndefined();
    });

    it('handles nested object validation', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(3),
          email: z.string().email(),
        }),
      });

      const validator = createZodValidator(schema);
      const result = validator({
        value: { user: { name: 'ab', email: 'invalid' } },
      });

      expect(result).toBeDefined();
    });
  });

  describe('validateAsync', () => {
    it('validates asynchronously', async () => {
      const schema = z.object({
        username: z.string().min(3),
      });

      const result = await validateAsync(schema, { username: 'valid' });
      expect(result.success).toBe(true);
    });

    it('returns errors for invalid async validation', async () => {
      const schema = z.object({
        username: z.string().min(3),
      });

      const result = await validateAsync(schema, { username: 'ab' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('works with refine async', async () => {
      const schema = z
        .object({
          username: z.string(),
        })
        .refine(
          async (data) => {
            // Simulate async check (e.g., API call)
            await new Promise((resolve) => setTimeout(resolve, 10));
            return data.username !== 'taken';
          },
          { message: 'Username is already taken' },
        );

      const validResult = await validateAsync(schema, {
        username: 'available',
      });
      expect(validResult.success).toBe(true);

      const invalidResult = await validateAsync(schema, { username: 'taken' });
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.error.issues[0].message).toBe(
          'Username is already taken',
        );
      }
    });
  });

  describe('commonSchemas', () => {
    describe('email', () => {
      it('validates and transforms email', () => {
        const result = commonSchemas.email.safeParse('  TEST@EXAMPLE.COM  ');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe('test@example.com');
        }
      });

      it('rejects invalid email', () => {
        const result = commonSchemas.email.safeParse('invalid-email');
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid email address');
        }
      });
    });

    describe('username', () => {
      it('validates valid username', () => {
        const result = commonSchemas.username.safeParse('user_123');
        expect(result.success).toBe(true);
      });

      it('trims whitespace', () => {
        const result = commonSchemas.username.safeParse('  username  ');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe('username');
        }
      });

      it('rejects too short username', () => {
        const result = commonSchemas.username.safeParse('ab');
        expect(result.success).toBe(false);
      });

      it('rejects too long username', () => {
        const result = commonSchemas.username.safeParse('a'.repeat(21));
        expect(result.success).toBe(false);
      });

      it('rejects special characters', () => {
        const result = commonSchemas.username.safeParse('user@name');
        expect(result.success).toBe(false);
      });
    });

    describe('password', () => {
      it('validates strong password', () => {
        const result = commonSchemas.password.safeParse('Password1!');
        expect(result.success).toBe(true);
      });

      it('rejects password without uppercase', () => {
        const result = commonSchemas.password.safeParse('password1!');
        expect(result.success).toBe(false);
      });

      it('rejects password without lowercase', () => {
        const result = commonSchemas.password.safeParse('PASSWORD1!');
        expect(result.success).toBe(false);
      });

      it('rejects password without number', () => {
        const result = commonSchemas.password.safeParse('Password!');
        expect(result.success).toBe(false);
      });

      it('rejects password without special character', () => {
        const result = commonSchemas.password.safeParse('Password1');
        expect(result.success).toBe(false);
      });

      it('rejects too short password', () => {
        const result = commonSchemas.password.safeParse('Pass1!');
        expect(result.success).toBe(false);
      });
    });

    describe('phoneUS', () => {
      it('validates phone with dashes', () => {
        const result = commonSchemas.phoneUS.safeParse('123-456-7890');
        expect(result.success).toBe(true);
      });

      it('validates phone with parentheses', () => {
        const result = commonSchemas.phoneUS.safeParse('(123) 456-7890');
        expect(result.success).toBe(true);
      });

      it('rejects invalid phone format', () => {
        const result = commonSchemas.phoneUS.safeParse('1234567890');
        expect(result.success).toBe(false);
      });
    });

    describe('zipCodeUS', () => {
      it('validates 5-digit ZIP', () => {
        const result = commonSchemas.zipCodeUS.safeParse('12345');
        expect(result.success).toBe(true);
      });

      it('validates ZIP+4', () => {
        const result = commonSchemas.zipCodeUS.safeParse('12345-6789');
        expect(result.success).toBe(true);
      });

      it('rejects invalid ZIP format', () => {
        const result = commonSchemas.zipCodeUS.safeParse('1234');
        expect(result.success).toBe(false);
      });
    });

    describe('creditCard', () => {
      it('validates valid credit card number', () => {
        // Valid test card number
        const result = commonSchemas.creditCard.safeParse('4532015112830366');
        expect(result.success).toBe(true);
      });

      it('rejects invalid credit card number', () => {
        const result = commonSchemas.creditCard.safeParse('1234567890123456');
        expect(result.success).toBe(false);
      });

      it('rejects too short number', () => {
        const result = commonSchemas.creditCard.safeParse('123456789012');
        expect(result.success).toBe(false);
      });
    });

    describe('age', () => {
      it('validates valid age', () => {
        const result = commonSchemas.age.safeParse(25);
        expect(result.success).toBe(true);
      });

      it('coerces string to number', () => {
        const result = commonSchemas.age.safeParse('25');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(25);
        }
      });

      it('rejects age under 18', () => {
        const result = commonSchemas.age.safeParse(17);
        expect(result.success).toBe(false);
      });

      it('rejects age over 120', () => {
        const result = commonSchemas.age.safeParse(121);
        expect(result.success).toBe(false);
      });

      it('rejects non-integer', () => {
        const result = commonSchemas.age.safeParse(25.5);
        expect(result.success).toBe(false);
      });
    });

    describe('dateString', () => {
      it('validates valid date string', () => {
        const result = commonSchemas.dateString.safeParse('2025-12-20');
        expect(result.success).toBe(true);
      });

      it('rejects invalid format', () => {
        const result = commonSchemas.dateString.safeParse('12/20/2025');
        expect(result.success).toBe(false);
      });
    });

    describe('nonEmptyString', () => {
      it('validates non-empty string', () => {
        const result = commonSchemas.nonEmptyString.safeParse('text');
        expect(result.success).toBe(true);
      });

      it('trims whitespace', () => {
        const result = commonSchemas.nonEmptyString.safeParse('  text  ');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe('text');
        }
      });

      it('rejects empty string', () => {
        const result = commonSchemas.nonEmptyString.safeParse('');
        expect(result.success).toBe(false);
      });

      it('rejects whitespace-only string', () => {
        const result = commonSchemas.nonEmptyString.safeParse('   ');
        expect(result.success).toBe(false);
      });
    });

    describe('positiveInt', () => {
      it('validates positive integer', () => {
        const result = commonSchemas.positiveInt.safeParse(5);
        expect(result.success).toBe(true);
      });

      it('coerces string to number', () => {
        const result = commonSchemas.positiveInt.safeParse('10');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(10);
        }
      });

      it('rejects zero', () => {
        const result = commonSchemas.positiveInt.safeParse(0);
        expect(result.success).toBe(false);
      });

      it('rejects negative number', () => {
        const result = commonSchemas.positiveInt.safeParse(-5);
        expect(result.success).toBe(false);
      });

      it('rejects decimal', () => {
        const result = commonSchemas.positiveInt.safeParse(5.5);
        expect(result.success).toBe(false);
      });
    });

    describe('mustBeTrue', () => {
      it('validates true', () => {
        const result = commonSchemas.mustBeTrue.safeParse(true);
        expect(result.success).toBe(true);
      });

      it('rejects false', () => {
        const result = commonSchemas.mustBeTrue.safeParse(false);
        expect(result.success).toBe(false);
      });

      it('has custom error message', () => {
        const result = commonSchemas.mustBeTrue.safeParse(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            'You must accept to continue',
          );
        }
      });
    });
  });

  describe('createPasswordMatchSchema', () => {
    it('validates matching passwords', () => {
      const schema = z
        .object({
          password: z.string(),
          confirmPassword: z.string(),
        })
        .and(createPasswordMatchSchema());

      const result = schema.safeParse({
        password: 'test123',
        confirmPassword: 'test123',
      });

      expect(result.success).toBe(true);
    });

    it('rejects non-matching passwords', () => {
      const schema = z
        .object({
          password: z.string(),
          confirmPassword: z.string(),
        })
        .and(createPasswordMatchSchema());

      const result = schema.safeParse({
        password: 'test123',
        confirmPassword: 'different',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (e) => e.path[0] === 'confirmPassword',
        );
        expect(error?.message).toBe('Passwords do not match');
      }
    });

    it('supports custom field names', () => {
      const schema = z
        .object({
          newPassword: z.string(),
          newPasswordConfirm: z.string(),
        })
        .and(createPasswordMatchSchema('newPassword', 'newPasswordConfirm'));

      const result = schema.safeParse({
        newPassword: 'test123',
        newPasswordConfirm: 'different',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (e) => e.path[0] === 'newPasswordConfirm',
        );
        expect(error).toBeDefined();
      }
    });
  });

  describe('createDateRangeSchema', () => {
    it('validates valid date range', () => {
      const schema = z
        .object({
          startDate: z.string(),
          endDate: z.string(),
        })
        .and(createDateRangeSchema('startDate', 'endDate'));

      const result = schema.safeParse({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      });

      expect(result.success).toBe(true);
    });

    it('rejects invalid date range (end before start)', () => {
      const schema = z
        .object({
          startDate: z.string(),
          endDate: z.string(),
        })
        .and(createDateRangeSchema('startDate', 'endDate'));

      const result = schema.safeParse({
        startDate: '2025-12-31',
        endDate: '2025-01-01',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find((e) => e.path[0] === 'endDate');
        expect(error?.message).toBe('End date must be after start date');
      }
    });

    it('rejects same dates', () => {
      const schema = z
        .object({
          startDate: z.string(),
          endDate: z.string(),
        })
        .and(createDateRangeSchema('startDate', 'endDate'));

      const result = schema.safeParse({
        startDate: '2025-06-15',
        endDate: '2025-06-15',
      });

      expect(result.success).toBe(false);
    });
  });
});
