import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/index.js';
import { Card } from '../card/index.js';
import { Page } from '../page/index.js';
import { Surface } from '../surface/index.js';
import { CodeBlock } from './index.js';

const renderDark = (ui: React.ReactElement) => {
  localStorage.setItem('theme-setting:test', 'dark');
  return renderWithProviders(ui, { identity: 'test' });
};

const press = async (name: string) => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name }));
  });
};

describe('CodeBlock', () => {
  const writeText = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('shows code as plain text in a pre', () => {
    const { container } = renderWithProviders(<CodeBlock code="npm install" />);
    expect(container.querySelector('pre')).toHaveTextContent('npm install');
    expect(container.querySelector('pre')!.textContent).toBe('npm install');
  });

  it('children replace the shown text but Copy copies code', async () => {
    const { container } = renderWithProviders(
      <CodeBlock code="const a = 1;" copyable>
        <span>highlighted</span>
      </CodeBlock>
    );
    expect(container.querySelector('pre')!.textContent).toBe('highlighted');
    await press('Copy code');
    expect(writeText).toHaveBeenCalledWith('const a = 1;');
  });

  it('has no Copy button unless copyable', () => {
    renderWithProviders(<CodeBlock code="x" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('Copy shows Copied with a check for 2 seconds', async () => {
    renderWithProviders(<CodeBlock code="x" copyable />);
    const button = screen.getByRole('button', { name: 'Copy code' });
    expect(button).toHaveTextContent('Copy');
    await press('Copy code');
    const done = screen.getByRole('button');
    expect(done).toHaveTextContent('Copied');
    expect(done.querySelector('svg')).not.toBeNull();
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button', { name: 'Copy code' })).toHaveTextContent('Copy');
    expect(screen.queryByText('Copied')).toBeNull();
  });

  it('a second press within 2 seconds restarts the timer', async () => {
    renderWithProviders(<CodeBlock code="x" copyable />);
    await press('Copy code');
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    await press('Copied');
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole('button')).toHaveTextContent('Copied');
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  });

  it('unmounting while Copied leaves no timer', async () => {
    const { unmount } = renderWithProviders(<CodeBlock code="x" copyable />);
    await press('Copy code');
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('without a clipboard it says Could not copy', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    renderWithProviders(<CodeBlock code="x" copyable />);
    await press('Copy code');
    expect(screen.getByRole('button')).toHaveTextContent('Could not copy');
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  });

  it('says Could not copy when writeText rejects', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    renderWithProviders(<CodeBlock code="x" copyable />);
    await press('Copy code');
    expect(screen.getByRole('button')).toHaveTextContent('Could not copy');
  });

  it('ignores a write that settles after unmount', async () => {
    let resolve!: () => void;
    writeText.mockReturnValue(new Promise<void>((r) => (resolve = r)));
    const { unmount } = renderWithProviders(<CodeBlock code="x" copyable />);
    await press('Copy code');
    unmount();
    await act(async () => resolve());
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps the button width steady and exposes one name', async () => {
    renderWithProviders(<CodeBlock code="x" copyable />);
    const idle = screen.getByRole('button', { name: 'Copy code' });
    expect(getComputedStyle(idle).minWidth).toBe('10em');
    await press('Copy code');
    const done = screen.getByRole('button', { name: 'Copied' });
    expect(getComputedStyle(done).minWidth).toBe('10em');
    expect(screen.getAllByText('Copied').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /Could not copy/ })).toBeNull();
  });

  it('announces the result in a status region', async () => {
    renderWithProviders(<CodeBlock code="x" copyable />);
    expect(screen.getByRole('status')).toHaveTextContent('');
    await press('Copy code');
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
  });

  it('sets the code colour variables', () => {
    const { container } = renderWithProviders(<CodeBlock code="x" />);
    const root = container.firstElementChild!;
    const style = getComputedStyle(root);
    expect(style.getPropertyValue('--code-token-keyword')).toBe(lightTheme.color.code.keyword);
    expect(style.getPropertyValue('--code-foreground')).toBe(lightTheme.color.code.foreground);
    expect(style.getPropertyValue('--code-token-string-expression')).toBe(
      lightTheme.color.code.string
    );
  });

  it('wrap switches pre to pre-wrap', () => {
    const { container, rerender } = renderWithProviders(<CodeBlock code="x" />);
    expect(getComputedStyle(container.querySelector('pre')!).whiteSpace).not.toBe('pre-wrap');
    rerender(<CodeBlock code="x" wrap />);
    expect(getComputedStyle(container.querySelector('pre')!).whiteSpace).toBe('pre-wrap');
  });

  it('puts className on the root', () => {
    const { container } = renderWithProviders(<CodeBlock code="x" className="mine" />);
    expect(container.firstElementChild).toHaveClass('mine');
  });

  describe('page edge', () => {
    it('is not added in light mode on a Page', () => {
      const { container } = renderWithProviders(
        <Page>
          <CodeBlock code="x" />
        </Page>
      );
      expect(
        getComputedStyle(container.querySelector('pre')!.parentElement!).boxShadow
      ).not.toContain('inset');
    });

    it('is added in dark mode directly on a Page', () => {
      const { container } = renderDark(
        <Page>
          <CodeBlock code="x" />
        </Page>
      );
      expect(getComputedStyle(container.querySelector('pre')!.parentElement!).boxShadow).toContain(
        'inset'
      );
    });

    it('is not added in dark mode inside a Card', () => {
      const { container } = renderDark(
        <Page>
          <Card title="T">
            <CodeBlock code="x" />
          </Card>
        </Page>
      );
      expect(
        getComputedStyle(container.querySelector('pre')!.parentElement!).boxShadow
      ).not.toContain('inset');
    });
  });

  describe('radius follows surface depth', () => {
    const ui = <CodeBlock code="x" />;
    const rootRadius = () => getComputedStyle(screen.getByText('x').parentElement!).borderRadius;

    it('is lg (16px) on a Page', () => {
      renderWithProviders(<Page>{ui}</Page>);
      expect(rootRadius()).toBe('16px');
    });

    it('is md (8px) in Page > Surface', () => {
      renderWithProviders(
        <Page>
          <Surface>{ui}</Surface>
        </Page>
      );
      expect(rootRadius()).toBe('8px');
    });

    it('is sm (4px) two levels in', () => {
      renderWithProviders(
        <Page>
          <Surface>
            <Surface>{ui}</Surface>
          </Surface>
        </Page>
      );
      expect(rootRadius()).toBe('4px');
    });

    it('puts the Copy button one level deeper', () => {
      renderWithProviders(
        <Page>
          <CodeBlock code="x" copyable />
        </Page>
      );
      expect(getComputedStyle(screen.getByRole('button')).borderRadius).toBe('8px');
    });
  });
});
