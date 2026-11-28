/** Filled and outline
 * `variant="filled"` is a pie inside a ring; `variant="outline"` is border-only, an arc over a faint track. `label` puts the value `'outside'` (the default), `'inside'` the circle, or nowhere (`'none'`, still read by screen readers).
 */
import { ProgressCircle, Space, Text } from '@korzun/design/component';

const LABELS = ['outside', 'inside', 'none'] as const;

export default function Variants() {
  return (
    <Space direction="vertical" gap="lg">
      {(['filled', 'outline'] as const).map((variant) => (
        <Space key={variant} gap="xl">
          <Text tone="muted">{variant}</Text>
          {LABELS.map((label) => (
            <ProgressCircle
              key={label}
              value={0.65}
              variant={variant}
              label={label}
              size={48}
              ariaLabel={`Upload progress, ${variant}, label ${label}`}
            />
          ))}
        </Space>
      ))}
    </Space>
  );
}
