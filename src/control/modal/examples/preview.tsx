/** Preview */
import { Button, Modal } from '@korzun/design/control';

export default function Preview() {
  return (
    <Modal
      open
      onClose={() => {}}
      title="Fixes waiting"
      footer={
        <>
          <Button type="text" onClick={() => {}}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => {}}>
            Save
          </Button>
        </>
      }
    >
      Three metadata fixes are waiting for review.
    </Modal>
  );
}
