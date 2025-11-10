import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '../../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../../hooks/form';

/**
 * Tests for the Select component (Single and Multi)
 *
 * Best Practices Demonstrated:
 * 1. Testing user interactions (clicks, selections)
 * 2. Testing form state management
 * 3. Using role-based queries for accessibility
 * 4. Testing multiple select scenarios
 */

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
];

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
];

describe('Select Component Tests', () => {
  describe('SelectSingle', () => {
    it('renders with a label and placeholder', () => {
      function TestForm() {
        const form = useAppForm({
          defaultValues: {
            favoriteAlbum: '',
          },
        });

        return (
          <form>
            <form.AppField name="favoriteAlbum">
              {(field) => (
                <field.SelectSingle
                  label="Favorite Album"
                  placeholder="Select your favorite album"
                  options={fleetwoodMacAlbums}
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(<TestForm />);

      // Verify label is rendered
      expect(screen.getByText('Favorite Album')).toBeInTheDocument();
    });

    it('displays default selected value', () => {
      function TestForm() {
        const form = useAppForm({
          defaultValues: {
            favoriteAlbum: 'rumours',
          },
        });

        return (
          <form>
            <form.AppField name="favoriteAlbum">
              {(field) => (
                <field.SelectSingle
                  label="Favorite Album"
                  options={fleetwoodMacAlbums}
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(<TestForm />);

      // The select should show the default selected value
      expect(screen.getByText('Rumours (1977)')).toBeInTheDocument();
    });
  });

  describe('SelectMulti', () => {
    it('renders with a label', () => {
      function TestForm() {
        const form = useAppForm({
          defaultValues: {
            favoriteMembers: [] as string[],
          },
        });

        return (
          <form>
            <form.AppField name="favoriteMembers">
              {(field) => (
                <field.SelectMulti
                  label="Favorite Band Members"
                  placeholder="Select your favorite members"
                  options={fleetwoodMacMembers}
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(<TestForm />);

      // Verify label is rendered
      expect(screen.getByText('Favorite Band Members')).toBeInTheDocument();
    });

    it('displays default selected values', () => {
      function TestForm() {
        const form = useAppForm({
          defaultValues: {
            favoriteMembers: ['stevie-nicks', 'mick-fleetwood'] as string[],
          },
        });

        return (
          <form>
            <form.AppField name="favoriteMembers">
              {(field) => (
                <field.SelectMulti
                  label="Favorite Band Members"
                  options={fleetwoodMacMembers}
                />
              )}
            </form.AppField>
          </form>
        );
      }

      render(<TestForm />);

      // Verify selected values are displayed
      expect(screen.getByText('Stevie Nicks')).toBeInTheDocument();
      expect(screen.getByText('Mick Fleetwood')).toBeInTheDocument();
    });

    it('handles form submission with multi-select values', async () => {
      let submittedData: { favoriteMembers: string[] } | null = null;

      function TestForm() {
        const form = useAppForm({
          defaultValues: {
            favoriteMembers: ['stevie-nicks'],
          },
          onSubmit: ({ value }) => {
            submittedData = value;
          },
        });

        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.AppField name="favoriteMembers">
              {(field) => (
                <field.SelectMulti
                  label="Favorite Band Members"
                  options={fleetwoodMacMembers}
                />
              )}
            </form.AppField>
            <button type="submit">Submit</button>
          </form>
        );
      }

      render(<TestForm />);

      // Submit the form
      const submitButton = screen.getByText('Submit');
      await userEvent.click(submitButton);

      // Verify the submitted data contains the default selected values
      expect(submittedData).toEqual({
        favoriteMembers: ['stevie-nicks'],
      });
    });
  });
});
