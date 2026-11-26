/** Gated dismissal
 * `canDismiss` is `!saving`, so Escape and backdrop clicks do nothing while a request
 * runs, and the Cancel button is disabled to match so every exit is gated the same.
 * The switch holds the busy state on. The `onClick` that stops propagation keeps a
 * click in the dialog from reaching a clickable ancestor; dismissal is the hook's job.
 */
import { Inline, Stack, Surface } from '@korzun/design/component';
import { Button, Switch, useModalDialog } from '@korzun/design/control';
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

export default function GatedDismissal() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(true);
  const close = () => setIsOpen(false);
  const ref = useModalDialog(isOpen, close, !saving);
  return (
    <Inline>
      <Button onClick={() => setIsOpen(true)}>Open busy modal</Button>
      <dialog ref={ref} className={styles.dialog} onClick={(event) => event.stopPropagation()}>
        <Surface>
          <div className={styles.header}>Saving progress</div>
          <div className={styles.body}>
            <Stack>
              Escape and the backdrop are ignored while the request is in flight.
              <Switch
                name="saving"
                label="Request in flight"
                checked={saving}
                onChange={setSaving}
              />
            </Stack>
          </div>
          <div className={styles.footer}>
            <Button type="text" disabled={saving} onClick={close}>
              Cancel
            </Button>
            <Button type="primary" loading={saving} onClick={close}>
              Save
            </Button>
          </div>
        </Surface>
      </dialog>
    </Inline>
  );
}
