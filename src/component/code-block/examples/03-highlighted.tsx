/** Highlighted
 * Children replace the plain text; Copy still copies `code`. `CodeBlock` sets the `--code-*` variables, so a highlighter that emits them, such as Shiki's css-variables theme with `variablePrefix: '--code-'`, follows the light and dark themes.
 */
import { CodeBlock } from '@korzun/design/component';

const code = "const label = 'Copy';";

export default function Highlighted() {
  return (
    <CodeBlock code={code} copyable>
      <span style={{ color: 'var(--code-token-keyword)' }}>const</span>{' '}
      <span style={{ color: 'var(--code-token-constant)' }}>label</span>
      <span style={{ color: 'var(--code-token-punctuation)' }}> = </span>
      <span style={{ color: 'var(--code-token-string)' }}>'Copy'</span>
      <span style={{ color: 'var(--code-token-punctuation)' }}>;</span>
    </CodeBlock>
  );
}
