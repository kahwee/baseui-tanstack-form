import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl } from 'baseui/form-control';
import { Textarea, TextareaProps } from 'baseui/textarea';
import { FormControlProps } from 'baseui/form-control';
import { useFieldError } from './use-field-error';

type TextareaFieldProps = {
  label: FormControlProps['label'];
  formControlProps?: Partial<Omit<FormControlProps, 'label' | 'error'>>;
} & Omit<TextareaProps, 'value' | 'onChange' | 'onBlur' | 'error'>;

export function TextareaField({
  label,
  formControlProps,
  ...restProps
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const { hasError, errorMessage } = useFieldError(field);

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <Textarea
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        error={hasError}
        {...restProps}
      />
    </FormControl>
  );
}
