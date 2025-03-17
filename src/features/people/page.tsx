import React from 'react';
import { useAppForm } from '../../hooks/form';
import { formOpts } from './shared-form';
import { ChildForm } from './nested-form';
import { Block } from 'baseui/block';
import { HeadingLarge } from 'baseui/typography';

export const Parent: React.FC = () => {
  const form = useAppForm({
    ...formOpts,
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
    }
  });

  return (
    <Block padding="24px" width="100%" maxWidth="800px" margin="0 auto">
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}>
      <HeadingLarge marginBottom="24px">People Form</HeadingLarge>
      <ChildForm form={form} title={'Testing'} />
      </form>
    </Block>
  );
};
