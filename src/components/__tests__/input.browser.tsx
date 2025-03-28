import React from 'react';
import { render, screen } from '../../test-utils/rtl'; 
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

type TestSchema = {
    name: string,
    email: string
}

describe('Form Components', () => {

  describe('Input component', () => {
    it('renders with default value', async () => {
      // Create test component that sets up the form
      function TestInputForm() {
        const form = useAppForm({
          defaultValues: {
            name: 'John Doe',
            email: ''
          } as TestSchema
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

      // Find the input by type and value instead of test ID
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
            email: ''
          } as TestSchema
        });

        return (
          <form>
            <form.AppField
              name="email"
            >
              {(field) => <field.Input label="Email" />}
            </form.AppField>
          </form>
        );
      }

      // Render the component
      render(<TestEmailForm />);

      // Find the email input (initially empty)
      const emailLabel = screen.getByText('Email');
      const emailInput = emailLabel.closest('span')?.parentElement?.querySelector('input');
      expect(emailInput).not.toBeNull();

      // Input text into the email field
      if (emailInput) {
        await userEvent.type(emailInput, 'test@example.com');
        // Check that the input value was updated
        expect(emailInput).toHaveValue('test@example.com');
      }
    });
  });
});