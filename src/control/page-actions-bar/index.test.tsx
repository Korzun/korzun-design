import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { type PageActionItem } from '../page-actions-menu/item.js';
import { PageActionsBar } from './index.js';

function makeItems(): PageActionItem[] {
  return [
    { label: 'Set progress', onClick: vi.fn(), primary: true, align: 'leading' },
    { label: 'Edit metadata', onClick: vi.fn(), primary: true, align: 'trailing' },
    { label: 'Regen chapters', onClick: vi.fn() },
    { label: 'Delete book', onClick: vi.fn(), danger: true },
  ];
}

describe('PageActionsBar', () => {
  it('shows primary actions inline, leading before trailing before More', () => {
    renderWithProviders(<PageActionsBar items={makeItems()} />);
    const names = screen
      .getAllByRole('button')
      .map((n) => n.getAttribute('aria-label') ?? n.textContent);
    expect(names).toEqual(['Set progress', 'Edit metadata', 'More actions']);
  });

  it('keeps overflow actions hidden until More is opened', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageActionsBar items={makeItems()} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    expect(screen.getByRole('menuitem', { name: 'Regen chapters' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete book' })).toBeInTheDocument();
    // Set progress / Edit metadata are inline, NOT in the menu
    expect(screen.queryByRole('menuitem', { name: 'Set progress' })).not.toBeInTheDocument();
  });

  it('calls the overflow item onClick and closes the menu', async () => {
    const user = userEvent.setup();
    const items = makeItems();
    renderWithProviders(<PageActionsBar items={items} />);
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Regen chapters' }));
    expect(items[2].onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('hovering an overflow item fires its intentProps.onMouseEnter', async () => {
    const user = userEvent.setup();
    const intentProps = { onMouseEnter: vi.fn(), onFocus: vi.fn(), onTouchStart: vi.fn() };
    const items: PageActionItem[] = [{ label: 'Regen chapters', onClick: vi.fn(), intentProps }];
    renderWithProviders(<PageActionsBar items={items} />);
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    await user.hover(screen.getByRole('menuitem', { name: 'Regen chapters' }));
    expect(intentProps.onMouseEnter).toHaveBeenCalled();
  });

  it('omits the More trigger when there are no overflow actions', () => {
    const items: PageActionItem[] = [
      { label: 'Edit metadata', onClick: vi.fn(), primary: true, align: 'trailing' },
    ];
    renderWithProviders(<PageActionsBar items={items} />);
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageActionsBar items={makeItems()} />);
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on an outside click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <div>
        <PageActionsBar items={makeItems()} />
        <button type="button">outside</button>
      </div>
    );
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('opening focuses the first item', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageActionsBar items={makeItems()} />);
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Regen chapters' })).toHaveFocus()
    );
  });

  it('ArrowDown moves focus', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageActionsBar items={makeItems()} />);
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Regen chapters' })).toHaveFocus()
    );
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete book' })).toHaveFocus();
  });

  it('Escape returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageActionsBar items={makeItems()} />);
    const trigger = screen.getByRole('button', { name: 'More actions' });
    await user.click(trigger);
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Regen chapters' })).toHaveFocus()
    );
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
