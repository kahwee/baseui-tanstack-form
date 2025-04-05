import { formOptions } from '@tanstack/react-form';
import { Group } from './group-schema';

export const formOpts = formOptions({
  defaultValues: {
    name: 'John Group',
    people: [],
  } as Group,
});
