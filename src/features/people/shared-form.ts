import { formOptions } from '@tanstack/react-form'

export interface FormValues {
  firstName: string;
  lastName: string;
}

export const formOpts = formOptions({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
  } as FormValues,
});
