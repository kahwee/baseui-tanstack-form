import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import {
  DatePicker as BaseDatePicker,
  DatepickerProps,
} from 'baseui/datepicker';
import { useFieldError } from './use-field-error';

type DatePickerFieldProps = {
  label: FormControlProps['label'];
  formControlProps?: Partial<Omit<FormControlProps, 'error' | 'label'>>;
} & Omit<DatepickerProps, 'value' | 'onChange' | 'error'>;

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
        {...restProps}
      />
    </FormControl>
  );
}
