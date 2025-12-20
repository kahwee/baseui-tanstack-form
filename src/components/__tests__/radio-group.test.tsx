import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '../../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

type TestSchema = {
  size: string;
  color: string;
};

describe('RadioGroup Component', () => {
  it('renders with label and options', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          size: '',
          color: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="size">
            {(field) => (
              <field.RadioGroup
                label="Select size"
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    expect(screen.getByText('Select size')).toBeInTheDocument();
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('allows selecting a radio option', async () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          size: '',
          color: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="size">
            {(field) => (
              <field.RadioGroup
                label="Select size"
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const mediumRadio = screen
      .getByText('Medium')
      .closest('label')
      ?.querySelector('input');

    expect(mediumRadio).toBeInTheDocument();

    if (mediumRadio) {
      expect(mediumRadio).not.toBeChecked();
      await userEvent.click(mediumRadio);
      expect(mediumRadio).toBeChecked();
    }
  });

  it('allows changing selection', async () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          size: 'small',
          color: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="size">
            {(field) => (
              <field.RadioGroup
                label="Select size"
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const smallRadio = screen
      .getByText('Small')
      .closest('label')
      ?.querySelector('input');
    const largeRadio = screen
      .getByText('Large')
      .closest('label')
      ?.querySelector('input');

    expect(smallRadio).toBeChecked();
    expect(largeRadio).not.toBeChecked();

    if (largeRadio) {
      await userEvent.click(largeRadio);
      expect(smallRadio).not.toBeChecked();
      expect(largeRadio).toBeChecked();
    }
  });

  it('renders with default value', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          size: 'medium',
          color: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="size">
            {(field) => (
              <field.RadioGroup
                label="Select size"
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const smallRadio = screen
      .getByText('Small')
      .closest('label')
      ?.querySelector('input');
    const mediumRadio = screen
      .getByText('Medium')
      .closest('label')
      ?.querySelector('input');
    const largeRadio = screen
      .getByText('Large')
      .closest('label')
      ?.querySelector('input');

    expect(smallRadio).not.toBeChecked();
    expect(mediumRadio).toBeChecked();
    expect(largeRadio).not.toBeChecked();
  });

  it('handles form submission', async () => {
    let submittedData: TestSchema | null = null;

    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          size: '',
          color: '',
        } as TestSchema,
        onSubmit: ({ value }) => {
          submittedData = value;
        },
      });

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="size">
            {(field) => (
              <field.RadioGroup
                label="Select size"
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                ]}
              />
            )}
          </form.AppField>
          <form.AppField name="color">
            {(field) => (
              <field.RadioGroup
                label="Select color"
                options={[
                  { value: 'red', label: 'Red' },
                  { value: 'blue', label: 'Blue' },
                ]}
              />
            )}
          </form.AppField>
          <button type="submit">Submit</button>
        </form>
      );
    }

    render(<TestForm />);

    const mediumRadio = screen
      .getByText('Medium')
      .closest('label')
      ?.querySelector('input');
    const blueRadio = screen
      .getByText('Blue')
      .closest('label')
      ?.querySelector('input');

    if (mediumRadio && blueRadio) {
      await userEvent.click(mediumRadio);
      await userEvent.click(blueRadio);
    }

    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    expect(submittedData).toEqual({
      size: 'medium',
      color: 'blue',
    });
  });

  it('has proper ARIA attributes', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          size: '',
          color: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="size">
            {(field) => (
              <field.RadioGroup
                label="Select size"
                options={[{ value: 'small', label: 'Small' }]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    const { container } = render(<TestForm />);

    // Check that the radiogroup role exists
    const radioGroup = container.querySelector('[role="radiogroup"]');
    expect(radioGroup).toBeInTheDocument();

    // Check that radio inputs are rendered
    const radioInput = container.querySelector('input[type="radio"]');
    expect(radioInput).toBeInTheDocument();
  });
});
