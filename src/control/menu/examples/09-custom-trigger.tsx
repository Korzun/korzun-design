/** Other triggers
 * An icon-only `Button` takes an `ariaLabel` for its name; `ariaLabel` on the Menu
 * names the list, which is otherwise labelled by the trigger. For any other
 * element, attach `ref` and `onClick` and map the rest to `aria-*` attributes.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Menu } from '@korzun/design/control';
import { MoreIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function CustomTrigger() {
  const [chosen, setChosen] = useState('nothing yet');
  const items = [
    { label: 'Rename', onClick: () => setChosen('Rename') },
    { label: 'Duplicate', onClick: () => setChosen('Duplicate') },
  ];
  return (
    <Stack>
      <Inline>
        <Menu
          ariaLabel="Row actions"
          trigger={(p) => <Button {...p} prefix={MoreIcon} ariaLabel="More actions" />}
          items={items}
        />
        <Menu
          trigger={(p) => (
            <button
              ref={p.ref}
              type="button"
              aria-expanded={p.ariaExpanded}
              aria-controls={p.ariaControls}
              aria-haspopup={p.ariaHasPopup}
              onClick={p.onClick}
            >
              Plain button
            </button>
          )}
          items={items}
        />
      </Inline>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
