import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { Button } from './index.js';

describe('Button', () => {
  it('is not disabled and fires onClick when interactive', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).not.toHaveAttribute('aria-disabled');

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('marks itself disabled and blocks activation when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('tabindex', '-1');

    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('marks itself disabled and blocks activation when loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('tabindex', '-1');

    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('Enter and Space activate it and preventDefault the keydown', () => {
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    // fireEvent returns false when the event was preventDefaulted.
    expect(fireEvent.keyDown(button, { key: 'Enter' })).toBe(false);
    expect(fireEvent.keyDown(button, { key: ' ' })).toBe(false);
    expect(fireEvent.keyDown(button, { key: 'a' })).toBe(true);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('honors the incoming tabIndex when interactive', () => {
    renderWithProviders(<Button tabIndex={3}>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('tabindex', '3');
  });

  it('is keyboard-focusable by default', () => {
    renderWithProviders(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('tabindex', '0');
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('disabled stays out of the tab order', () => {
    renderWithProviders(<Button disabled>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('tabindex', '-1');
  });

  it('an explicit tabIndex wins', () => {
    renderWithProviders(<Button tabIndex={-1}>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('tabindex', '-1');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLElement>();
    renderWithProviders(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }));
  });

  it('renders aria-haspopup', () => {
    renderWithProviders(<Button ariaHasPopup="menu">Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-haspopup', 'menu');
  });
});

describe('Button submit mode', () => {
  it('forwards ref in submit mode', () => {
    const ref = createRef<HTMLElement>();
    renderWithProviders(
      <Button submit ref={ref}>
        Save
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders a native submit button and associates via the form attribute', () => {
    renderWithProviders(
      <Button submit form="my-form">
        Save
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('form', 'my-form');
  });

  it('submits its parent form on click', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    renderWithProviders(
      <form onSubmit={onSubmit}>
        <Button submit>Go</Button>
      </form>
    );
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('is natively disabled when loading and does not submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    renderWithProviders(
      <form onSubmit={onSubmit}>
        <Button submit loading>
          Go
        </Button>
      </form>
    );
    const button = screen.getByRole('button', { name: 'Go' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // In submit mode the root is a native <button>, which the UA styles instead of
  // letting it inherit: it gets its own font and native chrome. Only the
  // background is assertable here — jsdom ships no UA button font and does not
  // model `appearance`, so those two resets are verified in a real browser. The
  // background still catches the visible leak: text and link buttons paint none
  // of their own, so the UA's ButtonFace would show through without the reset.
  it('drops the native button background in submit mode', () => {
    renderWithProviders(
      <Button submit type="text">
        Go
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Go' });
    expect(button.tagName).toBe('BUTTON');
    expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });
});
