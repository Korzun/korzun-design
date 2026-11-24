import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { Button } from '../../control/button/index.js';
import { useTheme } from '../../theme/index.js';
import { Card } from '../card/index.js';
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
