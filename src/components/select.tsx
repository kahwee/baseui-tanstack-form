import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Select as BaseSelect, SelectProps, Value, Option } from 'baseui/select';
import { useFieldError } from './use-field-error';

export type SelectOption = {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

// Base props shared by both single and multi select
type BaseSelectFieldProps = {
  label: string;
  options: SelectOption[];
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<SelectProps, 'value' | 'onChange' | 'options' | 'error' | 'multi'>;

// Single select props
export type SelectSingleFieldProps = BaseSelectFieldProps;

// Multi select props
export type SelectMultiFieldProps = BaseSelectFieldProps;

// Helper function to convert between different data formats
const formatOptions = (options: SelectOption[]): Option[] => {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    ...(option.description ? { description: option.description } : {}),
    ...(option.disabled ? { disabled: option.disabled } : {})
  }));
};

// Format single string value to BaseUI Value type
const formatSingleValue = (value: string): Value => {
  if (!value) return [];
  return [{ id: value }];
};

// Format array of strings to BaseUI Value type
const formatMultiValue = (value: string[]): Value => {
  if (!value || !value.length) return [];
  return value.map(v => ({ id: v }));
};

// Get single string value from BaseUI Value type
const extractSingleValue = (value: Value): string => {
  if (!value || !value.length) return '';
  return String(value[0]?.id || '');
};

// Get array of strings from BaseUI Value type
const extractMultipleValues = (value: Value): string[] => {
  if (!value) return [];
  return value.map(item => String(item.id || ''));
};

// Single select component
export function SelectSingleField({ 
  label, 
  options, 
  formControlProps, 
  ...restProps 
}: SelectSingleFieldProps) {
  const field = useFieldContext<string>();
  const { hasError, errorMessage } = useFieldError(field);
  
  // Convert to BaseUI format
  const formattedOptions = formatOptions(options);
  const formattedValue = formatSingleValue(field.state.value);

  const handleChange = (params: { value: Value }) => {
    field.handleChange(extractSingleValue(params.value));
  };

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <BaseSelect
        id={field.name}
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        onBlur={field.handleBlur}
        error={hasError}
        {...restProps}
      />
    </FormControl>
  );
}

// Multi select component
export function SelectMultiField({ 
  label, 
  options, 
  formControlProps, 
  ...restProps 
}: SelectMultiFieldProps) {
  const field = useFieldContext<string[]>();
  const { hasError, errorMessage } = useFieldError(field);
  
  // Convert to BaseUI format
  const formattedOptions = formatOptions(options);
  const formattedValue = formatMultiValue(field.state.value || []);

  const handleChange = (params: { value: Value }) => {
    field.handleChange(extractMultipleValues(params.value));
  };

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <BaseSelect
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        onBlur={field.handleBlur}
        error={hasError}
        multi={true}
        {...restProps}
      />
    </FormControl>
  );
}