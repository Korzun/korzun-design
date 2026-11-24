import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { Button } from '../../control/button/index.js';
import { AlertOctagonIcon, InfoCircleIcon } from '../../icon/index.js';
import { Card } from '../card/index.js';
import { Page } from '../page/index.js';
import { Stack } from '../stack/index.js';
import { Alert } from './index.js';

type Props = ComponentProps<typeof Alert>;

const tones = ['warning', 'danger', 'success', 'info'] as const;

export default {
  title: 'Component / Alert',
  args: { tone: 'warning', title: 'Frame is overdue', children: 'No check-in for 2h 14m.' },
  argTypes: {
    tone: { control: 'select', options: [...tones] },
    title: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <Alert {...args} />;

export const Tones: Story<Props> = () => (
  <Stack gap="md">
    {tones.map((tone) => (
      <Alert key={tone} tone={tone} title={`A ${tone} alert`}>
        Something worth reading.
      </Alert>
    ))}
  </Stack>
);

export const Variants: Story<Props> = () => (
  <Stack gap="md">
    <Alert tone="info">Body only.</Alert>
    <Alert tone="info" title="Title only" />
    <Alert tone="danger" title="With an icon" Icon={AlertOctagonIcon}>
      The upload failed.
    </Alert>
    <Alert
      tone="info"
      title="With an action"
      Icon={InfoCircleIcon}
      action={<Button>Details</Button>}
    >
      A new version is available.
    </Alert>
  </Stack>
);

export const OnPage: Story<Props> = () => (
  <Page>
    <Alert tone="warning" title="Frame is overdue" action={<Button>Retry</Button>}>
      No check-in for 2h 14m.
    </Alert>
  </Page>
);

export const InCard: Story<Props> = () => (
  <Page>
    <Card>
      <Alert tone="warning" title="Frame is overdue" action={<Button>Retry</Button>}>
        No check-in for 2h 14m.
      </Alert>
    </Card>
  </Page>
);
