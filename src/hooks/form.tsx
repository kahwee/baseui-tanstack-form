import React from 'react';
import { InputField } from '../components/input';
import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext, useFormContext } from './form-context';
import { Button } from 'baseui/button';
import { TextareaField } from '../components/textarea';
import { RadioGroupField } from '../components/radio-group';
import { SelectSingleField, SelectMultiField } from '../components/select';
import { CheckboxField } from '../components/checkbox';
import { CheckboxGroupField } from '../components/checkbox-group';
import { DatePickerField } from '../components/datepicker';

/**
 * Submit button component that shows loading state during form submission
 *
 * @param label - Button text to display
 * @returns Rendered submit button with loading state
 */
function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}

/**
 * Form hook factory created with TanStack Form's createFormHook
 *
 * Provides two main exports:
 * - useAppForm: Hook for creating form instances with pre-configured components
 * - withForm: Higher-order component for reusable form sections
 *
 * Pre-configured field components:
 * - Input: Text input field
 * - Textarea: Multi-line text input
 * - RadioGroup: Radio button group
 * - SelectSingle: Single-select dropdown
 * - SelectMulti: Multi-select dropdown
 * - Checkbox: Single checkbox
 * - CheckboxGroup: Multiple checkboxes
 * - DatePicker: Date selection field
 *
 * Pre-configured form components:
 * - SubscribeButton: Submit button with loading state
 *
 * @example
 * ```tsx
 * function MyForm() {
 *   const form = useAppForm({
 *     defaultValues: { name: '', email: '' },
 *     onSubmit: (values) => console.log(values)
 *   });
 *
 *   return (
 *     <form onSubmit={(e) => {
 *       e.preventDefault();
 *       form.handleSubmit();
 *     }}>
 *       <form.AppField name="name">
 *         {(field) => <field.Input label="Name" />}
 *       </form.AppField>
 *       <form.AppForm>
 *         <form.SubscribeButton label="Submit" />
 *       </form.AppForm>
 *     </form>
 *   );
 * }
 * ```
 */
export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    Input: InputField,
    Textarea: TextareaField,
    RadioGroup: RadioGroupField,
    SelectSingle: SelectSingleField, // Single-select component
    SelectMulti: SelectMultiField, // Multi-select component
    Checkbox: CheckboxField,
    CheckboxGroup: CheckboxGroupField,
    DatePicker: DatePickerField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
