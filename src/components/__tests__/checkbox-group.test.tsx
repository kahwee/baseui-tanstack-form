import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '../../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

type TestSchema = {
  interests: string[];
};

describe('CheckboxGroup Component', () => {
  it('renders with label and options', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          interests: [],
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="interests">
            {(field) => (
              <field.CheckboxGroup
                label="Select your interests"
                options={[
                  { value: 'technology', label: 'Technology' },
                  { value: 'science', label: 'Science' },
                  { value: 'art', label: 'Art' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    expect(screen.getByText('Select your interests')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.getByText('Art')).toBeInTheDocument();
  });

  it('allows selecting multiple checkboxes', async () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          interests: [],
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="interests">
            {(field) => (
              <field.CheckboxGroup
                label="Select your interests"
                options={[
                  { value: 'technology', label: 'Technology' },
                  { value: 'science', label: 'Science' },
                  { value: 'art', label: 'Art' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const technologyCheckbox = screen
      .getByText('Technology')
      .closest('label')
      ?.querySelector('input');
    const scienceCheckbox = screen
      .getByText('Science')
      .closest('label')
      ?.querySelector('input');

    expect(technologyCheckbox).toBeInTheDocument();
    expect(scienceCheckbox).toBeInTheDocument();

    if (technologyCheckbox && scienceCheckbox) {
      // Initially unchecked
      expect(technologyCheckbox).not.toBeChecked();
      expect(scienceCheckbox).not.toBeChecked();

      // Check both boxes
      await userEvent.click(technologyCheckbox);
      await userEvent.click(scienceCheckbox);

      expect(technologyCheckbox).toBeChecked();
      expect(scienceCheckbox).toBeChecked();
    }
  });

  it('allows unchecking checkboxes', async () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          interests: ['technology'],
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="interests">
            {(field) => (
              <field.CheckboxGroup
                label="Select your interests"
                options={[
                  { value: 'technology', label: 'Technology' },
                  { value: 'science', label: 'Science' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const technologyCheckbox = screen
      .getByText('Technology')
      .closest('label')
      ?.querySelector('input');

    expect(technologyCheckbox).toBeInTheDocument();

    if (technologyCheckbox) {
      // Initially checked
      expect(technologyCheckbox).toBeChecked();

      // Uncheck
      await userEvent.click(technologyCheckbox);
      expect(technologyCheckbox).not.toBeChecked();
    }
  });

  it('renders with default values', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          interests: ['technology', 'art'],
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="interests">
            {(field) => (
              <field.CheckboxGroup
                label="Select your interests"
                options={[
                  { value: 'technology', label: 'Technology' },
                  { value: 'science', label: 'Science' },
                  { value: 'art', label: 'Art' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const technologyCheckbox = screen
      .getByText('Technology')
      .closest('label')
      ?.querySelector('input');
    const scienceCheckbox = screen
      .getByText('Science')
      .closest('label')
      ?.querySelector('input');
    const artCheckbox = screen
      .getByText('Art')
      .closest('label')
      ?.querySelector('input');

    expect(technologyCheckbox).toBeChecked();
    expect(scienceCheckbox).not.toBeChecked();
    expect(artCheckbox).toBeChecked();
  });

  it('displays checkboxes inline when inline prop is true', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          interests: [],
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="interests">
            {(field) => (
              <field.CheckboxGroup
                label="Select your interests"
                inline={true}
                options={[
                  { value: 'technology', label: 'Technology' },
                  { value: 'science', label: 'Science' },
                ]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    const { container } = render(<TestForm />);

    // Find the container div with role="group"
    const groupContainer = container.querySelector('[role="group"]');
    expect(groupContainer).toBeInTheDocument();
    expect(groupContainer).toHaveStyle({ display: 'flex' });
  });

  it('has proper ARIA attributes', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          interests: [],
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="interests">
            {(field) => (
              <field.CheckboxGroup
                label="Select your interests"
                options={[{ value: 'technology', label: 'Technology' }]}
              />
            )}
          </form.AppField>
        </form>
      );
    }

    const { container } = render(<TestForm />);

    const groupContainer = container.querySelector('[role="group"]');
    expect(groupContainer).toHaveAttribute(
      'aria-label',
      'Select your interests',
    );
  });
});
