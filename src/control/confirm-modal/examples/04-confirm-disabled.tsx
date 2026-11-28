/** Confirm disabled
 * `confirmDisabled` disables only Confirm, here until the switch in the body is on.
 * Cancel and dismissal keep working.
 */
import { Space } from '@korzun/design/component';
import { Button, ConfirmModal, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function ConfirmDisabled() {
  const [isOpen, setIsOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const close = () => {
    setIsOpen(false);
    setUnderstood(false);
  };
  return (
    <Space direction="vertical" align="start">
      <Button onClick={() => setIsOpen(true)}>Reset library</Button>
      <ConfirmModal
        isOpen={isOpen}
        title="Reset library?"
        confirmText="Reset"
        confirmDisabled={!understood}
        danger
        onCancel={close}
        onConfirm={close}
      >
        <Space direction="vertical">
          Every book is removed from this device.
          <Switch
            name="understood"
            label="I understand"
            checked={understood}
            onChange={setUnderstood}
          />
        </Space>
      </ConfirmModal>
    </Space>
  );
}
