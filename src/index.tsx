// Component exports
export { InputField } from './components/input';
export { TextareaField } from './components/textarea';
export { RadioGroupField } from './components/radio-group';
export { SelectSingleField, SelectMultiField } from './components/select';
export { CheckboxField } from './components/checkbox';
export { CheckboxGroupField } from './components/checkbox-group';
export { DatePickerField } from './components/datepicker';

// Hook exports
export { useAppForm, withForm } from './hooks/form';
export { useFieldError } from './components/use-field-error';

// Type exports
export type {
  FieldError,
  FormErrors,
  ErrorObject,
  BaseFieldProps,
  SelectOption,
} from './types';

// Zod validation utilities
export {
  getFirstZodError,
  getAllZodErrors,
  zodErrorsToFieldMap,
  createZodValidator,
  createZodFieldValidator,
  validateAsync,
  commonSchemas,
  createPasswordMatchSchema,
  createDateRangeSchema,
} from './utils/zod-helpers';

export type { InputFieldProps } from './components/input';
export type { TextareaFieldProps } from './components/textarea';
export type {
  RadioGroupFieldProps,
  RadioOption,
} from './components/radio-group';
export type {
  SelectSingleFieldProps,
  SelectMultiFieldProps,
} from './components/select';
export type { CheckboxFieldProps } from './components/checkbox';
export type {
  CheckboxGroupFieldProps,
  CheckboxOption,
} from './components/checkbox-group';
export type { DatePickerFieldProps } from './components/datepicker';
