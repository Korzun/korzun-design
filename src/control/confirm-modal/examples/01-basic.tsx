/** Basic
 * A yes/no question with a `title`, a body and custom `confirmText` and `cancelText`.
 * `onConfirm` and `onCancel` take no arguments, and `onConfirm` does not close the
 * modal: it sets `isOpen` to `false` itself. `onCancel` also runs for Escape and a
 * click on the backdrop. This demo starts open; Sync library opens it again.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, ConfirmModal } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [isOpen, setIsOpen] = useState(true);
  const [answer, setAnswer] = useState('none yet');
  const answerWith = (value: string) => {
    setAnswer(value);
    setIsOpen(false);
  };
  return (
    <Space direction="vertical" align="start">
      <Button onClick={() => setIsOpen(true)}>Sync library</Button>
      <Text tone="muted">Answer: {answer}</Text>
      <ConfirmModal
        isOpen={isOpen}
        title="Sync library?"
        confirmText="Sync now"
        cancelText="Not now"
        onCancel={() => answerWith('not now')}
        onConfirm={() => answerWith('sync now')}
      >
        This checks every connected device for new books.
      </ConfirmModal>
    </Space>
  );
}
