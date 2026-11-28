/** Size and colour
 * Size an icon with `width` and `height`, or give it `1em` in a class so it scales with the text around it. Colour comes from `color` on the icon or any ancestor; pass no `stroke` or `fill` colour.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { HomeIcon, SearchIcon, SettingsIcon } from '@korzun/design/icon';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  scaled: { height: '1em', width: '1em' },
  brand: { color: theme.color.brand.default },
  danger: { color: theme.color.danger.default },
}));

const sizes = [16, 24, 32] as const;

export default function SizeAndColour() {
  const styles = useStyle();
  const [danger, setDanger] = useState(false);
  return (
    <Space direction="vertical" gap="lg" align="start">
      <Space gap="lg">
        {sizes.map((size) => (
          <Space direction="vertical" key={size} gap="xs" align="center">
            <HomeIcon width={size} height={size} aria-hidden />
            <Text size="sm" tone="muted">
              {size}px
            </Text>
          </Space>
        ))}
      </Space>
      <Space gap="xs">
        <SearchIcon className={styles.scaled} aria-hidden />
        <Text size="lg">Scales with this text</Text>
      </Space>
      <Space gap="xs" className={danger ? styles.danger : styles.brand}>
        <SettingsIcon aria-hidden />
        <Text>{danger ? 'Colour set to danger' : 'Colour set to brand'}</Text>
      </Space>
      <Space>
        <Button onClick={() => setDanger(!danger)}>Switch colour</Button>
      </Space>
    </Space>
  );
}
