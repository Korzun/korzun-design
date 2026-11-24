import { FRUITS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { Button } from '../../control/button/index.js';
import { Dialog } from '../../control/dialog/index.js';
import { Select } from '../../control/select/index.js';
import { useTheme } from '../../theme/index.js';
import { Card } from '../card/index.js';
import { Page } from '../page/index.js';
import { Stack } from '../stack/index.js';
import { Text } from '../text/index.js';
import { Surface, useSurfaceRadius } from './index.js';

type Props = ComponentProps<typeof Surface>;

export default {
  title: 'Component / Surface',
} satisfies StoryDefault<Props>;

const InsetBox = ({ children }: Props) => {
  const theme = useTheme();
  const borderRadius = useSurfaceRadius();
  return (
    <div
      style={{
        borderRadius,
        border: `1px solid ${theme.color.border.default}`,
        padding: theme.fontSize.md,
      }}
    >
      <Surface>{children}</Surface>
    </div>
  );
};

export const InsetBoxInCard: Story<Props> = () => (
  <Card title="Card">
    <InsetBox>
      <Text>
        A hand-made box. Its corners follow the card and the button inside is one step smaller.
      </Text>
      <Button>Action</Button>
    </InsetBox>
  </Card>
);

const Controls = ({ children }: Props) => (
  <Stack gap="md">
    <Button>Action</Button>
    <Select name="fruit" options={FRUITS} value="Apple" />
    {children}
  </Stack>
);

/** Page, then three Cards deep. Each level's corners, Button and Select step lg, md, sm, sm. */
export const Nesting: Story<Props> = () => (
  <Page>
    <Controls>
      <Card title="Card (depth 0)">
        <Controls>
          <Card title="Card in Card">
            <Controls>
              <Card title="Card in Card in Card (clamped)">
                <Controls />
              </Card>
            </Controls>
          </Card>
        </Controls>
      </Card>
    </Controls>
  </Page>
);

export const NestingInDialog: Story<Props> = () => {
  const [open, setOpen] = useState(false);
  return (
    <Page>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Dialog (depth 1)"
        footer={<Button>Done</Button>}
      >
        <Controls>
          <Card title="Card in a Dialog">
            <Controls />
          </Card>
        </Controls>
      </Dialog>
    </Page>
  );
};
