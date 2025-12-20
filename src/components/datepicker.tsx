import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import {
  DatePicker as BaseDatePicker,
  DatepickerProps,
} from 'baseui/datepicker';
import { useFieldError } from './use-field-error';

/**
 * Props for the DatePickerField component
 */
type DatePickerFieldProps = {
  /** Label text displayed above the date picker */
  label: FormControlProps['label'];
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'error' | 'label'>>;
} & Omit<DatepickerProps, 'value' | 'onChange' | 'error'>;

/**
 * Date picker component integrated with TanStack Form
 *
 * Provides a date selection field with automatic form state management,
 * validation error display, and accessibility features. Supports both
 * Date objects and string values.
 *
 * @example
 * ```tsx
 * <form.AppField name="birthDate">
 *   {(field) => (
 *     <field.DatePicker
 *       label="Birth Date"
 *       placeholder="Select a date"
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed above the date picker
 * @param formControlProps - Additional BaseUI FormControl props
 * @param restProps - All other BaseUI DatePicker props (placeholder, minDate, maxDate, etc.)
 * @returns Rendered date picker field with validation support and ARIA attributes
 */
export function DatePickerField({
  label,
  formControlProps,
  ...restProps
}: DatePickerFieldProps) {
  const field = useFieldContext<Date | string | null>();
  const { hasError, errorMessage } = useFieldError(field);

  // Convert value to appropriate format for DatePicker
  const getValue = () => {
    const value = field.state.value;

    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string') {
      // Convert string to Date
      return new Date(value);
    }

    if (Array.isArray(value)) {
      // For arrays, return first element if it exists
      return value.length > 0 ? value[0] : null;
    }

    // Return Date object as is
    return value;
  };

  // Generate unique IDs for ARIA attributes
  const errorId = hasError && errorMessage ? `${field.name}-error` : undefined;

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <BaseDatePicker
        value={getValue()}
        onChange={({ date }) => {
          // Handle single date
          if (date && !Array.isArray(date)) {
            field.handleChange(date);
          }
          // Handle range (not fully supported in this implementation)
          else if (Array.isArray(date) && date.length > 0 && date[0]) {
            field.handleChange(date[0]);
          }
          // Handle null
          else {
            field.handleChange(null);
          }
        }}
        error={hasError}
        aria-invalid={hasError}
        aria-describedby={errorId}
        {...restProps}
      />
    </FormControl>
  );
}
