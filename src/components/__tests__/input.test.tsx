import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '../../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

type TestSchema = {
  name: string;
  email: string;
};

describe('Form Components', () => {
  describe('Input component', () => {
    it('renders with default value', async () => {
      // Create test component that sets up the form
      function TestInputForm() {
        const form = useAppForm({
          defaultValues: {
            name: 'John Doe',
            email: '',
          } as TestSchema,
        });

        return (
          <form>
            <form.AppField name="name">
              {(field) => <field.Input label="Name" data-testid="name-input" />}
            </form.AppField>
          </form>
        );
      }

      // Render the test component
      render(<TestInputForm />);

      // Find the input by value
      const input = screen.getByDisplayValue('John Doe');
      expect(input).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('allows typing in the input field', async () => {
      // Create a test component with a basic email field
      function TestEmailForm() {
        const form = useAppForm({
          defaultValues: {
            name: 'John Doe',
            email: '',
          } as TestSchema,
        });

        return (
          <form>
            <form.AppField name="email">
              {(field) => <field.Input label="Email" />}
            </form.AppField>
          </form>
        );
      }

      // Render the component
      render(<TestEmailForm />);

      // Find the email input (initially empty)
      const emailLabel = screen.getByText('Email');
      const emailInput = emailLabel
        .closest('span')
        ?.parentElement?.querySelector('input');
      expect(emailInput).not.toBeNull();

      // Input text into the email field
      if (emailInput) {
        await userEvent.type(emailInput, 'test@example.com');
        // Check that the input value was updated
        expect(emailInput).toHaveValue('test@example.com');
      }
    });

    it('displays placeholder text', async () => {
      // Test that placeholder attribute is properly rendered
      function TestPlaceholderForm() {
        const form = useAppForm({
          defaultValues: {
            name: '',
            email: '',
          } as TestSchema,
        });

        return (
          <form>
            <form.AppField name="email">
              {(field) => (
                <field.Input
                  label="Email Address"
                  placeholder="your.email@example.com"
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(<TestPlaceholderForm />);

      // Find input by placeholder text
      const input = screen.getByPlaceholderText('your.email@example.com');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'your.email@example.com');
    });

    it('handles form submission', async () => {
      let submittedData: TestSchema | null = null;

      function TestSubmitForm() {
        const form = useAppForm({
          defaultValues: {
            name: '',
            email: '',
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
            <form.AppField name="name">
              {(field) => <field.Input label="Name" />}
            </form.AppField>
            <form.AppField name="email">
              {(field) => <field.Input label="Email" />}
            </form.AppField>
            <button type="submit">Submit</button>
          </form>
        );
      }

      render(<TestSubmitForm />);

      // Fill out the form
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');

      await userEvent.type(nameInput, 'Jane Smith');
      await userEvent.type(emailInput, 'jane@example.com');

      // Submit the form
      const submitButton = screen.getByText('Submit');
      await userEvent.click(submitButton);

      // Verify submission data
      expect(submittedData).toEqual({
        name: 'Jane Smith',
        email: 'jane@example.com',
      });
    });
  });
});
