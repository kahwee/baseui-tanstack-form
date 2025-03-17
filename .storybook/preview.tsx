import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { themes } from '@storybook/theming';
import { LightTheme, BaseProvider } from 'baseui';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as Styletron } from 'styletron-engine-atomic';

// Initialize Styletron
const engine = new Styletron();

// BaseUI decorator to wrap all stories
export const withBaseUI: Decorator = (Story) => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Story />
      </BaseProvider>
    </StyletronProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: LightTheme.colors.backgroundPrimary },
        { name: 'dark', value: '#333333' },
      ],
    },
    docs: {
      theme: themes.light,
    },
  },
  decorators: [withBaseUI],
};

export default preview;