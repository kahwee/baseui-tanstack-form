import React from 'react';
import { render, screen } from '@testing-library/react';
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

  describe('Textarea component', () => {
    it('allows entering text in the textarea', async () => {
      function TestTextareaForm() {
        const form = useAppForm({
          defaultValues: {
            comments: ''
          }
        });

        return (
          <form>
            <form.AppField name="comments">
              {(field) => <field.Input label="Comments" />}
            </form.AppField>
          </form>
        );
      }

      render(
        <TestWrapper>
          <TestTextareaForm />
        </TestWrapper>
      );

      // Find the textarea
      const textareaLabel = screen.getByText('Comments');
      const textarea = textareaLabel.closest('span')?.parentElement?.querySelector('textarea');
      expect(textarea).not.toBeNull();

      // Type text into the textarea
      if (textarea) {
        await userEvent.type(textarea, 'This is a test comment');
        // Check that the textarea value was updated
        expect(textarea).toHaveValue('This is a test comment');
      }
    });
  });

  describe('RadioGroup component', () => {
    it('allows selecting a radio option', async () => {
      function TestRadioForm() {
        const form = useAppForm({
          defaultValues: {
            preference: ''
          }
        });

        return (
          <form>
            <form.AppField name="preference">
              {(field) => (
                <field.RadioGroup
                  label="Preference"
                  options={[
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                    { label: 'Option C', value: 'c' }
                  ]}
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(
        <TestWrapper>
          <TestRadioForm />
        </TestWrapper>
      );

      // Find and click the "Option B" radio button
      const optionB = screen.getByText('Option B');
      expect(optionB).toBeInTheDocument();

      await userEvent.click(optionB);

      // Since we can't easily check the radio input's value directly,
      // verify the UI shows the option is selected
      // This will vary depending on how BaseUI styles the selected radio
      const radioInputB = optionB.closest('label')?.querySelector('input');
      expect(radioInputB).not.toBeNull();
      if (radioInputB) {
        // For radio buttons we can check if it's checked
        expect(radioInputB.checked).toBe(true);
      }
    });
  });
});