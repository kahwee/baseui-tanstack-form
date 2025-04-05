import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl } from 'baseui/form-control';
import { RadioGroup, Radio, RadioProps, RadioGroupProps } from 'baseui/radio';
import { FormControlProps } from 'baseui/form-control';
import { useFieldError } from './use-field-error';

type RadioOption = {
  value: string;
  label: React.ReactNode;
  description?: string;
  overrides?: RadioProps['overrides'];
  disabled?: boolean;
};

type RadioGroupFieldProps = {
  label: FormControlProps['label'];
  options: RadioOption[];
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<RadioGroupProps, 'value' | 'onChange' | 'onBlur' | 'error'>;

export function RadioGroupField({
  label,
  options,
  formControlProps,
  ...restProps
}: RadioGroupFieldProps) {
  const field = useFieldContext<string>();
  const { hasError, errorMessage } = useFieldError(field);

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.currentTarget.value)}
        onBlur={field.handleBlur}
        error={hasError}
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
