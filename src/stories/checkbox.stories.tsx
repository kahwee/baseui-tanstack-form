import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../hooks/form';
import { Block } from 'baseui/block';
import { Card, StyledBody } from 'baseui/card';
import { ParagraphSmall } from 'baseui/typography';

interface CheckboxStoryProps {
  label: string;
  disabled?: boolean;
  defaultChecked?: boolean;
}

const CheckboxStory = (args: CheckboxStoryProps) => {
  const form = useAppForm({
    defaultValues: {
      checkboxValue: args.defaultChecked || false,
    },
    onSubmit: ({ value }) => {
      console.info('Form submitted with values:', value);
      alert(`Checkbox is ${value.checkboxValue ? 'checked' : 'unchecked'}`);
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
            <form.AppField name="checkboxValue">
              {(field) => (
                <field.Checkbox label={args.label} disabled={args.disabled} />
              )}
            </form.AppField>

            <Block marginTop="16px">
              <ParagraphSmall color="contentSecondary">
                Current value:{' '}
                {form.state.values.checkboxValue ? 'Checked' : 'Unchecked'}
              </ParagraphSmall>
            </Block>

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
  title: 'Form Components / Checkbox',
  component: CheckboxStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed next to the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state of the checkbox',
    },
  },
} satisfies Meta<typeof CheckboxStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    disabled: false,
    defaultChecked: false,
  },
};

export const Newsletter: Story = {
  args: {
    label: 'Subscribe to our newsletter for updates and special offers',
    disabled: false,
    defaultChecked: false,
  },
};

export const RememberMe: Story = {
  args: {
    label: 'Remember me on this device',
    disabled: false,
    defaultChecked: true,
  },
};

export const Notifications: Story = {
  args: {
    label: 'Send me email notifications about important updates',
    disabled: false,
    defaultChecked: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'This checkbox is disabled',
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'This checkbox is disabled and checked',
    disabled: true,
    defaultChecked: true,
  },
};

export const Privacy: Story = {
  args: {
    label: 'I consent to the collection and processing of my personal data',
    disabled: false,
    defaultChecked: false,
  },
};

export const Marketing: Story = {
  args: {
    label:
      'I agree to receive marketing communications from this company and its partners',
    disabled: false,
    defaultChecked: false,
  },
};
