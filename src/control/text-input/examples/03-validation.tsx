/** Validation
 * `validate` receives the raw text on each keystroke. While it returns `false`
 * the label and border turn red, `onChange` is not called (the saved value stays
 * at the last valid text) and `onValidChange` fires once when validity flips.
 * The demo opens with an over-long title typed in, so it starts invalid; shorten it to
 * ten characters or fewer.
 */
import { Space, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useEffect, useRef, useState } from 'react';

// Types `text` into the field once on mount, as a user would, so the demo opens
// in the state that text produces (the ref survives Strict Mode's second run).
function useTypeOnMount(text: string) {
  const box = useRef<HTMLDivElement>(null);
  const typed = useRef(false);
  useEffect(() => {
    const field = box.current?.querySelector('input');
    if (typed.current || !field) return;
    typed.current = true;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(field, text);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }, [text]);
  return box;
}

export default function Validation() {
  const [title, setTitle] = useState<string | undefined>('Dune');
  const [valid, setValid] = useState(true);
  const box = useTypeOnMount('Dune Messiah');
  return (
    <Space direction="vertical">
      <div ref={box}>
        <TextInput
          name="title"
          layout="vertical"
          label="Title (up to 10)"
          value={title}
          onChange={setTitle}
          validate={(text) => text.length <= 10}
          onValidChange={(_name, ok) => setValid(ok)}
        />
      </div>
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved value: {title === undefined ? 'undefined' : `“${title}”`}</Text>
    </Space>
  );
}
