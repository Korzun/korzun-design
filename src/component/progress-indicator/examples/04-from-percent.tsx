/** From a percentage
 * A 0–100 API value is divided by 100 before it is passed; passing `42` itself would clamp to 1 and show "Completed". Pick a percent and the indicator follows.
 */
import { Space, ProgressIndicator, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function FromPercent() {
  const [percent, setPercent] = useState(42);
  return (
    <Space direction="vertical">
      <ProgressIndicator value={percent / 100} ariaLabel="Upload progress" />
      <Space>
        <Button onClick={() => setPercent(0)}>0%</Button>
        <Button onClick={() => setPercent(42)}>42%</Button>
        <Button onClick={() => setPercent(100)}>100%</Button>
      </Space>
      <Text tone="muted">API percent: {percent}</Text>
    </Space>
  );
}
