/** Preview */
import { ConfirmModal } from '@korzun/design/control';

export default function Preview() {
  return (
    <ConfirmModal
      isOpen
      title="Sync library?"
      confirmText="Sync now"
      cancelText="Not now"
      onCancel={() => {}}
      onConfirm={() => {}}
    >
      This checks every connected device for new books.
    </ConfirmModal>
  );
}
