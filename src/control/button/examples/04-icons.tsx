/** Icons
 * `prefix` and `suffix` take an icon component (`prefix={SearchIcon}`), not an
 * element. An icon-only button needs an `ariaLabel` so it has an accessible name.
 */
import { Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ChevronIcon, SearchIcon, SettingsIcon } from '@korzun/design/icon';

export default function Icons() {
  return (
    <Inline wrap>
      <Button prefix={SearchIcon}>Search</Button>
      <Button type="primary" suffix={ChevronIcon}>
        Next
      </Button>
      <Button prefix={SettingsIcon} ariaLabel="Settings" />
    </Inline>
  );
}
