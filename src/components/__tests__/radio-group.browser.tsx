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