import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Slider as Component } from './Slider';

export default {
  title: 'inputs/slider',
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => <Component {...args} />;

export const Slider = Template.bind({});
Slider.args = {
  label: 'Example',
};
