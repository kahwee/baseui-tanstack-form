import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Parent } from './page';
import { Block } from 'baseui/block';
import { useAppForm } from '../../hooks/form';
import { formOpts } from './shared-form';
import { GroupForm } from './group-form';
import { Group, groupSchema } from './group-schema';

// Wrapper component with BaseUI styling
const GroupPageWrapper = () => (
  <Block width="100%" display="flex" justifyContent="center">
    <Parent />
  </Block>
);

// Fleetwood Mac band members story with pre-filled data
const FleetwoodMacGroupStory = () => {
  const form = useAppForm({
    ...formOpts,
    defaultValues: {
      name: 'Fleetwood Mac',
      people: [
        { firstName: 'Stevie', lastName: 'Nicks', sex: 'female' },
        { firstName: 'Christine', lastName: 'McVie', sex: 'female' },
        { firstName: 'Lindsey', lastName: 'Buckingham', sex: 'male' },
        { firstName: 'Mick', lastName: 'Fleetwood', sex: 'male' },
        { firstName: 'John', lastName: 'McVie', sex: 'male' }
      ]
    } as Group,
    validators: {
      onBlur: ({ value }) => {
        const result = groupSchema.safeParse(value)
        if (result.success) {
          return undefined;
        } else {
          return result.error.format();
        }
      }
    },
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
    }
  });

  return (
    <Block padding="24px" width="100%" maxWidth="800px" margin="0 auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}>
        <GroupForm form={form} title="Fleetwood Mac" />
      </form>
    </Block>
  );
};

const meta = {
  title: 'Features / Group',
  component: GroupPageWrapper,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GroupPageWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const FleetwoodMacExample = {
  render: () => <FleetwoodMacGroupStory />
};