import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GroupForm } from '../features/group/nested-form';
import { useAppForm } from '../hooks/form';
import { formOpts } from '../features/group/shared-form';
import { Block } from 'baseui/block';

const GroupFormWrapper = (args: { title: string }) => {
  const form = useAppForm({
    ...formOpts,
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
    }
  });

  return (
    <Block
      width="100%"
      display="flex"
      justifyContent="center"
      padding="24px"
    >
      <Block maxWidth="500px" width="100%">
        <GroupForm form={form} {...args} />
      </Block>
    </Block>
  );
};

const meta = {
  title: 'Features / Group / GroupForm',
  component: GroupFormWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' }
  }
} satisfies Meta<typeof GroupFormWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Child Form Example',
  },
};
