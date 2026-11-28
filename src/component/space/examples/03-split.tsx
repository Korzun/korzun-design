/** Split
 * `split` draws a separator between each pair of children, never at the ends,
 * and hides it from screen readers. Items that render nothing (`false`,
 * `null`) get no separator. In a list (`as="ul"`) the separator is an `li`.
 */
import { Space, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function Split() {
  const [year, setYear] = useState(false);
  return (
    <Space direction="vertical">
      <Space split="·" wrap>
        <Text tone="muted">George Eliot</Text>
        <Text tone="muted">Fiction</Text>
        {year && <Text tone="muted">1871</Text>}
        <Text tone="muted">Classic</Text>
      </Space>
      <Space as="ul" split="|" gap="xs">
        <li>Reading</li>
        <li>Up next</li>
        <li>Finished</li>
      </Space>
      <label>
        <input type="checkbox" checked={year} onChange={(e) => setYear(e.target.checked)} /> Show
        the year
      </label>
    </Space>
  );
}
