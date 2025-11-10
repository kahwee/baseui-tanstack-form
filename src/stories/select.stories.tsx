import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../hooks/form';
import { Block } from 'baseui/block';
import { Card, StyledBody } from 'baseui/card';
import { HeadingSmall, LabelSmall } from 'baseui/typography';

// Fleetwood Mac members data
const fleetwoodMacMembers = [
  {
    id: 'stevie-nicks',
    label: 'Stevie Nicks',
    description: 'Vocals, Tambourine',
  },
  {
    id: 'christine-mcvie',
    label: 'Christine McVie',
    description: 'Keyboard, Vocals',
  },
  {
    id: 'lindsey-buckingham',
    label: 'Lindsey Buckingham',
    description: 'Guitar, Vocals',
  },
  { id: 'mick-fleetwood', label: 'Mick Fleetwood', description: 'Drums' },
  { id: 'john-mcvie', label: 'John McVie', description: 'Bass Guitar' },
  {
    id: 'peter-green',
    label: 'Peter Green',
    description: 'Guitar, Vocals (Former Member)',
    disabled: true,
  },
];

// Fleetwood Mac albums data
const fleetwoodMacAlbums = [
  {
    id: 'rumours',
    label: 'Rumours (1977)',
    description: 'Over 40 million copies sold worldwide',
  },
  {
    id: 'tusk',
    label: 'Tusk (1979)',
    description: 'Double album, experimental follow-up to Rumours',
  },
  {
    id: 'fleetwood-mac',
    label: 'Fleetwood Mac (1975)',
    description: 'Often called the "White Album"',
  },
  {
    id: 'mirage',
    label: 'Mirage (1982)',
    description: 'Return to more commercial sound',
  },
  {
    id: 'tango-in-the-night',
    label: 'Tango in the Night (1987)',
    description: 'Second-highest selling album',
  },
];

// Interface prefixed with _ to comply with ESLint unused var rule
interface _FormValues {
  favoriteAlbum: string;
  favoriteMembers: string[];
  currentMembers: string[];
}

// Demo component for select stories
const SelectStoryComponent = () => {
  const form = useAppForm({
    defaultValues: {
      favoriteAlbum: 'rumours',
      favoriteMembers: ['stevie-nicks', 'mick-fleetwood'],
      currentMembers: [
        'stevie-nicks',
        'lindsey-buckingham',
        'mick-fleetwood',
        'john-mcvie',
      ],
    },
    onSubmit: (values) => {
      // Log to browser console but use warn to comply with ESLint rules
      console.warn('Form submitted with values:', values);
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
        <Card>
          <StyledBody>
            <HeadingSmall>Fleetwood Mac Fan Form</HeadingSmall>

            {/* SelectSingle component */}
            <Block marginBottom="16px">
              <form.AppField name="favoriteAlbum">
                {(field) => (
                  <field.SelectSingle
                    label="Favorite Fleetwood Mac Album"
                    options={fleetwoodMacAlbums}
                    placeholder="Select your favorite album"
                  />
                )}
              </form.AppField>
            </Block>

            {/* SelectMulti component */}
            <Block marginBottom="16px">
              <form.AppField name="favoriteMembers">
                {(field) => (
                  <field.SelectMulti
                    label="Favorite Band Members"
                    options={fleetwoodMacMembers}
                    placeholder="Select your favorite members"
                  />
                )}
              </form.AppField>
            </Block>

            {/* Additional SelectMulti example */}
            <Block marginBottom="16px">
              <form.AppField name="currentMembers">
                {(field) => (
                  <field.SelectMulti
                    label="Current Band Lineup"
                    options={fleetwoodMacMembers}
                    placeholder="Select current members"
                  />
                )}
              </form.AppField>
            </Block>

            {/* Display selected values */}
            <Block marginTop="24px">
              <LabelSmall>Form Values (Updated in Real-time):</LabelSmall>
              <pre
                style={{
                  background: '#f0f0f0',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                {JSON.stringify(
                  {
                    favoriteAlbum: form.getFieldValue('favoriteAlbum'),
                    favoriteMembers: form.getFieldValue('favoriteMembers'),
                    currentMembers: form.getFieldValue('currentMembers'),
                  },
                  null,
                  2,
                )}
              </pre>
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
  title: 'Components / Select',
  component: SelectStoryComponent,
} satisfies Meta<typeof SelectStoryComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
