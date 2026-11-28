/** Basic
 * Plain code in a mono box. A line longer than the box scrolls sideways inside it, with a fade at the edge while more is hidden.
 */
import { CodeBlock } from '@korzun/design/component';

export default function Basic() {
  return <CodeBlock code="npm install @korzun/design react react-dom react-jss" />;
}
