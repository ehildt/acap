import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { FaAd, FaHeart, FaSmile, FaVoteYea } from 'react-icons/fa';

import { Button as Component } from './Button';

export default {
  title: 'buttons/button',
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const { t } = useTranslation();
  const text = args.text ? t(args.text, { ns: 'common' }) : args.text;
  return <Component {...args} text={text} />;
};

export const ButtonText = Template.bind({});
ButtonText.args = {
  text: 'button.ok',
};

export const ButtonTextValueProxy = Template.bind({});
ButtonTextValueProxy.args = {
  text: 'button.ok',
  valueProxy(value) {
    return value
      .split('')
      .reverse()
      .reduce((str, char) => `${str}${char}`);
  },
};

export const ButtonIconBefore = Template.bind({});
ButtonIconBefore.args = {
  iconBefore: <FaAd />,
};

export const ButtonIconAfter = Template.bind({});
ButtonIconAfter.args = {
  iconAfter: <FaVoteYea />,
};

export const ButtonTextIconBefore = Template.bind({});
ButtonTextIconBefore.args = {
  text: 'button.ok',
  iconBefore: <FaAd />,
};

export const ButtonTextIconAfter = Template.bind({});
ButtonTextIconAfter.args = {
  text: 'button.save',
  iconAfter: <FaSmile />,
};

export const ButtonTextIconBeforeAfter = Template.bind({});
ButtonTextIconBeforeAfter.args = {
  text: 'button.submit',
  iconAfter: <FaSmile />,
  iconBefore: <FaAd />,
};

export const ButtonTextUpperCaseIconBeforeAfter = Template.bind({});
ButtonTextUpperCaseIconBeforeAfter.args = {
  text: 'button.cancel',
  iconAfter: <FaHeart color="var(--clr-primary-300)" size={'3rem'} />,
  iconBefore: <FaAd />,
  onClick(t) {
    console.log(t.textContent);
  },
};
