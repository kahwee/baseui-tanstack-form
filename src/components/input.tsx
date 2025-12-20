import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Input, InputProps } from 'baseui/input';
import { useFieldError } from './use-field-error';

/**
 * Props for the InputField component
 */
type InputFieldProps = {
  /** Label text displayed above the input field */
  label: FormControlProps['label'];
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'error' | 'label'>>;
} & Omit<InputProps, 'value' | 'onChange' | 'onBlur' | 'error'>;

/**
 * Input field component integrated with TanStack Form
 *
 * Provides a text input field with automatic form state management,
 * validation error display, and accessibility features.
 *
 * @example
 * ```tsx
 * <form.AppField name="username">
 *   {(field) => (
 *     <field.Input
 *       label="Username"
 *       placeholder="Enter your username"
 *       type="text"
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed above the input
 * @param formControlProps - Additional BaseUI FormControl props
 * @param restProps - All other BaseUI Input props (placeholder, type, disabled, etc.)
 * @returns Rendered input field with validation support and ARIA attributes
 */
export function InputField({
  label,
  formControlProps,
  ...restProps
}: InputFieldProps) {
  const field = useFieldContext<string>();
  const { hasError, errorMessage } = useFieldError(field);

  // Generate unique IDs for ARIA attributes
  const errorId = hasError && errorMessage ? `${field.name}-error` : undefined;

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value ?? '')}
        onBlur={field.handleBlur}
        error={hasError}
        aria-invalid={hasError}
        aria-describedby={errorId}
        {...restProps}
      />
    </FormControl>
  );
}
