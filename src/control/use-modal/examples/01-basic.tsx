/** Basic
 * The hook returns a ref for a `<dialog>` that stays mounted. `isOpen` drives
 * `showModal()` and `close()`; Escape and a click on the backdrop call `onDismiss`,
 * which closes nothing itself, so it sets `isOpen` to `false`. The `<dialog>` takes
 * the `theme.recipe.modal.*` styles, and its contents are wrapped in `Surface` so the
 * Buttons get the corners they would have in a `Modal`. This demo starts open.
 */
import { Space, Surface, Text } from '@korzun/design/component';
import { Button, useModal } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyles = createUseStyles((theme: Theme) => ({
  dialog: { ...theme.recipe.modal.dialog, backgroundColor: theme.color.bg.card },
  header: { ...theme.recipe.modal.header },
  body: {
    padding: `0 ${theme.space.xxl} ${theme.space.xxl}`,
    color: theme.color.text.secondary,
  },
  footer: { ...theme.recipe.modal.footer },
}));

export default function Basic() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(true);
  const [saves, setSaves] = useState(0);
  const close = () => setIsOpen(false);
  const ref = useModal(isOpen, close);
  return (
    <Space direction="vertical" align="start">
      <Button onClick={() => setIsOpen(true)}>Edit progress</Button>
      <Text tone="muted">Saved: {saves}</Text>
      <dialog ref={ref} className={styles.dialog}>
        <Surface>
          <div className={styles.header}>Edit progress</div>
          <div className={styles.body}>You are on page 42 of 310.</div>
          <div className={styles.footer}>
            <Button type="text" onClick={close}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSaves((n) => n + 1);
                close();
              }}
            >
              Save
            </Button>
          </div>
        </Surface>
      </dialog>
    </Space>
  );
}
