import React from 'react';
import { withForm } from '../../hooks/form';
import { formOpts } from './shared-form';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { HeadingSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import Delete from 'baseui/icon/delete'

export const GroupForm = withForm({
  ...formOpts,
  // Optional, but adds props to the `render` function outside of `form`
  props: {
    title: 'Group Form',
  },
  render: ({ form, title }) => {
    return (
      <Card>
        <StyledBody>
          <HeadingSmall>{title}</HeadingSmall>
          <Block marginBottom="16px">
            <form.AppField
              name="name"
            >
              {(field) => <field.Input label="Band Name" />}
            </form.AppField>
            
            <form.AppField name="description">
              {(field) => <field.Textarea label="Description" />}
            </form.AppField>
            
            <form.AppField name="established">
              {(field) => <field.DatePicker label="Date Established" />}
            </form.AppField>
            
            <form.AppField name="genre">
              {(field) => (
                <field.SelectSingle
                  label="Genre"
                  options={[
                    { id: 'rock', label: 'Rock' },
                    { id: 'pop', label: 'Pop' },
                    { id: 'blues', label: 'Blues' },
                    { id: 'jazz', label: 'Jazz' },
                    { id: 'folk', label: 'Folk' }
                  ]}
                />
              )}
            </form.AppField>
            
            <form.AppField name="isActive">
              {(field) => <field.Checkbox label="Band is currently active" />}
            </form.AppField>
            
            <form.AppField name="albums">
              {(field) => (
                <field.SelectMulti
                  label="Notable Albums"
                  options={[
                    { id: 'Rumours', label: 'Rumours (1977)', description: 'Over 40 million copies sold worldwide' },
                    { id: 'Tusk', label: 'Tusk (1979)', description: 'Double album, experimental follow-up to Rumours' },
                    { id: 'Fleetwood Mac', label: 'Fleetwood Mac (1975)', description: 'Often called the "White Album"' },
                    { id: 'Mirage', label: 'Mirage (1982)', description: 'Return to more commercial sound' },
                    { id: 'Tango in the Night', label: 'Tango in the Night (1987)', description: 'Second-highest selling album' }
                  ]}
                />
              )}
            </form.AppField>
            
            <form.AppField name="awards">
              {(field) => (
                <field.CheckboxGroup
                  label="Awards Received"
                  inline={true}
                  options={[
                    { value: 'grammy', label: 'Grammy Award' },
                    { value: 'hall-of-fame', label: 'Rock & Roll Hall of Fame' },
                    { value: 'brit-award', label: 'Brit Award' },
                    { value: 'american-music', label: 'American Music Award' }
                  ]}
                />
              )}
            </form.AppField>
            <form.AppField
              mode='array'
              name="people"
            >{(field) => <div key={`s${field.state.value.length}`}>
                {field.state.value.map((_, index) => (
                  <Block key={index} marginBottom="16px" display="flex" flexDirection="column">
                    <Block display="flex" alignItems="center" justifyContent="space-between" marginBottom="8px">
                      <HeadingSmall margin="0">Person #{index + 1}</HeadingSmall>
                      <Button
                        kind="tertiary"
                        size="mini"
                        shape="circle"
                        onClick={() => {
                        // Remove this person from the array
                          field.removeValue(index);
                        }}
                      >
                        <Delete size={24} />
                      </Button>
                    </Block>
                    <form.AppField
                      name={`people[${index}].firstName`}
                    >
                      {(subField) => <subField.Input label="First name" />}
                    </form.AppField>
                    <form.AppField
                      name={`people[${index}].lastName`}
                    >
                      {(subField) => <subField.Input label="Last name" />}
                    </form.AppField>
                    <form.AppField
                      name={`people[${index}].bio`}
                    >
                      {(subField) => <subField.Textarea label="Biography" />}
                    </form.AppField>
                    <form.AppField
                      name={`people[${index}].sex`}
                    >
                      {(subField) => <subField.RadioGroup label="Sex" options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                      ]} />}
                    </form.AppField>
                    <form.AppField
                      name={`people[${index}].role`}
                    >
                      {(subField) => (
                        <subField.SelectSingle
                          label="Role in Band"
                          options={[
                            { id: 'Lead Vocalist', label: 'Lead Vocalist' },
                            { id: 'Guitarist', label: 'Guitarist' },
                            { id: 'Bassist', label: 'Bassist' },
                            { id: 'Drummer', label: 'Drummer' },
                            { id: 'Keyboardist', label: 'Keyboardist' }
                          ]}
                        />
                      )}
                    </form.AppField>
                    <form.AppField
                      name={`people[${index}].instruments`}
                    >
                      {(subField) => (
                        <subField.CheckboxGroup
                          label="Instruments Played"
                          inline={true}
                          options={[
                            { value: 'vocals', label: 'Vocals' },
                            { value: 'guitar', label: 'Guitar' },
                            { value: 'bass', label: 'Bass' },
                            { value: 'drums', label: 'Drums' },
                            { value: 'keyboard', label: 'Keyboard' },
                            { value: 'tambourine', label: 'Tambourine' }
                          ]}
                        />
                      )}
                    </form.AppField>
                    <form.AppField
                      name={`people[${index}].isOriginalMember`}
                    >
                      {(subField) => <subField.Checkbox label="Original Band Member" />}
                    </form.AppField>
                  </Block>
                ))}

                <Button onClick={() => field.pushValue({
                  firstName: '',
                  lastName: '',
                  bio: '',
                  sex: 'male',
                  role: '',
                  instruments: [],
                  isOriginalMember: false
                })}>Add Person</Button>
              </div>}
            </form.AppField>
          </Block>
        </StyledBody>
        <StyledAction>
          <form.AppForm>
            <form.SubscribeButton label="Submit" />
          </form.AppForm>
        </StyledAction>
      </Card>
    );
  },
});
