import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Checkbox, CheckboxProps } from 'baseui/checkbox';
import { useFieldError } from './use-field-error';

/**
 * Configuration for a single checkbox option
 */
type CheckboxOption = {
  /** Unique value for this checkbox option */
  value: string;
  /** Label text or component displayed next to the checkbox */
  label: React.ReactNode;
  /** BaseUI style overrides for this checkbox */
  overrides?: CheckboxProps['overrides'];
  /** Whether this checkbox option is disabled */
  disabled?: boolean;
};

/**
 * Props for the CheckboxGroupField component
 */
type CheckboxGroupFieldProps = {
  /** Label text displayed above the checkbox group */
  label: FormControlProps['label'];
  /** Array of checkbox options to display */
  options: CheckboxOption[];
  /** Whether to display checkboxes horizontally (true) or vertically (false) */
  inline?: boolean;
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
  /** Props applied to all checkboxes in the group */
  checkboxProps?: Partial<
    Omit<
      CheckboxProps,
      'checked' | 'onChange' | 'onBlur' | 'error' | 'children' | 'value'
    >
  >;
};

/**
 * Checkbox group component integrated with TanStack Form
 *
 * Provides multiple checkboxes that manage an array of selected values,
 * with automatic form state management, validation error display,
 * and accessibility features.
 *
 * @example
 * ```tsx
 * <form.AppField name="interests">
 *   {(field) => (
 *     <field.CheckboxGroup
 *       label="Select your interests"
 *       inline={true}
 *       options={[
 *         { value: 'technology', label: 'Technology' },
 *         { value: 'science', label: 'Science' },
 *         { value: 'art', label: 'Art' }
 *       ]}
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed above the checkbox group
 * @param options - Array of checkbox options
 * @param inline - Display checkboxes horizontally (default: false)
 * @param formControlProps - Additional BaseUI FormControl props
 * @param checkboxProps - Props applied to all checkboxes
 * @returns Rendered checkbox group with validation support and ARIA attributes
 */
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
  const selectedValues = Array.isArray(field.state.value)
    ? field.state.value
    : [];

  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      // Add value to array if not present
      field.handleChange([...selectedValues, value]);
    } else {
      // Remove value from array
      field.handleChange(selectedValues.filter((val) => val !== value));
    }
  };

  // Convert label to string for aria-label
  const ariaLabel = typeof label === 'string' ? label : field.name;
  const errorId = hasError && errorMessage ? `${field.name}-error` : undefined;

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <div
        role="group"
        aria-label={ariaLabel}
        aria-invalid={hasError}
        aria-describedby={errorId}
        style={{
          display: inline ? 'flex' : 'block',
          gap: inline ? '16px' : undefined,
        }}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
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
