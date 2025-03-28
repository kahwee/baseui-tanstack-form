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


  describe('Select component', () => {
    it('renders with default value and allows selection', async () => {
      function TestSelectForm() {
        const form = useAppForm({
          defaultValues: {
            color: 'blue'
          }
        });

        return (
          <form>
            <form.AppField name="color">
              {(field) => (
                <field.Select
                  label="Color"
                  options={[
                    { id: 'blue', label: 'Blue' },
                    { id: 'red', label: 'Red' },
                    { id: 'green', label: 'Green' }
                  ]}
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(
        <TestWrapper>
          <TestSelectForm />
        </TestWrapper>
      );

      // Check that the label is rendered
      expect(screen.getByText('Color')).toBeInTheDocument();

      // Open the select dropdown
      const selectInput = screen.getByRole('combobox');
      expect(selectInput).toBeInTheDocument();

      await userEvent.click(selectInput);

      // Find and click an option
      const redOption = await screen.findByText('Red');
      expect(redOption).toBeInTheDocument();

      await userEvent.click(redOption);

      // Verify the selection (checking for Red in the input)
      const redElements = screen.getAllByText('Red');
      expect(redElements.length).toBeGreaterThan(0);
    });

    it('supports multi-select mode', async () => {
      function TestMultiSelectForm() {
        const form = useAppForm({
          defaultValues: {
            colors: []
          }
        });

        return (
          <form>
            <form.AppField name="colors">
              {(field) => (
                <field.Select
                  label="Colors"
                  multi={true}
                  options={[
                    { id: 'blue', label: 'Blue' },
                    { id: 'red', label: 'Red' },
                    { id: 'green', label: 'Green' }
                  ]}
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(
        <TestWrapper>
          <TestMultiSelectForm />
        </TestWrapper>
      );

      // Open the select dropdown
      const selectInput = screen.getByRole('combobox');
      await userEvent.click(selectInput);

      // Select multiple options
      const blueOption = await screen.findByText('Blue');
      await userEvent.click(blueOption);

      // Reopen the dropdown to select another option
      await userEvent.click(selectInput);
      const greenOption = await screen.findByText('Green');
      await userEvent.click(greenOption);

      // Verify multiple selections appear
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
    });
  });
});