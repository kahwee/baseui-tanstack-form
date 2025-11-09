import React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
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
      options: {
        light: { name: 'light', value: LightTheme.colors.backgroundPrimary },
        dark: { name: 'dark', value: '#333333' }
      }
    },
  },

  decorators: [withBaseUI],

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
};

export default preview;