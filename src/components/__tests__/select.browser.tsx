import React from 'react';
import { render, screen } from '../../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

describe('Select Components', () => {
  // Common test options
  const colorOptions = [
    { id: 'blue', label: 'Blue' },
    { id: 'red', label: 'Red' },
    { id: 'green', label: 'Green' },
    { id: 'yellow', label: 'Yellow', disabled: true },
  ];

  // Helper function to create a SelectSingle component test
  const createSingleSelectComponent = (
    initialValue = 'blue',
    customProps = {},
    errorMessage = '',
  ) => {
    // Mock a validation function to test error state
    const validate = () => (errorMessage ? errorMessage : undefined);

    return function TestSelectSingleForm() {
      const form = useAppForm({
        defaultValues: {
          color: initialValue,
        },
      });

      return (
        <form>
          <form.AppField name="color" validators={{ onChange: validate }}>
            {(field) => (
              <field.SelectSingle
                label="Color"
                options={colorOptions}
                placeholder="Select a color"
                {...customProps}
              />
            )}
          </form.AppField>
        </form>
      );
    };
  };

  // Helper for SelectMulti component test
  const createMultiSelectComponent = (
    initialValues: string[] = [],
    customProps = {},
    errorMessage = '',
  ) => {
    const validate = () => (errorMessage ? errorMessage : undefined);

    return function TestSelectMultiForm() {
      const form = useAppForm({
        defaultValues: {
          colors: initialValues,
        },
      });

      return (
        <form>
          <form.AppField name="colors" validators={{ onChange: validate }}>
            {(field) => (
              <field.SelectMulti
                label="Colors"
                options={colorOptions}
                placeholder="Select colors"
                {...customProps}
              />
            )}
          </form.AppField>
        </form>
      );
    };
  };

  describe('SelectSingle component', () => {
    it('renders with correct label and placeholder', async () => {
      const TestComponent = createSingleSelectComponent('');
      render(<TestComponent />);

      // Check label and placeholder
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('Select a color')).toBeInTheDocument();
    });

    it('displays initial selected value', async () => {
      const TestComponent = createSingleSelectComponent('blue');
      render(<TestComponent />);

      // Verify initial value is displayed (Blue should be visible as selected)
      expect(screen.getByText('Blue')).toBeInTheDocument();
    });

    it('allows selecting a different option', async () => {
      const TestComponent = createSingleSelectComponent('blue');
      render(<TestComponent />);

      // Open the dropdown
      const selectInput = screen.getByRole('combobox');
      await userEvent.click(selectInput);

      // Find and click the Red option
      const redOption = await screen.findByText('Red');
      await userEvent.click(redOption);

      // Verify Red is now selected by checking the aria-label on the combobox
      // This is more reliable than looking for text nodes when multiple elements contain the same text
      const updatedSelectInput = screen.getByRole('combobox');
      expect(updatedSelectInput.getAttribute('aria-label')).toContain(
        'Selected Red',
      );
    });

    it('includes a disabled option in the dropdown', async () => {
      const TestComponent = createSingleSelectComponent('blue');
      render(<TestComponent />);

      // Open the dropdown
      const selectInput = screen.getByRole('combobox');
      await userEvent.click(selectInput);

      // Check that the Yellow option is visible in the dropdown
      const yellowOption = await screen.findByText('Yellow');
      expect(yellowOption).toBeInTheDocument();

      // Note: Testing disabled state is implementation-specific to BaseUI
      // and might require different approach depending on the library version
    });

    it('displays validation errors', async () => {
      const errorMessage = 'Please select a valid color';
      const TestComponent = createSingleSelectComponent('', {}, errorMessage);
      render(<TestComponent />);

      // Open and select an option to trigger validation
      const selectInput = screen.getByRole('combobox');
      await userEvent.click(selectInput);

      const redOption = await screen.findByText('Red');
      await userEvent.click(redOption);

      // Verify error message appears
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('SelectMulti component', () => {
    it('initializes with empty selection', async () => {
      const TestComponent = createMultiSelectComponent();
      render(<TestComponent />);

      // Should display placeholder when no options are selected
      expect(screen.getByText('Select colors')).toBeInTheDocument();
    });

    it('initializes with preset values', async () => {
      const TestComponent = createMultiSelectComponent(['blue', 'red']);
      render(<TestComponent />);

      // Both colors should appear as selected
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Red')).toBeInTheDocument();
    });

    it('allows selecting multiple options', async () => {
      const TestComponent = createMultiSelectComponent();
      render(<TestComponent />);

      // Open dropdown and select Blue
      const selectInput = screen.getByRole('combobox');
      await userEvent.click(selectInput);

      const blueOption = await screen.findByText('Blue');
      await userEvent.click(blueOption);

      // Reopen dropdown and select Green
      await userEvent.click(selectInput);
      const greenOption = await screen.findByText('Green');
      await userEvent.click(greenOption);

      // Verify both options are selected
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
    });

    it('displays selected options as chips/tags', async () => {
      const TestComponent = createMultiSelectComponent(['blue', 'red']);
      render(<TestComponent />);

      // Both options should be visible initially as selected chips/tags
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Red')).toBeInTheDocument();

      // Testing that the clear functionality works would be better
      // with a dedicated integration test that can detect the specific
      // DOM structure of the BaseUI Select component
    });

    it('displays validation errors', async () => {
      const errorMessage = 'Please select at least two colors';
      const TestComponent = createMultiSelectComponent([], {}, errorMessage);
      render(<TestComponent />);

      // Select an option to trigger validation
      const selectInput = screen.getByRole('combobox');
      await userEvent.click(selectInput);

      const redOption = await screen.findByText('Red');
      await userEvent.click(redOption);

      // Verify error message appears
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
