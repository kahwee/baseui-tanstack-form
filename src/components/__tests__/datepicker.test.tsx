import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { toDatePickerValue, toSingleDate } from '../datepicker'
import { useAppForm } from '../../hooks/form'
import { render, screen } from '../../test-utils/rtl'

type TestSchema = {
  birthDate: Date | null
  eventDate: string | null
}

/** DatePicker component tests for the package's supported React 18 runtime. */
describe('DatePicker Component', () => {
  it('normalizes stored dates for the calendar', () => {
    const date = new Date('2025-06-15T12:00:00.000Z')

    expect(toDatePickerValue(date)).toBe(date)
    expect(toDatePickerValue(date.toISOString())).toEqual(date)
    expect(toDatePickerValue(null)).toBeNull()
    expect(toDatePickerValue('not-a-date')).toBeNull()
    expect(toDatePickerValue(new Date('invalid'))).toBeNull()
  })

  it('normalizes calendar callbacks to a single date or null', () => {
    const date = new Date('2025-06-15T12:00:00.000Z')

    expect(toSingleDate(date)).toBe(date)
    expect(toSingleDate([date])).toBe(date)
    expect(toSingleDate([])).toBeNull()
    expect(toSingleDate(null)).toBeNull()
  })

  it('renders with label', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: null,
          eventDate: null,
        } as TestSchema,
      })

      return (
        <form>
          <form.AppField name="birthDate">
            {(field) => <field.DatePicker label="Birth Date" />}
          </form.AppField>
        </form>
      )
    }

    render(<TestForm />)

    expect(screen.getByText('Birth Date')).toBeInTheDocument()
  })

  it('renders with default Date value', () => {
    const defaultDate = new Date('2000-01-01')

    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: defaultDate,
          eventDate: null,
        } as TestSchema,
      })

      return (
        <form>
          <form.AppField name="birthDate">
            {(field) => <field.DatePicker label="Birth Date" />}
          </form.AppField>
        </form>
      )
    }

    const { container } = render(<TestForm />)

    // The datepicker input should be rendered
    const input = container.querySelector('input')
    expect(input).toBeInTheDocument()
  })

  it('renders with string date value', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: null,
          eventDate: '2025-06-15',
        } as TestSchema,
      })

      return (
        <form>
          <form.AppField name="eventDate">
            {(field) => <field.DatePicker label="Event Date" />}
          </form.AppField>
        </form>
      )
    }

    const { container } = render(<TestForm />)

    // The datepicker input should be rendered and handle string conversion
    const input = container.querySelector('input')
    expect(input).toBeInTheDocument()
  })

  it('treats an invalid string date as an empty value', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: null,
          eventDate: 'not-a-date',
        } as TestSchema,
      })

      return (
        <form.AppField name="eventDate">
          {(field) => <field.DatePicker label="Event Date" placeholder="Select a date" />}
        </form.AppField>
      )
    }

    render(<TestForm />)

    expect(screen.getByPlaceholderText('Select a date')).toHaveValue('')
  })

  it('renders with null value', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: null,
          eventDate: null,
        } as TestSchema,
      })

      return (
        <form>
          <form.AppField name="birthDate">
            {(field) => <field.DatePicker label="Birth Date" />}
          </form.AppField>
        </form>
      )
    }

    const { container } = render(<TestForm />)

    // The datepicker input should be rendered with no initial value
    const input = container.querySelector('input')
    expect(input).toBeInTheDocument()
  })

  it('displays placeholder text', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: null,
          eventDate: null,
        } as TestSchema,
      })

      return (
        <form>
          <form.AppField name="birthDate">
            {(field) => <field.DatePicker label="Birth Date" placeholder="Select a date" />}
          </form.AppField>
        </form>
      )
    }

    render(<TestForm />)

    // The placeholder should be rendered in the input
    const placeholder = screen.getByPlaceholderText('Select a date')
    expect(placeholder).toBeInTheDocument()
  })

  it('handles form submission with date value', async () => {
    const testDate = new Date('1990-05-20')
    let submittedData: TestSchema | null = null

    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: testDate,
          eventDate: null,
        } as TestSchema,
        onSubmit: async ({ value }) => {
          submittedData = value
        },
      })

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="birthDate">
            {(field) => <field.DatePicker label="Birth Date" />}
          </form.AppField>
          <button type="submit">Submit</button>
        </form>
      )
    }

    render(<TestForm />)

    const submitButton = screen.getByText('Submit')
    await userEvent.click(submitButton)

    // Use a timeout to wait for async submission
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(submittedData).toEqual({
      birthDate: testDate,
      eventDate: null,
    })
  })

  it('has proper ARIA attributes', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: null,
          eventDate: null,
        } as TestSchema,
      })

      return (
        <form>
          <form.AppField name="birthDate">
            {(field) => <field.DatePicker label="Birth Date" />}
          </form.AppField>
        </form>
      )
    }

    const { container } = render(<TestForm />)

    // The datepicker input should have aria-invalid attribute
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('accepts minDate and maxDate props', () => {
    const minDate = new Date('2000-01-01')
    const maxDate = new Date('2030-12-31')

    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          birthDate: null,
          eventDate: null,
        } as TestSchema,
      })

      return (
        <form>
          <form.AppField name="birthDate">
            {(field) => <field.DatePicker label="Birth Date" minDate={minDate} maxDate={maxDate} />}
          </form.AppField>
        </form>
      )
    }

    const { container } = render(<TestForm />)

    // The datepicker input should be rendered with min/max constraints
    const input = container.querySelector('input')
    expect(input).toBeInTheDocument()
  })
})
