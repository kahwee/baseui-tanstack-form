/**
 * Zod validation utilities for improved error handling
 *
 * This module provides helper functions for better integration between
 * Zod validation and TanStack Form, with improved error messages and
 * developer experience.
 */

import { z } from 'zod';

/**
 * Extract the first error message from a Zod validation result
 *
 * Zod can return multiple errors for a single field. This function
 * extracts the first (most relevant) error message for display.
 *
 * @param error - The Zod error object
 * @param path - Optional path to a specific field
 * @returns The first error message as a string, or null if no error
 *
 * @example
 * ```ts
 * const result = schema.safeParse(data);
 * if (!result.success) {
 *   const message = getFirstZodError(result.error, 'username');
 *   // Returns: "Username must be at least 3 characters"
 * }
 * ```
 */
export function getFirstZodError(
  error: z.ZodError,
  path?: string,
): string | null {
  if (path) {
    // Get errors for specific field
    const fieldErrors = error.issues.filter((err) =>
      err.path.join('.').startsWith(path),
    );
    return fieldErrors[0]?.message ?? null;
  }

  // Get first error overall
  return error.issues[0]?.message ?? null;
}

/**
 * Get all error messages from a Zod validation result
 *
 * Returns an array of all error messages, useful for displaying
 * multiple validation errors at once.
 *
 * @param error - The Zod error object
 * @param path - Optional path to a specific field
 * @returns Array of error messages
 *
 * @example
 * ```ts
 * const result = schema.safeParse(data);
 * if (!result.success) {
 *   const messages = getAllZodErrors(result.error, 'password');
 *   // Returns: ["Password must contain uppercase", "Password must contain number"]
 * }
 * ```
 */
export function getAllZodErrors(error: z.ZodError, path?: string): string[] {
  if (path) {
    return error.issues
      .filter((err) => err.path.join('.').startsWith(path))
      .map((err) => err.message);
  }

  return error.issues.map((err) => err.message);
}

/**
 * Convert Zod errors to a field-error map
 *
 * Transforms Zod validation errors into a simple object mapping
 * field paths to their first error message. Useful for bulk error display.
 *
 * @param error - The Zod error object
 * @returns Object mapping field paths to error messages
 *
 * @example
 * ```ts
 * const result = schema.safeParse(data);
 * if (!result.success) {
 *   const errorMap = zodErrorsToFieldMap(result.error);
 *   // Returns: { username: "Too short", email: "Invalid email" }
 * }
 * ```
 */
export function zodErrorsToFieldMap(error: z.ZodError): Record<string, string> {
  const errorMap: Record<string, string> = {};

  for (const err of error.issues) {
    const path = err.path.join('.');
    if (path && !errorMap[path]) {
      errorMap[path] = err.message;
    }
  }

  return errorMap;
}

/**
 * Create a TanStack Form validator from a Zod schema
 *
 * Generates a validator function that integrates seamlessly with
 * TanStack Form's validation system.
 *
 * @param schema - Zod schema to use for validation
 * @returns Validator function for TanStack Form
 *
 * @example
 * ```ts
 * const userSchema = z.object({
 *   username: z.string().min(3),
 *   email: z.string().email()
 * });
 *
 * const form = useAppForm({
 *   validators: {
 *     onChange: createZodValidator(userSchema),
 *     onBlur: createZodValidator(userSchema)
 *   }
 * });
 * ```
 */
export function createZodValidator<T extends z.ZodType>(schema: T) {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      return result.error.format();
    }
    return undefined;
  };
}

/**
 * Create a TanStack Form field-level validator from a Zod schema
 *
 * Generates a validator that validates a single field against a schema,
 * useful for field-specific validation with better error messages.
 *
 * @param schema - Zod schema to use for validation
 * @param fieldName - Name of the field to validate
 * @returns Validator function for TanStack Form field
 *
 * @example
 * ```ts
 * const schema = z.object({ username: z.string().min(3) });
 *
 * <form.AppField
 *   name="username"
 *   validators={{
 *     onChange: createZodFieldValidator(schema, 'username')
 *   }}
 * >
 * ```
 */
export function createZodFieldValidator<T extends z.ZodType>(
  schema: T,
  fieldName: string,
) {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      const fieldError = getFirstZodError(result.error, fieldName);
      return fieldError || undefined;
    }
    return undefined;
  };
}

