import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Parent } from '../features/people/page';
import { Block } from 'baseui/block';

// Wrapper component with BaseUI styling
const PeoplePageWrapper = () => (
  <Block width="100%" display="flex" justifyContent="center">
    <Parent />
  </Block>
);

const meta = {
  title: 'Features/People/Parent',
  component: PeoplePageWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PeoplePageWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
