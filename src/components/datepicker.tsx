import { DatePicker as BaseDatePicker, type DatepickerProps } from 'baseui/datepicker'
import { FormControl, type FormControlProps } from 'baseui/form-control'
import { useFieldContext } from '../hooks/form-context'
import { useFieldError } from './use-field-error'

/**
 * Props for the DatePickerField component
 */
export type DatePickerFieldProps = {
  /** Label text displayed above the date picker */
  label: FormControlProps['label']
  /** Additional props for the FormControl wrapper */
  formControlProps?: Partial<Omit<FormControlProps, 'error' | 'label'>>
} & Omit<DatepickerProps, 'value' | 'onChange' | 'error' | 'range'> & {
    range?: false
  }

/** Keep malformed persisted dates out of Base Web's calendar. */
export function toDatePickerValue(value: Date | string | null): Date | null {
  const date = typeof value === 'string' ? new Date(value) : value
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null
}

/** The field stores one date even if a calendar sends a range value. */
export function toSingleDate(
  value: Date | Array<Date | null | undefined> | null | undefined,
): Date | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null)
}

/**
 * Date picker component integrated with TanStack Form
 *
 * Provides a date selection field with automatic form state management,
 * validation error display, and accessibility features. Supports both
 * Date objects and string values.
 *
 * @example
 * ```tsx
 * <form.AppField name="birthDate">
 *   {(field) => (
 *     <field.DatePicker
 *       label="Birth Date"
 *       placeholder="Select a date"
 *     />
 *   )}
 * </form.AppField>
 * ```
 *
 * @param label - Label text displayed above the date picker
 * @param formControlProps - Additional BaseUI FormControl props
 * @param restProps - All other BaseUI DatePicker props (placeholder, minDate, maxDate, etc.)
 * @returns Rendered date picker field with validation support and ARIA attributes
 */
export function DatePickerField({ label, formControlProps, ...restProps }: DatePickerFieldProps) {
  const field = useFieldContext<Date | string | null>()
  const { hasError, errorMessage } = useFieldError(field)

  return (
    <FormControl label={label} error={errorMessage} {...formControlProps}>
      <BaseDatePicker
        value={toDatePickerValue(field.state.value)}
        onChange={({ date }) => {
          field.handleChange(toSingleDate(date))
        }}
        error={hasError}
        aria-invalid={hasError}
        {...restProps}
      />
    </FormControl>
  )
}