/**
 * Validate async with Zod schema
 *
 * Provides async validation support with proper error handling.
 * Useful for validations that require API calls or async operations.
 *
 * @param schema - Zod schema to use for validation
 * @param value - Value to validate
 * @returns Promise resolving to validation result
 *
 * @example
 * ```ts
 * const form = useAppForm({
 *   validators: {
 *     onChangeAsync: async ({ value }) => {
 *       const result = await validateAsync(schema, value);
 *       return result.success ? undefined : result.error.format();
 *     }
 *   }
 * });
 * ```
 */
export async function validateAsync<T extends z.ZodType>(
  schema: T,
  value: unknown,
) {
  return schema.safeParseAsync(value);
}

/**
 * Common Zod schemas for reuse across forms
 *
 * Pre-built schemas for common validation patterns to ensure consistency
 * and reduce duplication across the application.
 */
export const commonSchemas = {
  /** Email validation with lowercase transformation */
  email: z.string().trim().toLowerCase().email('Invalid email address'),

  /** URL validation with https requirement */
  url: z
    .string()
    .url('Please enter a valid URL')
    .refine((url) => url.startsWith('https://'), {
      message: 'URL must use HTTPS',
    }),

  /** URL validation (optional, allows empty string) */
  urlOptional: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),

  /** Username validation (3-20 chars, alphanumeric + underscore) */
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),

  /** Strong password validation */
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),

  /** Phone number validation (US format) */
  phoneUS: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone must be in format: 123-456-7890')
    .or(z.string().regex(/^\(\d{3}\)\s*\d{3}-\d{4}$/, 'Invalid phone format')),

  /** ZIP code validation (US) */
  zipCodeUS: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 or 9 digits'),

  /** Credit card number validation (basic) */
  creditCard: z
    .string()
    .regex(/^\d{13,19}$/, 'Invalid credit card number')
    .refine((val) => {
      // Luhn algorithm validation
      let sum = 0;
      let isEven = false;
      for (let i = val.length - 1; i >= 0; i--) {
        let digit = parseInt(val[i], 10);
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    }, 'Invalid credit card number'),

  /** Age validation (18-120) */
  age: z.coerce
    .number({ message: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please enter a valid age'),

  /** Date string validation (YYYY-MM-DD) */
  dateString: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

  /** Non-empty string */
  nonEmptyString: z.string().trim().min(1, 'This field is required'),

  /** Positive integer */
  positiveInt: z.coerce
    .number()
    .int('Must be a whole number')
    .positive('Must be a positive number'),

  /** Boolean that must be true (for terms acceptance) */
  mustBeTrue: z.literal(true, {
    message: 'You must accept to continue',
  }),
};

/**
 * Create password confirmation schema with refine
 *
 * Generates a schema that validates password and confirmation match.
 *
 * @param passwordField - Name of the password field (default: 'password')
 * @param confirmField - Name of the confirmation field (default: 'confirmPassword')
 * @returns Zod schema with password matching validation
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   password: commonSchemas.password,
 *   confirmPassword: z.string()
 * }).and(createPasswordMatchSchema());
 * ```
 */
export function createPasswordMatchSchema(
  passwordField = 'password',
  confirmField = 'confirmPassword',
) {
  return z
    .object({})
    .passthrough()
    .refine(
      (data: Record<string, unknown>) => {
        return data[passwordField] === data[confirmField];
      },
      {
        message: 'Passwords do not match',
        path: [confirmField],
      },
    );
}

/**
 * Create date range validation schema
 *
 * Validates that end date is after start date.
 *
 * @param startField - Name of the start date field
 * @param endField - Name of the end date field
 * @returns Zod schema with date range validation
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   startDate: z.string(),
 *   endDate: z.string()
 * }).and(createDateRangeSchema('startDate', 'endDate'));
 * ```
 */
export function createDateRangeSchema(startField: string, endField: string) {
  return z
    .object({})
    .passthrough()
    .refine(
      (data: Record<string, unknown>) => {
        const start = data[startField];
        const end = data[endField];
        if (typeof start === 'string' && typeof end === 'string') {
          return new Date(start) < new Date(end);
        }
        return true;
      },
      {
        message: 'End date must be after start date',
        path: [endField],
      },
    );
}
