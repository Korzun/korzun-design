/** Basic
 * A trigger button and a list of actions. Spread the `trigger` props onto the
 * button; choosing an item closes the menu and calls its `onClick`, which takes
 * no arguments. Menu has no `open` prop, so this demo calls the trigger's
 * `onClick` once on mount to start open.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Menu, type MenuTriggerProps } from '@korzun/design/control';
import { useEffect, useRef, useState } from 'react';

// Opens the menu once on mount (the ref survives Strict Mode's second effect run).
function OpenOnMount(props: MenuTriggerProps) {
  const { onClick } = props;
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    onClick();
  }, [onClick]);
  return <Button {...props}>Sort by</Button>;
}

export default function Basic() {
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Menu
        trigger={(p) => <OpenOnMount {...p} />}
        items={[
          { label: 'Title', onClick: () => setChosen('Title') },
          { label: 'Author', onClick: () => setChosen('Author') },
          { label: 'Date added', onClick: () => setChosen('Date added') },
        ]}
      />
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
