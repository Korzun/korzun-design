import type { StoryEntry } from '@gallery/stories';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { ReactElement } from 'react';

import { SegmentedControl } from '../../src/control/segmented-control/index.js';
import { isThemeValue, type ThemeValue } from '../messages.js';

export type WidthPreset = 'fill' | '414' | '768' | '1024';

export const WIDTHS: ReadonlyArray<{ value: WidthPreset; label: string }> = [
  { value: 'fill', label: 'Fill' },
  { value: '414', label: 'Phone' },
  { value: '768', label: 'Tablet' },
  { value: '1024', label: 'Desktop' },
];

const THEMES: ReadonlyArray<{ value: ThemeValue; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
];

const useStyle = createUseStyles((theme: Theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.xl,
    padding: `${theme.space.md} ${theme.space.xxl}`,
    borderBottom: `1px solid ${theme.color.border.default}`,
    flexShrink: 0,
  },
  title: { margin: 0, fontSize: 'inherit', fontWeight: theme.fontWeight.bold },
  controls: { display: 'flex', alignItems: 'center', gap: theme.space.xl },
}));

type ToolbarProps = {
  entry: StoryEntry;
  theme: ThemeValue;
  onTheme: (t: ThemeValue) => void;
  width: WidthPreset;
  onWidth: (w: WidthPreset) => void;
};

export const Toolbar = ({ entry, theme, onTheme, width, onWidth }: ToolbarProps): ReactElement => {
  const styles = useStyle();
  return (
    <div className={styles.toolbar}>
      <h1 className={styles.title}>{`${entry.title} / ${entry.name}`}</h1>
      <div className={styles.controls}>
        <SegmentedControl
          label="Theme"
          options={THEMES}
          value={theme}
          onChange={(v) => {
            if (isThemeValue(v)) onTheme(v);
          }}
        />
        <SegmentedControl label="Width" options={WIDTHS} value={width} onChange={onWidth} />
      </div>
    </div>
  );
};
