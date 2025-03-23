import React from 'react';
import { withForm } from '../../hooks/form';
import { formOpts } from './shared-form';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { HeadingSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';

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
              {(field) => <field.InputField label="Name" />}
            </form.AppField>
            <form.AppField
              mode='array'
              name="people"
            >{(field) => <div key={`s${field.state.value.length}`}>
                {field.state.value.map((_, index) => (
                  <div key={index}>
                    <form.AppField
                      name={`people[${index}].firstName`}
                    >
                      {(subField) => <subField.InputField label="First name" />}
                    </form.AppField>
                    <form.AppField
                      name={`people[${index}].lastName`}
                    >{(subField) => <subField.InputField label="Last name" />}
                    </form.AppField>
                    <form.AppField
                      name={`people[${index}].sex`}
                    >{(subField) => <subField.RadioGroupField label="Sex" options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                      ]} />}</form.AppField>
                  </div>
                ))}

                <Button onClick={() => field.pushValue({
                  firstName: '',
                  lastName: '',
                  sex: 'male'
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
