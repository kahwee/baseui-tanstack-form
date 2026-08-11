import type { FieldError, FormErrors } from '../types';

export type { FieldError, FormErrors, ErrorObject } from '../types';

type FieldLike = {
  getMeta: () => { errors?: unknown[] };
  form: { getAllErrors: () => FormErrors };
  name: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Normalize the common error shapes returned by TanStack Form and schema validators. */
export function getErrorMessage(error: unknown): string | null {
  if (typeof error === 'string') return error;
  if (!error) return null;

  if (Array.isArray(error)) {
    for (const item of error) {
      const message = getErrorMessage(item);
      if (message) return message;
    }
    return null;
  }

  if (!isRecord(error)) return null;

  if (typeof error.message === 'string') return error.message;

  if (Array.isArray(error._errors)) {
    const message = getErrorMessage(error._errors);
    if (message) return message;
  }

  if (Array.isArray(error.issues)) {
    const message = getErrorMessage(error.issues);
    if (message) return message;
  }

  for (const value of Object.values(error)) {
    const message = getErrorMessage(value);
    if (message) return message;
  }

  return null;
}

function toPathSegments(path: string): string[] {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
}

function getAtPath(value: unknown, path: string[]): unknown {
  let current = value;
  for (const segment of path) {
    if (!isRecord(current) || !(segment in current)) return undefined;
    current = current[segment];
  }
  return current;
}

function getFormErrorMessage(error: unknown): string | null {
  if (!isRecord(error)) return null;

  if (Array.isArray(error._errors)) {
    return getErrorMessage(error._errors);
  }

  if (Array.isArray(error.issues)) {
    return getErrorMessage(error.issues);
  }

  for (const [key, value] of Object.entries(error)) {
    if (key === 'message') continue;
    const message = getFormErrorMessage(value);
    if (message) return message;
  }

  return null;
}

function findFieldError(container: unknown, fieldName: string): string | null {
  if (!isRecord(container)) return null;

  // TanStack/Zod adapters may use either bracket or dot notation as direct keys.
  const directCandidates = [fieldName, fieldName.replace(/\[(\d+)\]/g, '.$1')];
  for (const key of directCandidates) {
    const message = getFormErrorMessage(container[key]);
    if (message) return message;
  }

  return getFormErrorMessage(getAtPath(container, toPathSegments(fieldName)));
}

/**
 * Return the first useful error for a field.
 *
 * Field-level errors win. Form-level errors are used as a fallback so object-level
 * schema validators can still surface messages for nested fields.
 */
export function useFieldError(field: FieldLike | null | undefined): FieldError {
  if (
    !field ||
    typeof field.name !== 'string' ||
    typeof field.getMeta !== 'function' ||
    !field.form ||
    typeof field.form.getAllErrors !== 'function'
  ) {
    return { hasError: false, errorMessage: null };
  }

  const fieldMessage = getErrorMessage(field.getMeta()?.errors);
  if (fieldMessage) {
    return { hasError: true, errorMessage: fieldMessage };
  }

  let formErrors: FormErrors;
  try {
    formErrors = field.form.getAllErrors();
  } catch {
    return { hasError: false, errorMessage: null };
  }

  for (const errorGroup of formErrors.form?.errors ?? []) {
    const message = findFieldError(errorGroup, field.name);
    if (message) return { hasError: true, errorMessage: message };
  }

  // Some adapters expose form errors in an errorMap instead of errors[].
  const errorMap = formErrors.form?.errorMap;
  if (errorMap) {
    const directMessage = findFieldError(errorMap, field.name);
    if (directMessage) return { hasError: true, errorMessage: directMessage };

    // errorMap can also be keyed by validation cause (onChange/onBlur/etc.).
    for (const group of Object.values(errorMap)) {
      const message = findFieldError(group, field.name);
      if (message) return { hasError: true, errorMessage: message };
    }
  }

  return { hasError: false, errorMessage: null };
}
