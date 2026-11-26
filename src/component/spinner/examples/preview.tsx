/** Preview */
import { Spinner } from '@korzun/design/component';

// Unsized, the spinner takes the surrounding font size: large here so it reads as a thumbnail.
export default function Preview() {
  return (
    <div style={{ fontSize: 48, display: 'flex' }}>
      <Spinner label="Loading" />
    </div>
  );
}
