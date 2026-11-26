/** Select inside
 * A `Select` list opens inside the modal and takes Escape before the modal does. The
 * hook gives no surface depth, so the `Select` gets `surface="card"` to look like it
 * sits in a card instead of on the page.
 */
import { Inline, Text } from '@korzun/design/component';
import { Button, Select, useModalDialog } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const SHELVES = ['Reading', 'To read', 'Finished', 'Abandoned'];

const useStyles = createUseStyles((theme: Theme) => ({
  dialog: { ...theme.recipe.modal.dialog, backgroundColor: theme.color.bg.card },
  header: { ...theme.recipe.modal.header },
  body: {
    padding: `0 ${theme.space.xxl} ${theme.space.xxl}`,
  },
  footer: { ...theme.recipe.modal.footer },
}));

export default function SelectInside() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [shelf, setShelf] = useState<string | undefined>('Reading');
  const close = () => setIsOpen(false);
  const ref = useModalDialog(isOpen, close);
  return (
    <Inline>
      <Button onClick={() => setIsOpen(true)}>Move book</Button>
      <Text tone="muted">Shelf: {shelf ?? 'none'}</Text>
      <dialog ref={ref} className={styles.dialog}>
        <div className={styles.header}>Move book</div>
        <div className={styles.body}>
          <Select
            name="shelf"
            label="Shelf"
            layout="vertical"
            surface="card"
            options={SHELVES}
            value={shelf}
            onChange={setShelf}
          />
        </div>
        <div className={styles.footer}>
          <Button type="primary" radius="modal" onClick={close}>
            Done
          </Button>
        </div>
      </dialog>
    </Inline>
  );
}
