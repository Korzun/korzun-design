/** Preview */
import { Surface } from '@korzun/design/component';
import { Button, useModal } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyles = createUseStyles((theme: Theme) => ({
  dialog: { ...theme.recipe.modal.dialog, backgroundColor: theme.color.bg.card },
  header: { ...theme.recipe.modal.header },
  body: {
    padding: `0 ${theme.space.xxl} ${theme.space.xxl}`,
    color: theme.color.text.secondary,
  },
  footer: { ...theme.recipe.modal.footer },
}));

export default function Preview() {
  const styles = useStyles();
  const ref = useModal(true, () => {});
  return (
    <dialog ref={ref} className={styles.dialog}>
      <Surface>
        <div className={styles.header}>Edit progress</div>
        <div className={styles.body}>You are on page 42 of 310.</div>
        <div className={styles.footer}>
          <Button type="text" onClick={() => {}}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => {}}>
            Save
          </Button>
        </div>
      </Surface>
    </dialog>
  );
}
