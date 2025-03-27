import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Select as BaseSelect, SelectProps, Value, Option } from 'baseui/select';
import { useFieldError } from './use-field-error';

export type SelectOption = {
  id: string;
  label: string;
  description?: string;
};

type SelectFieldProps = {
  label: string;
  options: SelectOption[];
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<SelectProps, 'value' | 'onChange' | 'options' | 'error'>;

// Helper function to convert between different data formats
const formatOptions = (options: SelectOption[]): Option[] => {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    ...(option.description ? { description: option.description } : {})
  }));
};

const formatValue = (value: string | string[]): Value => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(v => ({ id: v }));
  }
  return [{ id: value }];
};

// Get single string value from Value type
const extractSingleValue = (value: Value): string => {
  if (!value || !value.length) return '';
  return String(value[0]?.id || '');
};

// Get array of strings from Value type
const extractMultipleValues = (value: Value): string[] => {
  if (!value) return [];
  return value.map(item => String(item.id || ''));
};

export function SelectField({ 
  label, 
  options, 
  formControlProps, 
  multi = false,
  ...restProps 
}: SelectFieldProps) {
  const field = useFieldContext<string | string[]>();
  const { hasError, errorMessage } = useFieldError(field);
  
  // Convert to BaseUI format
  const formattedOptions = formatOptions(options);
  const formattedValue = formatValue(field.state.value);

  const handleChange = (params: { value: Value }) => {
    if (multi) {
      field.handleChange(extractMultipleValues(params.value));
    } else {
      field.handleChange(extractSingleValue(params.value));
    }
  };

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <BaseSelect
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        onBlur={field.handleBlur}
        error={hasError}
        multi={multi}
        {...restProps}
      />
    </FormControl>
  );
}