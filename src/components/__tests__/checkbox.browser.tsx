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

  describe('Checkbox component', () => {
    it('renders with default value and can be toggled', async () => {
      function TestCheckboxForm() {
        const form = useAppForm({
          defaultValues: {
            agreed: false
          }
        });

        return (
          <form>
            <form.AppField name="agreed">
              {(field) => (
                <field.Checkbox
                  label="I agree to the terms and conditions"
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(
        <TestWrapper>
          <TestCheckboxForm />
        </TestWrapper>
      );

      // Find the checkbox label
      const checkboxLabel = screen.getByText('I agree to the terms and conditions');
      expect(checkboxLabel).toBeInTheDocument();

      // Find the checkbox input
      const checkboxInput = checkboxLabel.closest('label')?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkboxInput).not.toBeNull();

      // Initially it should be unchecked
      expect(checkboxInput.checked).toBe(false);

      // Click the checkbox to check it
      await userEvent.click(checkboxLabel);

      // Verify it's now checked
      expect(checkboxInput.checked).toBe(true);

      // Click again to uncheck
      await userEvent.click(checkboxLabel);

      // Verify it's unchecked again
      expect(checkboxInput.checked).toBe(false);
    });
  });

});