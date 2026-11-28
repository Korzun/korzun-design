/** Validation and placeholder
 * `placeholder` shows while the field is empty. `validate` receives the raw text
 * on each keystroke; while it returns `false` the label turns red, `onChange` is
 * not called (the saved text stays at the last valid one) and `onValidChange`
 * fires once when validity flips. The demo opens with two lines typed in, so it
 * starts invalid; remove the line break to fix it.
 */
import { Space, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useEffect, useRef, useState } from 'react';

// Types `text` into the field once on mount, as a user would, so the demo opens
// in the state that text produces (the ref survives Strict Mode's second run).
function useTypeOnMount(text: string) {
  const box = useRef<HTMLDivElement>(null);
  const typed = useRef(false);
  useEffect(() => {
    const field = box.current?.querySelector('textarea');
    if (typed.current || !field) return;
    typed.current = true;
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set?.call(field, text);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }, [text]);
  return box;
}

export default function Validation() {
  const [text, setText] = useState<string | undefined>(undefined);
  const [valid, setValid] = useState(true);
  const box = useTypeOnMount('Read on the train.\nLend to Sam.');
  return (
    <Space direction="vertical">
      <div ref={box}>
        <TextArea
          name="one-line"
          layout="vertical"
          label="One line only"
          placeholder="No line breaks allowed"
          value={text}
          onChange={setText}
          validate={(v) => !v.includes('\n')}
          onValidChange={(_name, ok) => setValid(ok)}
        />
      </div>
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved text: {text === undefined ? 'nothing' : `“${text}”`}</Text>
    </Space>
  );
}
