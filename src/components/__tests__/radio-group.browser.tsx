import React from 'react';
import { render, screen } from '../../test-utils/rtl'; 
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

describe('RadioGroup component', () => {
  // Helper function to create a test component with different props
  const createTestComponent = (initialValue = '', customProps = {}, errorMessage = '') => {
    // Mock a validation function to test error state
    const validate = () => errorMessage ? errorMessage : undefined;
    
    return function TestRadioForm() {
      const form = useAppForm({
        defaultValues: {
          preference: initialValue
        }
      });

      return (
        <form>
          <form.AppField 
            name="preference"
            validators={{ onChange: validate }}
          >
            {(field) => (
              <field.RadioGroup
                label="Preference"
                options={[
                  { label: 'Option A', value: 'a' },
                  { label: 'Option B', value: 'b' },
                  { label: 'Option C', value: 'c', disabled: true }
                ]}
                {...customProps}
              />
            )}
          </form.AppField>
        </form>
      );
    };
  };

  it('renders all options with correct labels', async () => {
    const TestComponent = createTestComponent();
    render(<TestComponent />);

    // Verify label is displayed
    expect(screen.getByText('Preference')).toBeInTheDocument();
    
    // Verify all options are rendered
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('allows selecting a radio option', async () => {
    const TestComponent = createTestComponent();
    render(<TestComponent />);

    // Find and click the "Option B" radio button
    const optionB = screen.getByText('Option B');
    await userEvent.click(optionB);

    // Verify the radio input is checked
    const radioInputB = optionB.closest('label')?.querySelector('input');
    expect(radioInputB).not.toBeNull();
    expect(radioInputB?.checked).toBe(true);
    
    // Click option A and verify it becomes selected instead
    const optionA = screen.getByText('Option A');
    await userEvent.click(optionA);
    
    // Verify option A is checked and option B is unchecked
    const radioInputA = optionA.closest('label')?.querySelector('input');
    expect(radioInputA?.checked).toBe(true);
    expect(radioInputB?.checked).toBe(false);
  });

  it('properly initializes with default value', async () => {
    const TestComponent = createTestComponent('b');
    render(<TestComponent />);

    // Verify option B is checked initially
    const optionB = screen.getByText('Option B');
    const radioInputB = optionB.closest('label')?.querySelector('input');
    expect(radioInputB?.checked).toBe(true);
  });

  it('respects the disabled property on options', async () => {
    const TestComponent = createTestComponent();
    render(<TestComponent />);

    // Find the disabled option
    const optionC = screen.getByText('Option C');
    const radioInputC = optionC.closest('label')?.querySelector('input');
    
    // Verify it's disabled
    expect(radioInputC?.disabled).toBe(true);
  });

  it('displays validation errors', async () => {
    const errorMessage = 'Please select a valid option';
    const TestComponent = createTestComponent('', {}, errorMessage);
    render(<TestComponent />);

    // Select an option to trigger validation
    const optionA = screen.getByText('Option A');
    await userEvent.click(optionA);
    
    // Verify error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});