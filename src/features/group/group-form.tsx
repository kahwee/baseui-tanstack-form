import React from 'react';
import { withForm } from '../../hooks/form';
import { formOpts } from './shared-form';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { HeadingSmall } from 'baseui/typography';
import { Block } from 'baseui/block';

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
