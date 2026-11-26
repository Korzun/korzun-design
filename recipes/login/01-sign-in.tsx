/**
 * Sign in
 *
 * A centred sign-in card with Forgot password? below it, on the page background.
 * @viewport screen
 */
import { Card, Page, Stack } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useToast } from '@korzun/design/toast';
import { useState } from 'react';

// In your app this goes in a sibling style.ts.
const useStyle = createUseStyles((theme: Theme) => ({
  // Centring a column in the viewport is the one layout Stack can't express.
  screen: {
    display: 'grid',
    placeItems: 'center',
    minHeight: '100vh',
    boxSizing: 'border-box',
    padding: `0 ${theme.space.xxl}`,
  },
  column: {
    width: theme.layout.formWidth,
    maxWidth: '100%',
  },
}));

// Stands in for your auth call.
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function SignIn() {
  const styles = useStyle();
  const toast = useToast();
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  // A form action: the submit Button shows its spinner while this runs.
  const signIn = async () => {
    await wait(600);
    toast('Signed in', 'success');
  };

  return (
    <Page type="minimal">
      <div className={styles.screen}>
        <Stack gap="xxl" className={styles.column}>
          <Card>
            <form action={signIn}>
              <Stack gap="xxl">
                <Stack gap="md">
                  <TextInput
                    name="username"
                    placeholder="Username or email"
                    autoCapitalize="none"
                    value={username}
                    onChange={setUsername}
                  />
                  <TextInput
                    name="password"
                    placeholder="Password"
                    password
                    value={password}
                    onChange={setPassword}
                  />
                </Stack>
                <Button type="primary" submit>
                  Sign In
                </Button>
              </Stack>
            </form>
          </Card>
          <Button onClick={() => toast('Check your email for a reset link', 'info')}>
            Forgot password?
          </Button>
        </Stack>
      </div>
    </Page>
  );
}
