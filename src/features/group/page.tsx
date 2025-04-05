import React from 'react';
import { useAppForm } from '../../hooks/form';
import { formOpts } from '../../features/group/shared-form';
import { GroupForm } from './group-form';
import { Block } from 'baseui/block';
import { HeadingLarge } from 'baseui/typography';
import { groupSchema } from './group-schema';

export const Parent: React.FC = () => {
  const form = useAppForm({
    ...formOpts,
    validators: {
      onBlur: (values) => {
        const result = groupSchema.safeParse(values);
        if (result.success) {
          return undefined;
        } else {
          return "whater'"; //result.error.format();
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
          form.handleSubmit();
        }}
      >
        <HeadingLarge marginBottom="24px">Group Form</HeadingLarge>
        <GroupForm form={form} title="Groups" />
      </form>
    </Block>
  );
};
