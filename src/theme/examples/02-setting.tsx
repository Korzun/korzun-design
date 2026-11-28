/** Light, dark or auto
 * `useThemeSetting` returns the choice and its setter; `useTheme().colorScheme` is the mode it resolved to. Pass the app's root `ThemeProvider` an `identity` and the choice is saved for that user and restored when they return; with `null` nothing is saved. Switch the identity below and the choice follows it.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ThemeProvider, useTheme, useThemeSetting, type ThemeSetting } from '@korzun/design/theme';
import { useState } from 'react';

const settings: ThemeSetting[] = ['light', 'dark', 'auto'];

const Picker = ({ identity }: { identity: string | null }) => {
  const [setting, setSetting] = useThemeSetting();
  const theme = useTheme();
  return (
    <Space direction="vertical" gap="md" align="start">
      <Text tone="muted">
        {identity === null ? 'Signed out' : `Signed in as ${identity}`}: setting {setting}, mode{' '}
        {theme.colorScheme}
      </Text>
      <Space>
        {settings.map((next) => (
          <Button
            key={next}
            type={setting === next ? 'primary' : 'default'}
            onClick={() => setSetting(next)}
          >
            {next}
          </Button>
        ))}
      </Space>
    </Space>
  );
};

export default function Setting() {
  const [identity, setIdentity] = useState<string | null>('ada');
  return (
    <ThemeProvider identity={identity}>
      <Space direction="vertical" gap="lg" align="start">
        <Picker identity={identity} />
        <Space>
          <Button onClick={() => setIdentity(identity === null ? 'ada' : null)}>
            {identity === null ? 'Sign in' : 'Sign out'}
          </Button>
        </Space>
      </Space>
    </ThemeProvider>
  );
}
