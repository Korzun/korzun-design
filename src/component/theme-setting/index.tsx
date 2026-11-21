import { SegmentedControl } from '../../control/segmented-control/index.js';
import { useThemeSetting } from '../../theme/index.js';
import { Card } from '../card/index.js';

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
] as const;

/** ThemeSetting takes no props. */
export type ThemeSettingProps = Record<string, never>;

/**
 * A ready-made "Appearance" `Card` with a Light / Dark / Auto switch bound to the theme. Takes no
 * props; does nothing without a `ThemeProvider` above it.
 */
export const ThemeSetting = () => {
  const [setting, setSetting] = useThemeSetting();

  return (
    <Card title="Appearance">
      <SegmentedControl
        label="Appearance"
        value={setting}
        options={OPTIONS}
        onChange={setSetting}
      />
    </Card>
  );
};
