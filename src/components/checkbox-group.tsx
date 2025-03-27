import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Checkbox, CheckboxProps } from 'baseui/checkbox';
import { useFieldError } from './use-field-error';

type CheckboxOption = {
  value: string;
  label: React.ReactNode;
  overrides?: CheckboxProps['overrides'];
  disabled?: boolean;
};

type CheckboxGroupFieldProps = {
  label: string;
  options: CheckboxOption[];
  inline?: boolean;
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
  checkboxProps?: Partial<Omit<CheckboxProps, 'checked' | 'onChange' | 'error' | 'children' | 'value'>>;
};

export function CheckboxGroupField({
  label,
  options,
  inline = false,
  formControlProps,
  checkboxProps,
}: CheckboxGroupFieldProps) {
  const field = useFieldContext<string[]>();
  const { hasError, errorMessage } = useFieldError(field);
  
  // Ensure field.state.value is always an array
  const selectedValues = Array.isArray(field.state.value) ? field.state.value : [];
  
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      // Add value to array if not present
      field.handleChange([...selectedValues, value]);
    } else {
      // Remove value from array
      field.handleChange(selectedValues.filter(val => val !== value));
    }
  };

  return (
    <FormControl
      label={label}
      error={errorMessage}
      {...formControlProps}
    >
      <div style={{ display: inline ? 'flex' : 'block', gap: inline ? '16px' : undefined }}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={e => handleChange(option.value, e.target.checked)}
            onBlur={field.handleBlur}
            overrides={option.overrides}
            disabled={option.disabled}
            error={hasError}
            {...checkboxProps}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </FormControl>
  );
}