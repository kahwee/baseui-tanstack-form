import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl } from 'baseui/form-control';
import { Textarea, TextareaProps } from 'baseui/textarea';
import { FormControlProps } from 'baseui/form-control';
import { useFieldError } from './use-field-error';

/**
 * Props for the TextareaField component
 */
type TextareaFieldProps = {
  /** Label text displayed above the textarea */
  label: FormControlProps['label'];
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<TextareaProps, 'value' | 'onChange' | 'onBlur' | 'error'>;

/**
 * Multi-line textarea component integrated with TanStack Form
 *
 * Provides a textarea field with automatic form state management,
 * validation error display, and accessibility features.
 *
 * @example
 * ```tsx
 * <form.AppField name="bio">
 *   {(field) => (
 *     <field.Textarea
 *       label="Biography"
 *       placeholder="Tell us about yourself..."
 *       rows={4}
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed above the textarea
 * @param formControlProps - Additional BaseUI FormControl props
 * @param restProps - All other BaseUI Textarea props (placeholder, rows, disabled, etc.)
 * @returns Rendered textarea field with validation support and ARIA attributes
 */
export function TextareaField({
  label,
  formControlProps,
  ...restProps
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const { hasError, errorMessage } = useFieldError(field);

  // Generate unique IDs for ARIA attributes
  const errorId = hasError && errorMessage ? `${field.name}-error` : undefined;

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <Textarea
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        error={hasError}
        aria-invalid={hasError}
        aria-describedby={errorId}
        {...restProps}
      />
    </FormControl>
  );
}
