import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../hooks/form';
import { Block } from 'baseui/block';
import { Card, StyledBody } from 'baseui/card';
import { ParagraphSmall, LabelSmall } from 'baseui/typography';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupStoryProps {
  label: string;
  inline?: boolean;
  options: CheckboxOption[];
  defaultValues?: string[];
}

const CheckboxGroupStory = (args: CheckboxGroupStoryProps) => {
  const form = useAppForm({
    defaultValues: {
      selectedOptions: args.defaultValues || [],
    },
    onSubmit: ({ value }) => {
      console.info('Form submitted with values:', value);
      alert(`Selected: ${value.selectedOptions.join(', ')}`);
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
            <form.AppField name="selectedOptions" mode="array">
              {(field) => (
                <field.CheckboxGroup
                  label={args.label}
                  inline={args.inline}
                  options={args.options}
                />
              )}
            </form.AppField>

            <Block marginTop="16px">
              <LabelSmall>Selected Values:</LabelSmall>
              <ParagraphSmall color="contentSecondary">
                {form.state.values.selectedOptions.length > 0
                  ? form.state.values.selectedOptions.join(', ')
                  : 'None selected'}
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
  title: 'Form Components / CheckboxGroup',
  component: CheckboxGroupStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the checkbox group',
    },
    inline: {
      control: 'boolean',
      description: 'Display checkboxes horizontally',
    },
    options: {
      control: 'object',
      description: 'Array of checkbox options',
    },
    defaultValues: {
      control: 'object',
      description: 'Initially selected values',
    },
  },
} satisfies Meta<typeof CheckboxGroupStory>;

export default meta;
type Story = StoryObj<typeof meta>;

const interestsOptions: CheckboxOption[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'science', label: 'Science' },
  { value: 'art', label: 'Art' },
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
];

const programmingLanguages: CheckboxOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
];

const notificationPreferences: CheckboxOption[] = [
  { value: 'email', label: 'Email notifications' },
  { value: 'sms', label: 'SMS notifications' },
  { value: 'push', label: 'Push notifications' },
  { value: 'inapp', label: 'In-app notifications' },
];

const daysOfWeek: CheckboxOption[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export const Default: Story = {
  args: {
    label: 'Select your interests',
    inline: false,
    options: interestsOptions,
    defaultValues: [],
  },
};

export const Inline: Story = {
  args: {
    label: 'Programming Languages',
    inline: true,
    options: programmingLanguages,
    defaultValues: [],
  },
};

export const WithDefaultValues: Story = {
  args: {
    label: 'Notification Preferences',
    inline: false,
    options: notificationPreferences,
    defaultValues: ['email', 'push'],
  },
};

export const DaysOfWeek: Story = {
  args: {
    label: 'Select working days',
    inline: true,
    options: daysOfWeek,
    defaultValues: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
};

export const ManyOptions: Story = {
  args: {
    label: 'Select all that apply',
    inline: false,
    options: programmingLanguages,
    defaultValues: ['javascript', 'typescript'],
  },
};

export const CompactInline: Story = {
  args: {
    label: 'Notification channels',
    inline: true,
    options: notificationPreferences,
    defaultValues: [],
  },
};
