/**
 * Type definitions for baseui-tanstack-form
 *
 * This file exports common types used throughout the library for better
 * developer experience and type safety.
 */

import type { FormControlProps } from 'baseui/form-control';

/**
 * Result returned by the useFieldError hook
 */
export type FieldError = {
  /** Whether the field has a validation error */
  hasError: boolean;
  /** The error message to display, or null if no error */
  errorMessage: string | null;
};

/**
 * Structure of form errors from TanStack Form's getAllErrors()
 *
 * This interface documents the expected structure when parsing errors
 * from TanStack Form. The structure includes both form-level and field-level errors.
 */
export type FormErrors = {
  /** Form-level errors */
  form?: {
    /** Array of error groups */
    errors?: Array<Record<string, unknown>>;
    /** Map of error groups */
    errorMap?: Record<string, unknown>;
  };
  /** Field-level errors */
  fields?: Record<string, unknown>;
};

/**
 * Structure of an individual error object
 */
export type ErrorObject = {
  /** Array of error messages */
  _errors?: unknown[];
  /** Nested error objects */
  [key: string]: unknown;
};

/**
 * Common field component props shared across all form field components
 */
export type BaseFieldProps = {
  /** Label text displayed for the field */
  label: FormControlProps['label'];
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'error' | 'label'>>;
};

/**
 * Configuration for an option in select-style components
 */
export type SelectOption = {
  /** Unique identifier for this option */
  id: string;
  /** Display text for this option */
  label: string;
  /** Optional description text */
  description?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
};
