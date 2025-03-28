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

describe('Form Components', () => {

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
              {(field) => <field.Textarea label="Comments" />}
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
});