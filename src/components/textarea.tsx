import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl } from 'baseui/form-control';
import { Textarea, TextareaProps } from 'baseui/textarea';
import { FormControlProps } from 'baseui/form-control';

type TextareaFieldProps = {
  label: string;
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<TextareaProps, 'value' | 'onChange' | 'error'>;

export function TextareaField({ label, formControlProps, ...restProps }: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const hasError = Boolean(field.state.meta?.errors?.length);
  const errorMessage = hasError && field.state.meta?.errors?.[0] 
    ? field.state.meta.errors[0]
    : null;
  
  return (
    <FormControl 
      label={label} 
      error={errorMessage}
      {...formControlProps}
    >
      <Textarea
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        error={hasError}
        {...restProps}
      />
    </FormControl>
  );
}