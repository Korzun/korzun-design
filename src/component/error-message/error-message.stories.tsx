import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { TextInput } from '../../control/text-input/index.js';
import { Stack } from '../stack/index.js';
import { Text } from '../text/index.js';
import { ErrorMessage } from './index.js';

type Props = ComponentProps<typeof ErrorMessage>;

export default {
  title: 'Component / ErrorMessage',
  args: { as: 'p', children: 'Could not save the book.' },
  argTypes: {
    as: { control: 'select', options: ['p', 'div', 'span'] },
    children: { control: 'text' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <ErrorMessage {...args} />;

export const UnderAField: Story<Props> = () => (
  <Stack gap="sm">
    <TextInput name="title" value="" label="Title" layout="vertical" />
    <ErrorMessage id="title-error">Title is required.</ErrorMessage>
  </Stack>
);

export const Empty: Story<Props> = () => (
  <Stack gap="sm">
    <ErrorMessage>{undefined}</ErrorMessage>
    <Text as="p" size="sm" tone="muted">
      The ErrorMessage above has no children, so it renders nothing.
    </Text>
  </Stack>
);
