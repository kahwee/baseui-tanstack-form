import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../../hooks/form';
import { formOpts } from '../group/shared-form';
import { Block } from 'baseui/block';
import { GroupForm } from '../group/group-form';

const GroupFormWrapper = (args: { title: string }) => {
  const form = useAppForm({
    ...formOpts,
    onSubmit: (values) => {
      console.info('Form submitted with values:', values);
    },
  });

  return (
    <Block width="100%" display="flex" justifyContent="center" padding="24px">
      <Block maxWidth="500px" width="100%">
        <GroupForm form={form} {...args} />
      </Block>
    </Block>
  );
};

const meta = {
  title: 'Form Components / GroupForm',
  component: GroupFormWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof GroupFormWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Child Form Example',
  },
};
