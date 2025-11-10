import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../hooks/form';
import { Block } from 'baseui/block';
import { Card, StyledBody } from 'baseui/card';
import { ParagraphSmall, LabelSmall } from 'baseui/typography';

interface DatePickerStoryProps {
  label: string;
  disabled?: boolean;
  range?: boolean;
  defaultDate?: Date | null;
}

const DatePickerStory = (args: DatePickerStoryProps) => {
  const form = useAppForm({
    defaultValues: {
      dateValue: args.defaultDate || null,
    },
    onSubmit: ({ value }) => {
      console.info('Form submitted with values:', value);
      alert(
        `Selected date: ${value.dateValue ? new Date(value.dateValue).toLocaleDateString() : 'None'}`,
      );
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
            <form.AppField name="dateValue">
              {(field) => (
                <field.DatePicker
                  label={args.label}
                  disabled={args.disabled}
                  range={args.range}
                />
              )}
            </form.AppField>

            <Block marginTop="16px">
              <LabelSmall>Selected Date:</LabelSmall>
              <ParagraphSmall color="contentSecondary">
                {form.state.values.dateValue
                  ? new Date(form.state.values.dateValue).toLocaleDateString()
                  : 'No date selected'}
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
  title: 'Form Components / DatePicker',
  component: DatePickerStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the date picker',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the date picker is disabled',
    },
    range: {
      control: 'boolean',
      description: 'Enable date range selection',
    },
    defaultDate: {
      control: 'date',
      description: 'Initial date value',
    },
  },
} satisfies Meta<typeof DatePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Select a date',
    disabled: false,
    range: false,
    defaultDate: null,
  },
};

export const BirthDate: Story = {
  args: {
    label: 'Date of Birth',
    disabled: false,
    range: false,
    defaultDate: null,
  },
};

export const AppointmentDate: Story = {
  args: {
    label: 'Appointment Date',
    disabled: false,
    range: false,
    defaultDate: new Date(),
  },
};

export const WithDefaultDate: Story = {
  args: {
    label: 'Start Date',
    disabled: false,
    range: false,
    defaultDate: new Date('2024-01-15'),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Date Picker',
    disabled: true,
    range: false,
    defaultDate: new Date(),
  },
};

export const EventDate: Story = {
  args: {
    label: 'Event Date',
    disabled: false,
    range: false,
    defaultDate: null,
  },
};

export const DeadlineDate: Story = {
  args: {
    label: 'Project Deadline',
    disabled: false,
    range: false,
    defaultDate: null,
  },
};
