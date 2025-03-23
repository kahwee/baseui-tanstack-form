import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Parent } from './page';
import { Block } from 'baseui/block';
import { useAppForm } from '../../hooks/form';
import { formOpts } from './shared-form';
import { GroupForm } from './group-form';
import { Group, GroupSchema } from './group-schema';

// Wrapper component with BaseUI styling
const GroupPageWrapper = () => (
  <Block width="100%" display="flex" justifyContent="center">
    <Parent />
  </Block>
);

// Beatles band members story with pre-filled data
const BeatlesGroupStory = () => {
  const form = useAppForm({
    ...formOpts,
    defaultValues: {
      name: 'The Beatles',
      people: [
        { firstName: 'John', lastName: 'Lennon', sex: 'male' },
        { firstName: 'Paul', lastName: 'McCartney', sex: 'male' },
        { firstName: 'George', lastName: 'Harrison', sex: 'male' },
        { firstName: 'Ringo', lastName: 'Starr', sex: 'male' }
      ]
    } as Group,
    validators: {
      onChange: GroupSchema
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
        <GroupForm form={form} title="The Beatles" />
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

export const BeatlesExample = {
  render: () => <BeatlesGroupStory />
};