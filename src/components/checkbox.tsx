import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl, type FormControlProps } from 'baseui/form-control';
import { Checkbox as BaseCheckbox, CheckboxProps } from 'baseui/checkbox';
import { useFieldError } from './use-field-error';

type CheckboxFieldProps = {
  label: React.ReactNode;
  formControlProps?: Partial<Omit<FormControlProps, 'error'>>;
} & Omit<CheckboxProps, 'checked' | 'onChange' | 'error' | 'children'>;

export function CheckboxField({ 
  label, 
  formControlProps, 
  ...restProps 
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const { hasError, errorMessage } = useFieldError(field);

  return (
    <FormControl error={errorMessage} {...formControlProps}>
      <BaseCheckbox
        checked={!!field.state.value}
        onChange={e => field.handleChange(e.target.checked)}
        onBlur={field.handleBlur}
        error={hasError}
        {...restProps}
      >
        {label}
      </BaseCheckbox>
    </FormControl>
  );
}