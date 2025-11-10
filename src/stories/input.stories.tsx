import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../hooks/form';
import { Block } from 'baseui/block';
import { Card, StyledBody } from 'baseui/card';

interface InputStoryProps {
  label: string;
  placeholder: string;
  type: string;
  caption?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
}

const InputStory = (args: InputStoryProps) => {
  const form = useAppForm({
    defaultValues: {
      inputValue: args.defaultValue || '',
    },
    onSubmit: async ({ value }) => {
      console.info('Form submitted with values:', value);
      alert(`Submitted: ${value.inputValue}`);
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
            <form.AppField name="inputValue">
              {(field) => (
                <field.Input
                  label={args.label}
                  placeholder={args.placeholder}
                  type={args.type}
                  disabled={args.disabled}
                  required={args.required}
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
  title: 'Form Components / Input',
  component: InputStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when input is empty',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'HTML input type',
    },
    caption: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial value of the input',
    },
  },
} satisfies Meta<typeof InputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    type: 'text',
    caption: 'Choose a unique username',
    disabled: false,
    required: false,
    defaultValue: '',
  },
};

export const Email: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'your.email@example.com',
    type: 'email',
    caption: 'We will never share your email',
    disabled: false,
    required: true,
    defaultValue: '',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter a strong password',
    type: 'password',
    caption: 'Must be at least 8 characters',
    disabled: false,
    required: true,
    defaultValue: '',
  },
};

export const Number: Story = {
  args: {
    label: 'Age',
    placeholder: 'Enter your age',
    type: 'number',
    caption: 'Must be 18 or older',
    disabled: false,
    required: false,
    defaultValue: '',
  },
};

export const Phone: Story = {
  args: {
    label: 'Phone Number',
    placeholder: '(555) 123-4567',
    type: 'tel',
    caption: 'Include country code if international',
    disabled: false,
    required: false,
    defaultValue: '',
  },
};

export const URL: Story = {
  args: {
    label: 'Website',
    placeholder: 'https://yourwebsite.com',
    type: 'url',
    caption: 'Must be a valid URL',
    disabled: false,
    required: false,
    defaultValue: '',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    type: 'text',
    caption: 'You cannot edit this field',
    disabled: true,
    required: false,
    defaultValue: 'Pre-filled value',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    type: 'text',
    caption: 'As it appears on your ID',
    disabled: false,
    required: true,
    defaultValue: 'John Doe',
  },
};
