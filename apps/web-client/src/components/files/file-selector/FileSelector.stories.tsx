import type { Meta, StoryObj } from '@storybook/react';

import { FileSelector } from './FileSelector';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'files/file-selector',
  component: FileSelector,
} satisfies Meta<typeof FileSelector>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const LogOnChangeEvent = {
  render: () => (
    <FileSelector
      label="Please select files to upload.."
      onChange={async ({ files }) => {
        files.forEach((f) => console.log(f.name));
      }}
    />
  ),
} satisfies StoryObj<typeof FileSelector>;
