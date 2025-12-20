import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '../../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

type TestSchema = {
  bio: string;
  comments: string;
};

describe('Textarea Component', () => {
  it('renders with default value', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          bio: 'Software developer',
          comments: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="bio">
            {(field) => <field.Textarea label="Biography" />}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const textarea = screen.getByDisplayValue('Software developer');
    expect(textarea).toBeInTheDocument();
    expect(screen.getByText('Biography')).toBeInTheDocument();
  });

  it('allows typing in the textarea field', async () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          bio: '',
          comments: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="comments">
            {(field) => <field.Textarea label="Comments" />}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const commentsLabel = screen.getByText('Comments');
    const textarea = commentsLabel
      .closest('span')
      ?.parentElement?.querySelector('textarea');

    expect(textarea).toBeInTheDocument();

    if (textarea) {
      await userEvent.type(
        textarea,
        'This is a test comment.\nWith multiple lines.',
      );
      expect(textarea).toHaveValue(
        'This is a test comment.\nWith multiple lines.',
      );
    }
  });

  it('displays placeholder text', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          bio: '',
          comments: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="bio">
            {(field) => (
              <field.Textarea
                label="Biography"
                placeholder="Tell us about yourself..."
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const textarea = screen.getByPlaceholderText('Tell us about yourself...');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute(
      'placeholder',
      'Tell us about yourself...',
    );
  });

  it('handles form submission with textarea', async () => {
    let submittedData: TestSchema | null = null;

    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          bio: '',
          comments: '',
        } as TestSchema,
        onSubmit: ({ value }) => {
          submittedData = value;
        },
      });

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="bio">
            {(field) => <field.Textarea label="Biography" />}
          </form.AppField>
          <form.AppField name="comments">
            {(field) => <field.Textarea label="Comments" />}
          </form.AppField>
          <button type="submit">Submit</button>
        </form>
      );
    }

    render(<TestForm />);

    const bioTextarea = screen.getByLabelText('Biography');
    const commentsTextarea = screen.getByLabelText('Comments');

    await userEvent.type(
      bioTextarea,
      'Full-stack developer with 5 years experience',
    );
    await userEvent.type(
      commentsTextarea,
      'Looking forward to working together!',
    );

    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    expect(submittedData).toEqual({
      bio: 'Full-stack developer with 5 years experience',
      comments: 'Looking forward to working together!',
    });
  });

  it('respects rows prop', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          bio: '',
          comments: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="bio">
            {(field) => <field.Textarea label="Biography" rows={5} />}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const textarea = screen.getByLabelText('Biography');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('has proper ARIA attributes', () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: {
          bio: '',
          comments: '',
        } as TestSchema,
      });

      return (
        <form>
          <form.AppField name="bio">
            {(field) => <field.Textarea label="Biography" />}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const textarea = screen.getByLabelText('Biography');
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
  });
});
