/** Gap
 * `gap` is the space between the anchor and the popover. It takes a number of
 * pixels, a `px` or `rem` string, or a theme space value (`theme.space.xl`).
 * Each button is labelled with the value it passes.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, useTheme, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.md,
  },
}));

type Name = 'pixels' | 'px' | 'rem' | 'theme';

export default function Gap() {
  const styles = useStyle();
  const theme = useTheme();
  const pixelsAnchor = useRef<HTMLElement>(null);
  const pxAnchor = useRef<HTMLElement>(null);
  const remAnchor = useRef<HTMLElement>(null);
  const themeAnchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Name | null>(null);
  const toggle = (name: Name) => setOpen((current) => (current === name ? null : name));
  const close = () => setOpen(null);
  const panel = (text: string) => (
    <div className={styles.panel}>
      <Text>{text}</Text>
    </div>
  );
  return (
    <Space direction="vertical">
      <Space>
        <Button ref={pixelsAnchor} onClick={() => toggle('pixels')}>
          {'gap={24}'}
        </Button>
        <Button ref={pxAnchor} onClick={() => toggle('px')}>
          {'gap="12px"'}
        </Button>
        <Button ref={remAnchor} onClick={() => toggle('rem')}>
          {'gap="2rem"'}
        </Button>
        <Button ref={themeAnchor} onClick={() => toggle('theme')}>
          {'gap={theme.space.xl}'}
        </Button>
      </Space>
      <Text tone="muted">Open: {open ?? 'none'}</Text>
      <Popover
        anchorRef={pixelsAnchor}
        open={open === 'pixels'}
        gap={24}
        matchWidth={false}
        onClose={close}
      >
        {panel('24 pixels')}
      </Popover>
      <Popover
        anchorRef={pxAnchor}
        open={open === 'px'}
        gap="12px"
        matchWidth={false}
        onClose={close}
      >
        {panel('12px')}
      </Popover>
      <Popover
        anchorRef={remAnchor}
        open={open === 'rem'}
        gap="2rem"
        matchWidth={false}
        onClose={close}
      >
        {panel('2rem')}
      </Popover>
      <Popover
        anchorRef={themeAnchor}
        open={open === 'theme'}
        gap={theme.space.xl}
        matchWidth={false}
        onClose={close}
      >
        {panel('theme.space.xl')}
      </Popover>
    </Space>
  );
}
