import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Parent } from '../features/group/page';
import { Block } from 'baseui/block';

// Wrapper component with BaseUI styling
const GroupPageWrapper = () => (
  <Block width="100%" display="flex" justifyContent="center">
    <Parent />
  </Block>
);

const meta = {
  title: 'Features/Group/Parent',
  component: GroupPageWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GroupPageWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
