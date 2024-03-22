import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import '../scss/style.scss';

export default {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: themes.dark,
    },
  },
} satisfies Preview;
