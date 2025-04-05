import React from 'react';
import { render, screen } from '../../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

describe('Form Components', () => {
  describe('Textarea component', () => {
    it('allows entering text in the textarea', async () => {
      function TestTextareaForm() {
        const form = useAppForm({
          defaultValues: {
            comments: '',
          },
        });

        return (
          <form>
            <form.AppField name="comments">
              {(field) => <field.Textarea label="Comments" />}
            </form.AppField>
          </form>
        );
      }

      render(<TestTextareaForm />);

      // Find the textarea
      const textareaLabel = screen.getByText('Comments');
      const textarea = textareaLabel
        .closest('span')
        ?.parentElement?.querySelector('textarea');
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
