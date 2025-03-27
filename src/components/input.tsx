import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Input, InputProps } from 'baseui/input';


type InputFieldProps = {
  label: string;
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<InputProps, 'value' | 'onChange' | 'error'>;

export function InputField({ label, formControlProps, ...restProps }: InputFieldProps) {
  const field = useFieldContext<string>();
  const meta = field.getMeta()
  const hasError = Boolean(meta?.errors?.length);
  const errorMessage = hasError && meta?.errors?.[0]
    ? meta.errors[0]
    : null;
  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value ?? '')}
        onBlur={field.handleBlur}
        error={Boolean(meta?.errors?.length)}
        {...restProps}
      />
    </FormControl>
  );
}
