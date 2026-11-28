/** Wrap
 * `wrap` breaks long lines inside the box instead of scrolling them, for output a reader should see whole.
 */
import { CodeBlock } from '@korzun/design/component';

export default function Wrap() {
  return (
    <CodeBlock
      wrap
      code="curl --fail --location --header 'Accept: application/json' https://example.com/api/v1/books?sort=title&order=asc&limit=100"
    />
  );
}
