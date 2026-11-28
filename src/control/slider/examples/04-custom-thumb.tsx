/** Custom thumb
 * `thumb` draws the handle from its state (`value`, `dragging`, `focused`, `disabled`). The slider keeps the focusable, 24px target around it and centres it on the value, so the node is only what you see. This one is a pill showing the value, which grows while dragging.
 */
import { Space } from '@korzun/design/component';
import { Slider } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

// In your app this goes in a sibling style.ts.
const useStyle = createUseStyles((theme: Theme) => ({
  pill: {
    padding: `${theme.space.xxs} ${theme.space.md}`,
    borderRadius: theme.radius.pill,
    background: theme.color.brand.default,
    color: theme.color.text.onPrimary,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    fontVariantNumeric: 'tabular-nums',
    transition: `transform ${theme.transition.fast}`,
  },
  dragging: { transform: 'scale(1.15)' },
}));

export default function CustomThumb() {
  const styles = useStyle();
  const [value, setValue] = useState(60);
  return (
    <Space direction="vertical">
      <Slider
        value={value}
        onChange={setValue}
        step={5}
        ariaLabel="Brightness"
        thumb={(s) => (
          <span className={`${styles.pill} ${s.dragging ? styles.dragging : ''}`}>{s.value}</span>
        )}
      />
    </Space>
  );
}
