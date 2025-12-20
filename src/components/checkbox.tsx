import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Checkbox as BaseCheckbox, CheckboxProps } from 'baseui/checkbox';
import { useFieldError } from './use-field-error';

/**
 * Props for the CheckboxField component
 */
type CheckboxFieldProps = {
  /** Label text displayed next to the checkbox */
  label: string;
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'error' | 'label'>>;
} & Omit<
  CheckboxProps,
  'checked' | 'onChange' | 'onBlur' | 'error' | 'children'
>;

/**
 * Single checkbox component integrated with TanStack Form
 *
 * Provides a checkbox field with automatic form state management
 * for boolean values, validation error display, and accessibility features.
 *
 * @example
 * ```tsx
 * <form.AppField name="agreeToTerms">
 *   {(field) => (
 *     <field.Checkbox
 *       label="I agree to the terms and conditions"
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed next to the checkbox
 * @param formControlProps - Additional BaseUI FormControl props
 * @param restProps - All other BaseUI Checkbox props (disabled, overrides, etc.)
 * @returns Rendered checkbox field with validation support and ARIA attributes
 */
export function CheckboxField({
  label,
  formControlProps,
  ...restProps
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const { hasError, errorMessage } = useFieldError(field);

  // Generate unique IDs for ARIA attributes
  const errorId = hasError && errorMessage ? `${field.name}-error` : undefined;

  return (
    <FormControl error={errorMessage} {...formControlProps}>
      <BaseCheckbox
        checked={!!field.state.value}
        onChange={(e) => field.handleChange(e.target.checked)}
        onBlur={field.handleBlur}
        error={hasError}
        aria-invalid={hasError}
        aria-describedby={errorId}
        {...restProps}
      >
        {label}
      </BaseCheckbox>
    </FormControl>
  );
}
