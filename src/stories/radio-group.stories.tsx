import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../hooks/form';
import { Block } from 'baseui/block';
import { Card, StyledBody } from 'baseui/card';
import { ParagraphSmall, LabelSmall } from 'baseui/typography';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupStoryProps {
  label: string;
  disabled?: boolean;
  options: RadioOption[];
  defaultValue?: string;
}

const RadioGroupStory = (args: RadioGroupStoryProps) => {
  const form = useAppForm({
    defaultValues: {
      selectedOption: args.defaultValue || '',
    },
    onSubmit: ({ value }) => {
      console.info('Form submitted with values:', value);
      alert(`Selected: ${value.selectedOption}`);
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
            <form.AppField name="selectedOption">
              {(field) => (
                <field.RadioGroup
                  label={args.label}
                  disabled={args.disabled}
                  options={args.options}
                />
              )}
            </form.AppField>

            <Block marginTop="16px">
              <LabelSmall>Selected Value:</LabelSmall>
              <ParagraphSmall color="contentSecondary">
                {form.state.values.selectedOption || 'None selected'}
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
  title: 'Form Components / RadioGroup',
  component: RadioGroupStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the radio group',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all radio buttons are disabled',
    },
    options: {
      control: 'object',
      description: 'Array of radio button options',
    },
    defaultValue: {
      control: 'text',
      description: 'Initially selected value',
    },
  },
} satisfies Meta<typeof RadioGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

const sizeOptions: RadioOption[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra Large' },
];

const shippingOptions: RadioOption[] = [
  { value: 'standard', label: 'Standard Shipping (5-7 business days)' },
  { value: 'express', label: 'Express Shipping (2-3 business days)' },
  { value: 'overnight', label: 'Overnight Shipping (next business day)' },
];

const paymentMethods: RadioOption[] = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'crypto', label: 'Cryptocurrency' },
];

const roleOptions: RadioOption[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'user', label: 'Regular User' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'guest', label: 'Guest' },
];

const subscriptionPlans: RadioOption[] = [
  { value: 'free', label: 'Free Plan - $0/month' },
  { value: 'basic', label: 'Basic Plan - $9.99/month' },
  { value: 'pro', label: 'Pro Plan - $19.99/month' },
  { value: 'enterprise', label: 'Enterprise Plan - Contact us' },
];

const yesNoOptions: RadioOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const Default: Story = {
  args: {
    label: 'Select a size',
    disabled: false,
    options: sizeOptions,
    defaultValue: '',
  },
};

export const Shipping: Story = {
  args: {
    label: 'Select shipping method',
    disabled: false,
    options: shippingOptions,
    defaultValue: 'standard',
  },
};

export const Payment: Story = {
  args: {
    label: 'Payment Method',
    disabled: false,
    options: paymentMethods,
    defaultValue: '',
  },
};

export const UserRole: Story = {
  args: {
    label: 'User Role',
    disabled: false,
    options: roleOptions,
    defaultValue: 'user',
  },
};

export const SubscriptionPlan: Story = {
  args: {
    label: 'Choose your subscription plan',
    disabled: false,
    options: subscriptionPlans,
    defaultValue: 'free',
  },
};

export const YesNo: Story = {
  args: {
    label: 'Would you like to receive our newsletter?',
    disabled: false,
    options: yesNoOptions,
    defaultValue: '',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Radio Group',
    disabled: true,
    options: sizeOptions,
    defaultValue: 'medium',
  },
};

export const WithDefaultSelection: Story = {
  args: {
    label: 'Select T-shirt size',
    disabled: false,
    options: sizeOptions,
    defaultValue: 'medium',
  },
};
