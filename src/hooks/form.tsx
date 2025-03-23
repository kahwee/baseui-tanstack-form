import React from 'react'
import { InputField } from '../components/input';
import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext, useFormContext } from './form-context'
import { Button } from 'baseui/button'
import { TextareaField } from '../components/textarea';
import { RadioGroupField } from '../components/radio-group';

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <Button type="submit" disabled={isSubmitting}>{label}</Button>}
    </form.Subscribe>
  )
}

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    InputField,
    TextareaField,
    RadioGroupField
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
