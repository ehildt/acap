import type { Meta, StoryObj } from '@storybook/react';

import { FileImporter } from './FileImporter';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'files/file-importer',
  component: FileImporter,
} satisfies Meta<typeof FileImporter>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Importer = {
  render: () => <FileImporter />,
} satisfies StoryObj<typeof FileImporter>;
