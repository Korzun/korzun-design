/** Other triggers
 * An icon-only `Button` takes an `ariaLabel` for its name; `ariaLabel` on the Menu
 * names the list, which is otherwise labelled by the trigger. For any other
 * element, attach `ref` and `onClick` and map the rest to `aria-*` attributes: here a
 * native `<button>` styled from theme tokens.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { MoreIcon } from '@korzun/design/icon';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

// Your own trigger element, drawn with theme tokens.
const useStyles = createUseStyles((theme: Theme) => ({
  trigger: {
    font: 'inherit',
    fontSize: theme.fontSize.sm,
    color: theme.color.text.primary,
    backgroundColor: theme.color.bg.cardHeader,
    border: `1px dashed ${theme.color.border.strong}`,
    borderRadius: theme.radius.sm,
    minHeight: theme.layout.controlHeight,
    padding: `0 ${theme.space.lg}`,
    cursor: 'pointer',
    '&:hover': { borderColor: theme.color.border.hover },
  },
}));

export default function CustomTrigger() {
  const styles = useStyles();
  const [chosen, setChosen] = useState('nothing yet');
  const items = [
    { label: 'Rename', onClick: () => setChosen('Rename') },
    { label: 'Duplicate', onClick: () => setChosen('Duplicate') },
  ];
  return (
    <Space direction="vertical" align="start">
      <Space>
        <Menu
          ariaLabel="Row actions"
          trigger={(p) => <Button {...p} prefix={MoreIcon} ariaLabel="More actions" />}
          items={items}
        />
        <Menu
          trigger={(p) => (
            <button
              ref={p.ref}
              type="button"
              className={styles.trigger}
              aria-expanded={p.ariaExpanded}
              aria-controls={p.ariaControls}
              aria-haspopup={p.ariaHasPopup}
              onClick={p.onClick}
            >
              Your own element
            </button>
          )}
          items={items}
        />
      </Space>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Space>
  );
}
