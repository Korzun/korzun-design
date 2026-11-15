import { SegmentedControl } from '../../control/segmented-control/index.js';
import { useThemeSetting } from '../../theme/index.js';
import { Card } from '../card/index.js';

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
] as const;

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
