import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IconGrid } from './icon-grid.js';

const mount = () =>
  render(
    <ThemeProvider identity="test">
      <ToastProvider>
        <IconGrid />
      </ToastProvider>
    </ThemeProvider>
  );

describe('IconGrid', () => {
  it('lists every *Icon export with its name, and nothing else', () => {
    mount();
    const items = within(screen.getByRole('list', { name: 'Icons' })).getAllByRole('listitem');
    const names = items.map((i) => i.querySelector('code')!.textContent);
    expect(names).toContain('CheckIcon');
    expect(names).toContain('XIcon');
    expect(names.every((n) => n!.endsWith('Icon'))).toBe(true);
    expect(names).toEqual([...names].sort());
    for (const item of items) expect(item.querySelector('svg')).not.toBeNull();
  });

  it('copies the import line for an icon', async () => {
    const user = userEvent.setup();
    const write = vi.spyOn(navigator.clipboard, 'writeText');
    mount();
    await user.click(screen.getByRole('button', { name: 'Copy CheckIcon import' }));
    expect(write).toHaveBeenCalledWith("import { CheckIcon } from '@korzun/design/icon'");
  });
});
