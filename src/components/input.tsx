import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Input, InputProps } from 'baseui/input';
import { useFieldError } from './use-field-error';

type InputFieldProps = {
  label: string;
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<InputProps, 'value' | 'onChange' |'onBlur' | 'error'>;

export function InputField({ label, formControlProps, ...restProps }: InputFieldProps) {
  const field = useFieldContext<string>();
  const { hasError, errorMessage } = useFieldError(field);

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value ?? '')}
        onBlur={field.handleBlur}
        error={hasError}
        {...restProps}
      />
    </FormControl>
  );
}
