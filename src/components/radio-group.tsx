import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl } from 'baseui/form-control';
import { RadioGroup, Radio, RadioProps, RadioGroupProps } from 'baseui/radio';
import { FormControlProps } from 'baseui/form-control';
import { useFieldError } from './use-field-error';

/**
 * Configuration for a single radio button option
 */
type RadioOption = {
  /** Unique value for this radio option */
  value: string;
  /** Label text or component displayed next to the radio button */
  label: React.ReactNode;
  /** Optional description text displayed below the label */
  description?: string;
  /** BaseUI style overrides for this radio button */
  overrides?: RadioProps['overrides'];
  /** Whether this radio option is disabled */
  disabled?: boolean;
};

/**
 * Props for the RadioGroupField component
 */
type RadioGroupFieldProps = {
  /** Label text displayed above the radio group */
  label: FormControlProps['label'];
  /** Array of radio button options to display */
  options: RadioOption[];
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<RadioGroupProps, 'value' | 'onChange' | 'onBlur' | 'error'>;

/**
 * Radio group component integrated with TanStack Form
 *
 * Provides radio buttons for single selection from a list of options,
 * with automatic form state management, validation error display,
 * and accessibility features.
 *
 * @example
 * ```tsx
 * <form.AppField name="size">
 *   {(field) => (
 *     <field.RadioGroup
 *       label="Size"
 *       options={[
 *         { value: 'small', label: 'Small' },
 *         { value: 'medium', label: 'Medium' },
 *         { value: 'large', label: 'Large' }
 *       ]}
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed above the radio group
 * @param options - Array of radio button options
 * @param formControlProps - Additional BaseUI FormControl props
 * @param restProps - All other BaseUI RadioGroup props
 * @returns Rendered radio group with validation support and ARIA attributes
 */
export function RadioGroupField({
  label,
  options,
  formControlProps,
  ...restProps
}: RadioGroupFieldProps) {
  const field = useFieldContext<string>();
  const { hasError, errorMessage } = useFieldError(field);

  // Generate unique IDs for ARIA attributes
  const errorId = hasError && errorMessage ? `${field.name}-error` : undefined;

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.currentTarget.value)}
        onBlur={field.handleBlur}
        error={hasError}
        aria-invalid={hasError}
        aria-describedby={errorId}
        {...restProps}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            description={option.description}
            overrides={option.overrides}
            disabled={option.disabled}
          >
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
    </FormControl>
  );
}
