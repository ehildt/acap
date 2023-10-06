import '../src/scss/style.scss';
import type { Preview } from '@storybook/react';
import i18next, { SUPPORTED_LANGUAGES } from '../src/lang/i18next';

export default {
  parameters: {
    i18n: i18next,
    locales: SUPPORTED_LANGUAGES.reduce((acc, { name, title }) => ({ ...acc, [name]: title }), {}),
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
} satisfies Preview;

