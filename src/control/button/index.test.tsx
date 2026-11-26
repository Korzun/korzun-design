import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Page } from '../../component/page/index.js';
import { Surface } from '../../component/surface/index.js';
import { SearchIcon } from '../../icon/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
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
    renderWithProviders(<Button tabIndex={2}>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('tabindex', '2');
  });

  it('loading forces tabIndex -1', () => {
    renderWithProviders(
      <Button loading tabIndex={2}>
        Save
      </Button>
    );
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

describe('radius follows surface depth', () => {
  const radiusOf = () => getComputedStyle(screen.getByRole('button', { name: 'Go' })).borderRadius;

  it('is 16px outside any surface', () => {
    renderWithProviders(<Button>Go</Button>);
    expect(radiusOf()).toBe('16px');
  });

  it('is 16px directly on a Page', () => {
    renderWithProviders(
      <Page>
        <Button>Go</Button>
      </Page>
    );
    expect(radiusOf()).toBe('16px');
  });

  it('is 8px inside Page > Surface', () => {
    renderWithProviders(
      <Page>
        <Surface>
          <Button>Go</Button>
        </Surface>
      </Page>
    );
    expect(radiusOf()).toBe('8px');
  });

  it('is 4px two levels in', () => {
    renderWithProviders(
      <Page>
        <Surface>
          <Surface>
            <Button>Go</Button>
          </Surface>
        </Surface>
      </Page>
    );
    expect(radiusOf()).toBe('4px');
  });

  it('an explicit radius="background" wins inside Page > Surface (16px)', () => {
    renderWithProviders(
      <Page>
        <Surface>
          <Button radius="background">Go</Button>
        </Surface>
      </Page>
    );
    expect(radiusOf()).toBe('16px');
  });
});

// The JSS rules whose selector names one of `el`'s classes with `pseudo`,
// as `selector { body }` text. jsdom does not match `:focus-visible`, so the
// focus ring is checked in the sheet rather than through getComputedStyle.
const rulesFor = (el: Element, pseudo: string): string[] => {
  const css = Array.from(document.querySelectorAll('style'))
    .map((style) => style.textContent ?? '')
    .join('\n');
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selector]) =>
      Array.from(el.classList).some((cls) => selector.trim() === `.${cls}${pseudo}`)
    )
    .map(([, selector, body]) => `${selector.trim()} {${body}}`);
};

describe('keyboard focus on borderless variants', () => {
  it.each(['text', 'link'] as const)(
    'a %s button shows a solid border.focus ring on :focus-visible',
    (type) => {
      renderWithProviders(<Button type={type}>Go</Button>);
      const rules = rulesFor(screen.getByRole('button', { name: 'Go' }), ':focus-visible');
      expect(rules).toHaveLength(1);
      expect(rules[0]).toContain(`outline-color: ${lightTheme.color.border.focus}`);
      if (type === 'link') expect(rules[0]).toContain('outline-style: solid');
    }
  );
});

describe('height does not follow inherited line-height', () => {
  it('pins its own line-height and a 32px floor, even under a 1.3 line-height', () => {
    renderWithProviders(
      <div style={{ lineHeight: 1.3, fontSize: '16px' }}>
        <Button>Go</Button>
        <Button prefix={SearchIcon} ariaLabel="Search" />
      </div>
    );
    for (const name of ['Go', 'Search']) {
      const style = getComputedStyle(screen.getByRole('button', { name }));
      expect(style.lineHeight).toBe('0.875rem');
      expect(style.minHeight).toBe('2rem');
      expect(style.boxSizing).toBe('border-box');
    }
  });
});
