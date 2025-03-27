type FieldError = {
  hasError: boolean;
  errorMessage: string | null;
};

interface FormErrors {
  form?: {
    errors?: Array<Record<string, { _errors?: string[] }>>;
    errorMap?: Record<string, Record<string, { _errors?: string[] }>>;
  };
  fields?: Record<string, unknown>;
}

/**
 * Utility function to get the first error for a field, checking both field and form-level errors
 */
export function useFieldError(field: {
  getMeta: () => { errors?: string[] };
  form: { getAllErrors: () => FormErrors };
  name: string;
}): FieldError {
  const meta = field.getMeta();
  const formErrors = field.form.getAllErrors();
  
  // Check for field-level errors first
  let hasError = Boolean(meta?.errors?.length);
  let errorMessage = hasError && meta?.errors?.[0] ? meta.errors[0] : null;
  
  // If no field-level errors, check form-level errors for this field name
  if (!errorMessage && formErrors?.form?.errors && formErrors.form.errors.length > 0) {
    // Look for this field name in the form errors array
    for (const errorGroup of formErrors.form.errors) {
      if (errorGroup && field.name in errorGroup) {
        const fieldErrors = errorGroup[field.name]?._errors;
        if (fieldErrors && fieldErrors.length > 0) {
          hasError = true;
          errorMessage = fieldErrors[0];
          break; // Stop at first error found
        }
      }
    }
  }
  
  return { hasError, errorMessage };
}