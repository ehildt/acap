import { Meta, StoryObj } from '@storybook/react';

import { PageMenu } from './PageMenu';
import { PageMenuItem } from './PageMenuItem';

export default {
  title: 'menus/page-menu',
  component: PageMenu,
  decorators: [(story) => <div style={{ width: '20rem' }}>{story()}</div>],
} satisfies Meta<typeof PageMenu>;

export const DefaultPageMenu = {
  render: (args) => (
    <PageMenu {...args}>
      <PageMenuItem>Intro</PageMenuItem>
      <PageMenuItem>SoftSkills</PageMenuItem>
      <PageMenuItem>SkillTree</PageMenuItem>
      <PageMenuItem>Career</PageMenuItem>
      <PageMenuItem>Education</PageMenuItem>
    </PageMenu>
  ),
} satisfies StoryObj<typeof PageMenu>;
