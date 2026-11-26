/** Light, dark or auto
 * `useThemeSetting` returns the choice and its setter; `useTheme().colorScheme` is the mode it resolved to. Pass the app's root `ThemeProvider` an `identity` and the choice is saved for that user and restored when they return; with `null` nothing is saved. Switch the identity below and the choice follows it.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ThemeProvider, useTheme, useThemeSetting, type ThemeSetting } from '@korzun/design/theme';
import { useState } from 'react';

const settings: ThemeSetting[] = ['light', 'dark', 'auto'];

const Picker = ({ identity }: { identity: string | null }) => {
  const [setting, setSetting] = useThemeSetting();
  const theme = useTheme();
  return (
    <Stack gap="md" align="start">
      <Text tone="muted">
        {identity === null ? 'Signed out' : `Signed in as ${identity}`}: setting {setting}, mode{' '}
        {theme.colorScheme}
      </Text>
      <Inline>
        {settings.map((next) => (
          <Button
            key={next}
            type={setting === next ? 'primary' : 'default'}
            onClick={() => setSetting(next)}
          >
            {next}
          </Button>
        ))}
      </Inline>
    </Stack>
  );
};

export default function Setting() {
  const [identity, setIdentity] = useState<string | null>('ada');
  return (
    <ThemeProvider identity={identity}>
      <Stack gap="lg" align="start">
        <Picker identity={identity} />
        <Inline>
          <Button onClick={() => setIdentity(identity === null ? 'ada' : null)}>
            {identity === null ? 'Sign in' : 'Sign out'}
          </Button>
        </Inline>
      </Stack>
    </ThemeProvider>
  );
}
