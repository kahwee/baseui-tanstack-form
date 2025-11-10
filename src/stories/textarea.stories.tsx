import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../hooks/form';
import { Block } from 'baseui/block';
import { Card, StyledBody } from 'baseui/card';

interface TextareaStoryProps {
  label: string;
  placeholder: string;
  caption?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
}

const TextareaStory = (args: TextareaStoryProps) => {
  const form = useAppForm({
    defaultValues: {
      textareaValue: args.defaultValue || '',
    },
    onSubmit: async ({ value }) => {
      console.info('Form submitted with values:', value);
      alert(`Submitted: ${value.textareaValue}`);
    },
  });

  return (
    <Block padding="24px" width="100%" maxWidth="600px" margin="0 auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card>
          <StyledBody>
            <form.AppField name="textareaValue">
              {(field) => (
                <field.Textarea
                  label={args.label}
                  placeholder={args.placeholder}
                  disabled={args.disabled}
                  required={args.required}
                  rows={args.rows}
                  formControlProps={{
                    caption: args.caption,
                  }}
                />
              )}
            </form.AppField>

            <Block marginTop="16px">
              <form.AppForm>
                <form.SubscribeButton label="Submit" />
              </form.AppForm>
            </Block>
          </StyledBody>
        </Card>
      </form>
    </Block>
  );
};

const meta = {
  title: 'Form Components / Textarea',
  component: TextareaStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when textarea is empty',
    },
    caption: {
      control: 'text',
      description: 'Helper text displayed below the textarea',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the textarea is required',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Number of visible text rows',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial value of the textarea',
    },
  },
} satisfies Meta<typeof TextareaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter your description here...',
    caption: 'Provide as much detail as possible',
    disabled: false,
    required: false,
    rows: 4,
    defaultValue: '',
  },
};

export const Biography: Story = {
  args: {
    label: 'Biography',
    placeholder: 'Tell us about yourself...',
    caption: 'Maximum 500 characters',
    disabled: false,
    required: true,
    rows: 6,
    defaultValue: '',
  },
};

export const Comments: Story = {
  args: {
    label: 'Comments',
    placeholder: 'Leave your feedback or comments...',
    caption: 'Your feedback helps us improve',
    disabled: false,
    required: false,
    rows: 5,
    defaultValue: '',
  },
};

export const Address: Story = {
  args: {
    label: 'Mailing Address',
    placeholder: 'Enter your complete mailing address',
    caption: 'Include street, city, state, and zip code',
    disabled: false,
    required: true,
    rows: 3,
    defaultValue: '',
  },
};

export const LargeText: Story = {
  args: {
    label: 'Article Content',
    placeholder: 'Write your article here...',
    caption: 'This is a larger text area for longer content',
    disabled: false,
    required: false,
    rows: 12,
    defaultValue: '',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read-Only Content',
    placeholder: 'This textarea is disabled',
    caption: 'You cannot edit this content',
    disabled: true,
    required: false,
    rows: 4,
    defaultValue: 'This is some pre-filled content that cannot be edited.',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Add your notes...',
    caption: 'Edit the pre-filled notes',
    disabled: false,
    required: false,
    rows: 4,
    defaultValue:
      'These are some initial notes that were previously saved.\nYou can edit them as needed.',
  },
};
