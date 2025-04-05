import React from 'react';
import { render, screen } from '../../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

describe('Checkbox component', () => {
  // Helper function to create a test component with different props
  const createTestComponent = (
    initialValue = false,
    customProps = {},
    errorMessage = '',
  ) => {
    // Mock a validation function to test error state
    const validate = () => (errorMessage ? errorMessage : undefined);

    return function TestCheckboxForm() {
      const form = useAppForm({
        defaultValues: {
          agreed: initialValue,
        },
      });

      return (
        <form>
          <form.AppField name="agreed" validators={{ onChange: validate }}>
            {(field) => (
              <field.Checkbox
                label="I agree to the terms and conditions"
                {...customProps}
              />
            )}
          </form.AppField>
        </form>
      );
    };
  };

  it('renders with the correct label', () => {
    const TestComponent = createTestComponent();
    render(<TestComponent />);

    expect(
      screen.getByText('I agree to the terms and conditions'),
    ).toBeInTheDocument();
  });

  it('initializes unchecked by default', () => {
    const TestComponent = createTestComponent();
    render(<TestComponent />);

    const checkboxLabel = screen.getByText(
      'I agree to the terms and conditions',
    );
    const checkboxInput = checkboxLabel
      .closest('label')
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(checkboxInput.checked).toBe(false);
  });

  it('can initialize as checked', () => {
    const TestComponent = createTestComponent(true);
    render(<TestComponent />);

    const checkboxLabel = screen.getByText(
      'I agree to the terms and conditions',
    );
    const checkboxInput = checkboxLabel
      .closest('label')
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(checkboxInput.checked).toBe(true);
  });

  it('toggles when clicked', async () => {
    const TestComponent = createTestComponent();
    render(<TestComponent />);

    const checkboxLabel = screen.getByText(
      'I agree to the terms and conditions',
    );
    const checkboxInput = checkboxLabel
      .closest('label')
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // Initially unchecked
    expect(checkboxInput.checked).toBe(false);

    // Click to check
    await userEvent.click(checkboxLabel);
    expect(checkboxInput.checked).toBe(true);

    // Click to uncheck
    await userEvent.click(checkboxLabel);
    expect(checkboxInput.checked).toBe(false);
  });

  it('renders as disabled when disabled prop is true', async () => {
    const TestComponent = createTestComponent(false, { disabled: true });
    render(<TestComponent />);

    const checkboxLabel = screen.getByText(
      'I agree to the terms and conditions',
    );
    const checkboxInput = checkboxLabel
      .closest('label')
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // Verify it's disabled in the DOM
    expect(checkboxInput.disabled).toBe(true);
  });

  it('displays validation errors', async () => {
    const errorMessage = 'You must agree to the terms';
    const TestComponent = createTestComponent(false, {}, errorMessage);
    render(<TestComponent />);

    // Click to check and trigger validation
    const checkboxLabel = screen.getByText(
      'I agree to the terms and conditions',
    );
    await userEvent.click(checkboxLabel);

    // Verify error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
