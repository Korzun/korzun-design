/** Values outside a stylesheet
 * `useTheme` returns the current `Theme` for a value a stylesheet cannot take, such as a label or a chart option. `lightTheme` and `darkTheme` are the two concrete themes, handy in tests. Pick one to read the same tokens from it.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { darkTheme, lightTheme, useTheme } from '@korzun/design/theme';
import { useState } from 'react';

export default function Values() {
  const current = useTheme();
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const picked = mode === 'light' ? lightTheme : darkTheme;
  return (
    <Space direction="vertical" gap="md" align="start">
      <Text>Page background here: {current.color.bg.page}</Text>
      <Space>
        <Button type={mode === 'light' ? 'primary' : 'default'} onClick={() => setMode('light')}>
          lightTheme
        </Button>
        <Button type={mode === 'dark' ? 'primary' : 'default'} onClick={() => setMode('dark')}>
          darkTheme
        </Button>
      </Space>
      <Text tone="muted">
        {picked.colorScheme}: page {picked.color.bg.page}, text {picked.color.text.primary}
      </Text>
    </Space>
  );
}
