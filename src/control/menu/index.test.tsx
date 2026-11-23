import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { HomeIcon } from '../../icon/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { ThemeProvider } from '../../theme/provider.js';
import { Button } from '../button/index.js';
import { Popover } from '../popover/index.js';
import { Menu, type MenuItem, type MenuProps } from './index.js';

const trigger: MenuProps['trigger'] = (p) => <Button {...p}>Sort</Button>;

const actions = (): MenuItem[] => [
  { label: 'Title', onClick: vi.fn() },
  { label: 'Author', onClick: vi.fn(), disabled: true },
  { label: 'Date', onClick: vi.fn() },
  { label: 'Rating', onClick: vi.fn() },
];

const openMenu = async (user: ReturnType<typeof userEvent.setup>, name = 'Sort') => {
  await user.click(screen.getByRole('button', { name }));
  return screen.findByRole('menu');
};

describe('Menu', () => {
  it('closed: trigger has aria-haspopup="menu" and aria-expanded="false"; no menu', () => {
    renderWithProviders(<Menu trigger={trigger} items={actions()} />);
    const button = screen.getByRole('button', { name: 'Sort' });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('click opens; focus is on the first enabled item; aria-controls equals the menu id', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Menu trigger={trigger} items={actions()} />);
    const menu = await openMenu(user);
    const button = screen.getByRole('button', { name: 'Sort' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', menu.id);
    expect(screen.getByRole('menuitem', { name: 'Title' })).toHaveFocus();
  });

  it('Enter or Space on the trigger opens without activating the first item', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Menu trigger={trigger} items={[{ label: 'Title', onClick }]} />);
    for (const key of ['{Enter}', ' ']) {
      screen.getByRole('button', { name: 'Sort' }).focus();
      await user.keyboard(key);
      expect(await screen.findByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Title' })).toHaveFocus();
      expect(onClick).not.toHaveBeenCalled();
      await user.keyboard('{Escape}');
    }
  });

  it('the menu is labelled by the trigger by default and by ariaLabel when given', async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithProviders(<Menu trigger={trigger} items={actions()} />);
    const menu = await openMenu(user);
    const button = screen.getByRole('button', { name: 'Sort' });
    expect(button.id).not.toBe('');
    expect(menu).toHaveAttribute('aria-labelledby', button.id);
    expect(screen.getByRole('menu', { name: 'Sort' })).toBe(menu);
    unmount();

    renderWithProviders(<Menu trigger={trigger} items={actions()} ariaLabel="Sort books" />);
    const labelled = await openMenu(user);
    expect(labelled).toHaveAttribute('aria-label', 'Sort books');
    expect(labelled).not.toHaveAttribute('aria-labelledby');
  });

  it('ArrowDown/ArrowUp move focus, skipping disabled items, and wrap', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Menu trigger={trigger} items={actions()} />);
    await openMenu(user);
    const item = (name: string) => screen.getByRole('menuitem', { name });
    await user.keyboard('{ArrowDown}');
    expect(item('Date')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(item('Rating')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(item('Title')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(item('Rating')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(item('Date')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(item('Title')).toHaveFocus();
  });

  it('Home/End focus the first/last enabled item', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      { label: 'Off first', onClick: vi.fn(), disabled: true },
      { label: 'One', onClick: vi.fn() },
      { label: 'Two', onClick: vi.fn() },
      { label: 'Off last', onClick: vi.fn(), disabled: true },
    ];
    renderWithProviders(<Menu trigger={trigger} items={items} />);
    await openMenu(user);
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Two' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('Enter on an action item: menu closes, then onClick is called once, focus returns to the trigger', async () => {
    const user = userEvent.setup();
    let menuAtCall: HTMLElement | null | undefined;
    const onClick = vi.fn(() => {
      menuAtCall = screen.queryByRole('menu');
    });
    renderWithProviders(<Menu trigger={trigger} items={[{ label: 'Title', onClick }]} />);
    await openMenu(user);
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(menuAtCall).toBeNull();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'Sort' })).toHaveFocus();
  });

  it('Space on an action item activates it', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Menu trigger={trigger} items={[{ label: 'Title', onClick }]} />);
    await openMenu(user);
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('Escape closes and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Menu trigger={trigger} items={actions()} />);
    await openMenu(user);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'Sort' })).toHaveFocus();
  });

  it('Tab closes and focus lands on the element after the trigger; Shift+Tab before it', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <button type="button">Before</button>
        <Menu trigger={trigger} items={actions()} />
        <button type="button">Next</button>
      </>
    );
    await openMenu(user);
    await user.keyboard('{Tab}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();

    await openMenu(user);
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  });

  it('a mousedown outside closes without moving focus', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <Menu trigger={trigger} items={actions()} />
        <p>Outside</p>
      </>
    );
    await openMenu(user);
    await user.pointer({ keys: '[MouseLeft>]', target: screen.getByText('Outside') });
    expect(screen.queryByRole('menu')).toBeNull();
    // The press blurs to the body; the menu must not pull focus back to the trigger.
    expect(screen.getByRole('button', { name: 'Sort' })).not.toHaveFocus();
  });

  it('link item renders an <a href> with role menuitem and navigates once on Enter', async () => {
    const user = userEvent.setup();
    const renders = vi.fn();
    const BPage = () => {
      renders();
      return <p>B page</p>;
    };
    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={<Menu trigger={trigger} items={[{ label: 'Go to B', to: '/b' }]} />}
        />
        <Route path="/b" element={<BPage />} />
      </Routes>,
      { initialEntries: ['/'] }
    );
    await openMenu(user);
    const link = screen.getByRole('menuitem', { name: 'Go to B' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/b');
    await user.keyboard('{Enter}');
    expect(screen.getAllByText('B page')).toHaveLength(1);
    expect(renders).toHaveBeenCalledTimes(1);
  });

  it('Space on a link item navigates once', async () => {
    const user = userEvent.setup();
    const renders = vi.fn();
    const BPage = () => {
      renders();
      return <p>B page</p>;
    };
    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={<Menu trigger={trigger} items={[{ label: 'Go to B', to: '/b' }]} />}
        />
        <Route path="/b" element={<BPage />} />
      </Routes>
    );
    await openMenu(user);
    expect(screen.getByRole('menuitem', { name: 'Go to B' })).toHaveFocus();
    expect(fireEvent.keyDown(document.activeElement!, { key: ' ' })).toBe(false);
    expect(await screen.findByText('B page')).toBeInTheDocument();
    expect(renders).toHaveBeenCalledTimes(1);
  });

  it('Space on a disabled link does not navigate', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      { label: 'Stay', onClick: vi.fn() },
      { label: 'Go to B', to: '/b', disabled: true },
    ];
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Menu trigger={trigger} items={items} />} />
        <Route path="/b" element={<p>B page</p>} />
      </Routes>
    );
    await openMenu(user);
    const link = screen.getByRole('menuitem', { name: 'Go to B' });
    link.focus();
    expect(fireEvent.keyDown(link, { key: ' ' })).toBe(false);
    expect(screen.queryByText('B page')).toBeNull();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('a disabled link does not navigate and is skipped by arrows', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      { label: 'Stay', onClick: vi.fn() },
      { label: 'Go to B', to: '/b', disabled: true },
      { label: 'Last', onClick: vi.fn() },
    ];
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Menu trigger={trigger} items={items} />} />
        <Route path="/b" element={<p>B page</p>} />
      </Routes>
    );
    await openMenu(user);
    const link = screen.getByRole('menuitem', { name: 'Go to B' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Last' })).toHaveFocus();
    await user.click(link);
    expect(screen.queryByText('B page')).toBeNull();
  });

  it('icon renders aria-hidden before the label', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Menu trigger={trigger} items={[{ label: 'Home', to: '/', Icon: HomeIcon }]} />
    );
    await openMenu(user);
    const item = screen.getByRole('menuitem', { name: 'Home' });
    const svg = item.firstElementChild;
    expect(svg?.tagName.toLowerCase()).toBe('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(item.textContent).toBe('Home');
  });

  it('separatorBefore renders role="separator" between items, never before the first', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      { label: 'Edit', onClick: vi.fn(), separatorBefore: true },
      { label: 'Delete', onClick: vi.fn(), separatorBefore: true },
    ];
    renderWithProviders(<Menu trigger={trigger} items={items} />);
    const menu = await openMenu(user);
    expect(Array.from(menu.children).map((n) => n.getAttribute('role'))).toEqual([
      'menuitem',
      'separator',
      'menuitem',
    ]);
  });

  it('danger item has the danger class', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      { label: 'Edit', onClick: vi.fn() },
      { label: 'Delete', onClick: vi.fn(), danger: true },
    ];
    renderWithProviders(<Menu trigger={trigger} items={items} />);
    await openMenu(user);
    const edit = screen.getByRole('menuitem', { name: 'Edit' });
    const remove = screen.getByRole('menuitem', { name: 'Delete' });
    expect(remove.className.split(' ').some((c) => c.startsWith('itemDanger'))).toBe(true);
    expect(edit.className.split(' ').some((c) => c.startsWith('itemDanger'))).toBe(false);
  });

  it("opening a second Menu's trigger closes the first", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <Menu
          trigger={(p) => <Button {...p}>A</Button>}
          items={[{ label: 'A1', onClick: vi.fn() }]}
        />
        <Menu
          trigger={(p) => <Button {...p}>B</Button>}
          items={[{ label: 'B1', onClick: vi.fn() }]}
        />
      </>
    );
    await openMenu(user, 'A');
    expect(screen.getByRole('menuitem', { name: 'A1' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'B' }));
    await screen.findByRole('menuitem', { name: 'B1' });
    expect(screen.queryByRole('menuitem', { name: 'A1' })).toBeNull();
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  it('all items disabled: opening focuses the menu element', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      { label: 'One', onClick: vi.fn(), disabled: true },
      { label: 'Two', to: '/two', disabled: true },
    ];
    renderWithProviders(<Menu trigger={trigger} items={items} />);
    const menu = await openMenu(user);
    expect(menu).toHaveAttribute('tabindex', '-1');
    expect(menu).toHaveFocus();
  });

  it('items change while open: the focused item removed moves focus to the first enabled item', async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const [items, setItems] = useState<MenuItem[]>([
        { label: 'Keep', onClick: vi.fn() },
        { label: 'Drop', onClick: vi.fn() },
      ]);
      const drop = () => setItems((current) => current.filter((i) => i.label !== 'Drop'));
      return (
        <>
          <Menu trigger={trigger} items={items} />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            data-testid="drop"
            onClick={drop}
          >
            drop
          </button>
        </>
      );
    };
    renderWithProviders(<Harness />);
    await openMenu(user);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Drop' })).toHaveFocus();
    // Remove the focused item without moving focus or closing the menu.
    screen.getByTestId('drop').click();
    await screen.findByRole('menu');
    expect(screen.queryByRole('menuitem', { name: 'Drop' })).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Keep' })).toHaveFocus();
  });

  it('unmounting while open removes its layer', async () => {
    const user = userEvent.setup();
    const onPopoverClose = vi.fn();
    const Harness = ({ showMenu }: { showMenu: boolean }) => {
      const anchor = useRef<HTMLDivElement>(null);
      return (
        <>
          <div ref={anchor}>anchor</div>
          <Popover anchorRef={anchor} open onClose={onPopoverClose}>
            <p>Popover content</p>
          </Popover>
          {showMenu && <Menu trigger={trigger} items={actions()} />}
        </>
      );
    };
    const { rerender } = renderWithProviders(<Harness showMenu />);
    await screen.findByText('Popover content');
    await openMenu(user);
    rerender(<Harness showMenu={false} />);
    expect(screen.queryByRole('menu')).toBeNull();
    // Opening the menu was an outside pointer-down for the popover; count from here.
    onPopoverClose.mockClear();
    await user.keyboard('{Escape}');
    expect(onPopoverClose).toHaveBeenCalledTimes(1);
  });

  it('Menu with only action items renders outside any Router', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider identity={null}>
        <Menu trigger={trigger} items={actions()} />
      </ThemeProvider>
    );
    await openMenu(user);
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
  });
});
