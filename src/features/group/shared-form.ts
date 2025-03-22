import { formOptions } from '@tanstack/react-form'

export interface FormValues {
  name: string;
}

export const formOpts = formOptions({
  defaultValues: {
    name: 'John Group',
  } satisfies FormValues,
});
