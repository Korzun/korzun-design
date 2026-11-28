/** Nested popovers
 * A popover inside a popover is one layer deeper. Escape and a press outside
 * close the innermost open layer first: Escape closes "More" before "Filters",
 * and a press inside "More" closes neither.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.xs,
  },
}));

export default function Nested() {
  const styles = useStyle();
  const outerAnchor = useRef<HTMLElement>(null);
  const innerAnchor = useRef<HTMLElement>(null);
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Space direction="vertical" align="start">
      <Button ref={outerAnchor} onClick={() => setOuterOpen((value) => !value)}>
        Filters
      </Button>
      <Popover
        anchorRef={outerAnchor}
        open={outerOpen}
        matchWidth={false}
        onClose={() => setOuterOpen(false)}
      >
        <div className={styles.panel}>
          <Space direction="vertical" gap="xxs">
            <Button type="text" onClick={() => setChosen('Unread')}>
              Unread
            </Button>
            <Button ref={innerAnchor} type="text" onClick={() => setInnerOpen((value) => !value)}>
              More
            </Button>
          </Space>
          <Popover
            anchorRef={innerAnchor}
            open={innerOpen}
            matchWidth={false}
            onClose={() => setInnerOpen(false)}
          >
            <div className={styles.panel}>
              <Space direction="vertical" gap="xxs">
                <Button type="text" onClick={() => setChosen('Finished')}>
                  Finished
                </Button>
                <Button type="text" onClick={() => setChosen('Favourites')}>
                  Favourites
                </Button>
              </Space>
            </div>
          </Popover>
        </div>
      </Popover>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Space>
  );
}
