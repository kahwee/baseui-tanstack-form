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

  describe('CheckboxGroup component', () => {
    it('allows selecting multiple options', async () => {
      function TestCheckboxGroupForm() {
        const form = useAppForm({
          defaultValues: {
            hobbies: []
          }
        });

        return (
          <form>
            <form.AppField name="hobbies">
              {(field) => (
                <field.CheckboxGroup
                  label="Hobbies"
                  inline={true}
                  options={[
                    { value: 'reading', label: 'Reading' },
                    { value: 'gaming', label: 'Gaming' },
                    { value: 'cooking', label: 'Cooking' },
                    { value: 'sports', label: 'Sports' }
                  ]}
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(
        <TestWrapper>
          <TestCheckboxGroupForm />
        </TestWrapper>
      );

      // Find the checkbox labels
      const readingLabel = screen.getByText('Reading');
      const gamingLabel = screen.getByText('Gaming');
      expect(readingLabel).toBeInTheDocument();
      expect(gamingLabel).toBeInTheDocument();

      // Get the checkbox inputs
      const readingCheckbox = readingLabel.closest('label')?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      const gamingCheckbox = gamingLabel.closest('label')?.querySelector('input[type="checkbox"]') as HTMLInputElement;

      // Initially all checkboxes should be unchecked
      expect(readingCheckbox.checked).toBe(false);
      expect(gamingCheckbox.checked).toBe(false);

      // Select multiple options
      await userEvent.click(readingLabel);
      await userEvent.click(gamingLabel);

      // Verify both are checked
      expect(readingCheckbox.checked).toBe(true);
      expect(gamingCheckbox.checked).toBe(true);

      // Uncheck one option
      await userEvent.click(readingLabel);

      // Verify the state changed correctly
      expect(readingCheckbox.checked).toBe(false);
      expect(gamingCheckbox.checked).toBe(true);
    });
  });

});