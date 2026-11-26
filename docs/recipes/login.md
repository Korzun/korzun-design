---
title: Sign in
description: A centred sign-in card with the submit inside it and Forgot password? on the page below.
category: Recipe
---

# Sign in

A whole sign-in screen: a card with the two fields and a full-width submit,
and a secondary action on the page below it. Copy the code, then replace the
stubbed action with your auth call.

<!-- generated:examples -->

## Examples

### Sign in

A centred sign-in card with Forgot password? below it, on the page background.

```tsx
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
```

<!-- /generated:examples -->

## Why it's built this way

- **One column, `formWidth` wide.** `theme.layout.formWidth` (`400px`) sets the
  column; `maxWidth: '100%'` lets it shrink inside the page gutter on a phone.
  The card and the button below it are both as wide as the column. See
  [tokens](../tokens.md).
- **Two gaps.** The fields sit `md` apart; Sign In sits `xxl` below them, and
  the card sits `xxl` above Forgot password?. The larger gap separates the
  action from what it acts on.
- **The submit is inside the `<form>`.** It is `type="primary" submit`, so Enter
  in either field submits, and it shows its spinner by itself while the form
  action runs; no `loading` state to manage.
- **Forgot password? is outside the form and the card.** It can't submit, and on
  the page background it is a secondary action, not part of the form.
- **No radius props.** The card is on the page, so it takes the page radius;
  Sign In is one level in, so it is a step squarer; Forgot password? is on the
  page again and matches the card. See [corners](../corners.md).
- **No label, placeholder only.** On a screen that does one thing the
  placeholders are enough, as in Bookplate.

## Wiring it up

- Replace `signIn` with your auth call. It can read the fields from state, or
  take the `FormData` the action receives (`formData.get('username')`).
- Report failures with a toast (`useToast()`, type `error`): "Invalid
  credentials", "Too many attempts", "Network error". See [toast](../toast.md).
- Without email sign-in, use the placeholder `Username` and drop Forgot
  password?.
