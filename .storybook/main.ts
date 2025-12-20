import type { StorybookConfig } from '@storybook/react-vite';
import type { PluginOption } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  async viteFinal(config) {
    // Remove vite-plugin-dts from Storybook builds since we don't need type declarations
    if (config.plugins) {
      config.plugins = (config.plugins as PluginOption[]).filter((plugin) => {
        if (plugin && typeof plugin === 'object' && 'name' in plugin) {
          return plugin.name !== 'vite:dts';
        }
        return true;
      });
    }
    return config;
  }
};

export default config;