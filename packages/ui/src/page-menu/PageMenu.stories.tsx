import { ComponentStory, Meta } from '@storybook/react';

import { PageMenu as Component } from './PageMenu';
import { PageMenuItem } from './PageMenuItem';

export default {
  title: 'menus/page-menu',
  component: Component,
  decorators: [(Story) => <div style={{ width: '20rem' }}>{Story()}</div>],
} as Meta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>
    <PageMenuItem>Intro</PageMenuItem>
    <PageMenuItem>SoftSkills</PageMenuItem>
    <PageMenuItem>SkillTree</PageMenuItem>
    <PageMenuItem>Career</PageMenuItem>
    <PageMenuItem>Education</PageMenuItem>
  </Component>
);

export const PageMenu = Template.bind({});
