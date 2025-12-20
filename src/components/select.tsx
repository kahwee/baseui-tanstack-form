import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import {
  Select as BaseSelect,
  SelectProps,
  Value,
  Option,
} from 'baseui/select';
import { useFieldError } from './use-field-error';

/**
 * Configuration for a single select option
 */
export type SelectOption = {
  /** Unique identifier for this option */
  id: string;
  /** Display text for this option */
  label: string;
  /** Optional description text displayed below the label */
  description?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
};

/**
 * Base props shared by both single and multi select components
 */
type BaseSelectFieldProps = {
  /** Label text displayed above the select */
  label: FormControlProps['label'];
  /** Array of select options to display */
  options: SelectOption[];
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<SelectProps, 'value' | 'onChange' | 'options' | 'error' | 'multi'>;

/**
 * Props for the SelectSingleField component
 */
export type SelectSingleFieldProps = BaseSelectFieldProps;

/**
 * Props for the SelectMultiField component
 */
export type SelectMultiFieldProps = BaseSelectFieldProps;

// Helper function to convert between different data formats
const formatOptions = (options: SelectOption[]): Option[] => {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    ...(option.description ? { description: option.description } : {}),
    ...(option.disabled ? { disabled: option.disabled } : {}),
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
  return value.map((v) => ({ id: v }));
};

// Get single string value from BaseUI Value type
const extractSingleValue = (value: Value): string => {
  if (!value || !value.length) return '';
  return String(value[0]?.id || '');
};

// Get array of strings from BaseUI Value type
const extractMultipleValues = (value: Value): string[] => {
  if (!value) return [];
  return value.map((item) => String(item.id || ''));
};

/**
 * Single select dropdown component integrated with TanStack Form
 *
 * Provides a dropdown for selecting a single option from a list,
 * with automatic form state management, validation error display,
 * and accessibility features.
 *
 * @example
 * ```tsx
 * <form.AppField name="country">
 *   {(field) => (
 *     <field.SelectSingle
 *       label="Country"
 *       placeholder="Select a country"
 *       options={[
 *         { id: 'us', label: 'United States' },
 *         { id: 'uk', label: 'United Kingdom' },
 *         { id: 'ca', label: 'Canada' }
 *       ]}
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed above the select
 * @param options - Array of select options
 * @param formControlProps - Additional BaseUI FormControl props
 * @param restProps - All other BaseUI Select props (placeholder, clearable, etc.)
 * @returns Rendered single-select dropdown with validation support and ARIA attributes
 */
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

  // Generate unique IDs for ARIA attributes
  const errorId = hasError && errorMessage ? `${field.name}-error` : undefined;

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <BaseSelect
        id={field.name}
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        onBlur={field.handleBlur}
        error={hasError}
        aria-invalid={hasError}
        aria-describedby={errorId}
        {...restProps}
      />
    </FormControl>
  );
}

/**
 * Multi-select dropdown component integrated with TanStack Form
 *
 * Provides a dropdown for selecting multiple options from a list,
 * with automatic form state management, validation error display,
 * and accessibility features. Manages an array of selected values.
 *
 * @example
 * ```tsx
 * <form.AppField name="skills">
 *   {(field) => (
 *     <field.SelectMulti
 *       label="Skills"
 *       placeholder="Select your skills"
 *       options={[
 *         { id: 'react', label: 'React' },
 *         { id: 'typescript', label: 'TypeScript' },
 *         { id: 'nodejs', label: 'Node.js' }
 *       ]}
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed above the select
 * @param options - Array of select options
 * @param formControlProps - Additional BaseUI FormControl props
 * @param restProps - All other BaseUI Select props (placeholder, clearable, etc.)
 * @returns Rendered multi-select dropdown with validation support and ARIA attributes
 */
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

  // Generate unique IDs for ARIA attributes
  const errorId = hasError && errorMessage ? `${field.name}-error` : undefined;

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <BaseSelect
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        onBlur={field.handleBlur}
        error={hasError}
        multi={true}
        aria-invalid={hasError}
        aria-describedby={errorId}
        {...restProps}
      />
    </FormControl>
  );
}
