/** In a Dialog
 * A popover whose anchor is inside an open Dialog renders into that dialog, so
 * it shows above the backdrop. Escape closes the popover first and the Dialog
 * on the next press.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Dialog, Popover } from '@korzun/design/control';
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

export default function InDialog() {
  const styles = useStyle();
  const anchor = useRef<HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState('nothing yet');
  const choose = (label: string) => {
    setChosen(label);
    setOpen(false);
  };
  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Edit book">
        <Stack align="start">
          <Button ref={anchor} onClick={() => setOpen((value) => !value)}>
            Status
          </Button>
          <Popover anchorRef={anchor} open={open} matchWidth={false} onClose={() => setOpen(false)}>
            <div className={styles.panel}>
              <Stack gap="xxs">
                <Button type="text" onClick={() => choose('Reading')}>
                  Reading
                </Button>
                <Button type="text" onClick={() => choose('Finished')}>
                  Finished
                </Button>
              </Stack>
            </div>
          </Popover>
          <Text tone="muted">Chosen: {chosen}</Text>
        </Stack>
      </Dialog>
    </>
  );
}
