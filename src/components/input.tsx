import React from 'react';
import { useFieldContext } from '../hooks/form-context';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';

export function InputField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  return (
    <FormControl label={label}>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        error={Boolean(field.state.meta?.errors?.length)}
      />
    </FormControl>
  );
}
