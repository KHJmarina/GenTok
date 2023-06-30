import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Detail from './Detail';
export default {
  title: 'Screens/Market',
  component: Detail,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Detail>;
const Template: ComponentStory<typeof Detail> = (args) => <Detail />;
export const DetailScreen = Template.bind({});
