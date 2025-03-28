import React from 'react';
import { render, screen, } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import userEvent from '@testing-library/user-event';
// Import the form hook directly from the app
import { useAppForm } from '../../hooks/form';

// Set up Styletron for BaseUI components
const engine = new Styletron();

// Test wrapper component that provides all necessary context providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        {children}
      </BaseProvider>
    </StyletronProvider>
  );
}

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

      // Render the test component wrapped in providers
      render(
        <TestWrapper>
          <TestInputForm />
        </TestWrapper>
      );

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
      render(
        <TestWrapper>
          <TestEmailForm />
        </TestWrapper>
      );

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