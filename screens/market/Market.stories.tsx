import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Market from './Market';
export default {
  title: 'Screens/Market',
  component: Market,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Market>;
const MarketTemplate: ComponentStory<typeof Market> = (args) => <Market />;
export const MarketScreen = MarketTemplate.bind({});

