import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
      description: 'British-American rock band formed in London in 1967.',
      established: new Date('1967-07-11'),
      genre: 'rock',
      isActive: true,
      albums: ['Rumours', 'Tusk', 'Fleetwood Mac'],
      awards: ['grammy', 'hall-of-fame'],
      people: [
        {
          firstName: 'Stevie',
          lastName: 'Nicks',
          sex: 'female',
          bio: 'American singer-songwriter known for her mystical stage persona.',
          role: 'Lead Vocalist',
          instruments: ['vocals', 'tambourine'],
          isOriginalMember: false,
        },
        {
          firstName: 'Christine',
          lastName: 'McVie',
          sex: 'female',
          bio: 'English musician and vocalist who played keyboard.',
          role: 'Keyboardist',
          instruments: ['keyboard', 'vocals'],
          isOriginalMember: false,
        },
        {
          firstName: 'Lindsey',
          lastName: 'Buckingham',
          sex: 'male',
          bio: 'American musician, singer, songwriter, and producer.',
          role: 'Lead Guitarist',
          instruments: ['guitar', 'vocals'],
          isOriginalMember: false,
        },
        {
          firstName: 'Mick',
          lastName: 'Fleetwood',
          sex: 'male',
          bio: 'British musician and co-founder of Fleetwood Mac.',
          role: 'Drummer',
          instruments: ['drums'],
          isOriginalMember: true,
        },
        {
          firstName: 'John',
          lastName: 'McVie',
          sex: 'male',
          bio: 'British bass guitarist and co-founder of Fleetwood Mac.',
          role: 'Bassist',
          instruments: ['bass'],
          isOriginalMember: true,
        },
      ],
    } as Group,
    validators: {
      onBlur: ({ value }) => {
        const result = groupSchema.safeParse(value);
        if (result.success) {
          return undefined;
        } else {
          return result.error.format();
        }
      },
    },
    onSubmit: (values) => {
      console.info('Form submitted with values:', values);
    },
  });

  return (
    <Block padding="24px" width="100%" maxWidth="800px" margin="0 auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <GroupForm form={form} title="Fleetwood Mac" />
      </form>
    </Block>
  );
};

const meta = {
  title: 'Complete Forms / Group Management',
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
  render: () => <FleetwoodMacGroupStory />,
};
