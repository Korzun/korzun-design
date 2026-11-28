/** Label and error
 * `as="label"` with `htmlFor` names a native or third-party control. While the field is empty an
 * inline error shows: `as="div"` with `tone="danger"` and `aria-live="polite"`. The native
 * `<input>` takes `theme.recipe.input`, so it matches the library's fields.
 */
import { Space, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyles = createUseStyles((theme: Theme) => ({
  input: { ...theme.recipe.input, height: theme.layout.controlHeight },
  // Referenced by `theme.recipe.input`: a red border while the field is invalid.
  danger: {},
}));

export default function LabelAndError() {
  const styles = useStyles();
  const [title, setTitle] = useState('');
  return (
    <Space direction="vertical" gap="xs">
      <Text as="label" htmlFor="book-title" size="sm" weight="medium">
        Title
      </Text>
      <input
        id="book-title"
        name="title"
        className={title === '' ? `${styles.input} ${styles.danger}` : styles.input}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <Text as="div" size="sm" tone="danger" aria-live="polite">
        {title === '' ? 'Title is required.' : null}
      </Text>
    </Space>
  );
}
