// client/src/control/switch/index.test.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Switch } from './index.js';

const rgb = (hex: string) =>
  `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;

describe('Switch', () => {
  it('renders with role="switch" and correct aria-checked', () => {
    renderWithProviders(<Switch name="dark-mode" checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  /**
   * The track is the switch's only unlabelled child element, and the radius
   * class is hashed by JSS, so these compare classes across renders rather
   * than asserting any literal name: the default must MATCH an explicit
   * `inset` and DIFFER from `pill`. That is falsifiable in the way that
   * matters — a `radius` prop that never reached the track would pass the
   * first and fail the second.
   */
  const trackClass = (container: HTMLElement): string => {
    // Found via the thumb — the one div in either layout with no children of
    // its own — because a plain `div` query matches the `row` WRAPPER first,
    // which carries no radius class and made this comparison vacuous.
    const divs = [...container.querySelectorAll('[role="switch"] div')];
    const thumb = divs.find((div) => div.children.length === 0);
    if (thumb?.parentElement == null) throw new Error('no track rendered');
    return thumb.parentElement.className;
  };

  it('defaults to the inset radius, concentric with the row it sits in', () => {
    const { container: byDefault } = renderWithProviders(
      <Switch name="dark-mode" checked={false} onChange={vi.fn()} />
    );
    const { container: explicit } = renderWithProviders(
      <Switch name="dark-mode" checked={false} onChange={vi.fn()} radius="inset" />
    );
    expect(trackClass(byDefault)).toBe(trackClass(explicit));
  });

  it('gives the track a different shape when asked for a pill', () => {
    const { container: inset } = renderWithProviders(
      <Switch name="dark-mode" checked={false} onChange={vi.fn()} radius="inset" />
    );
    const { container: pill } = renderWithProviders(
      <Switch name="dark-mode" checked={false} onChange={vi.fn()} radius="pill" />
    );
    expect(trackClass(pill)).not.toBe(trackClass(inset));
  });

  describe('loading', () => {
    const hasSpinner = (container: HTMLElement): boolean => container.querySelector('svg') !== null;

    const loadAfterDelay = (props: Partial<React.ComponentProps<typeof Switch>>) => {
      const result = renderWithProviders(
        <Switch name="dark-mode" checked={true} onChange={vi.fn()} loading={true} {...props} />
      );
      act(() => {
        vi.advanceTimersByTime(150);
      });
      return result;
    };

    it('an inset switch shows a squared ring, not the round spinner, while loading', () => {
      vi.useFakeTimers();
      try {
        const { container } = loadAfterDelay({});
        expect(screen.getByTestId('switch-ring')).toBeInTheDocument();
        expect(hasSpinner(container)).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('a pill switch keeps the round spinner while loading', () => {
      vi.useFakeTimers();
      try {
        const { container } = loadAfterDelay({ radius: 'pill' });
        expect(hasSpinner(container)).toBe(true);
        expect(screen.queryByTestId('switch-ring')).toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });

    it('the ring sits where the thumb would', () => {
      const idle = renderWithProviders(<Switch name="a" checked={true} onChange={vi.fn()} />);
      const thumbClass = idle.container.querySelector(
        '[role="switch"] > div > div > div'
      )!.className;
      idle.unmount();
      vi.useFakeTimers();
      try {
        loadAfterDelay({});
        expect(screen.getByTestId('switch-ring').className).toContain(thumbClass);
      } finally {
        vi.useRealTimers();
      }
    });

    it('shows nothing for the first moments, so a fast save never flashes', () => {
      vi.useFakeTimers();
      try {
        const { container } = renderWithProviders(
          <Switch name="dark-mode" checked={true} onChange={vi.fn()} loading={true} />
        );
        expect(hasSpinner(container)).toBe(false);
        act(() => {
          vi.advanceTimersByTime(149);
        });
        expect(hasSpinner(container)).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it('shows the spinner once the save outlives the delay', () => {
      vi.useFakeTimers();
      try {
        const { container } = renderWithProviders(
          <Switch name="dark-mode" checked={true} onChange={vi.fn()} loading={true} radius="pill" />
        );
        act(() => {
          vi.advanceTimersByTime(150);
        });
        expect(hasSpinner(container)).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    /**
     * The delay is cosmetic, so it must NOT also gate the click guard: a
     * second click inside the first 150ms would otherwise fire a second
     * mutation against a row whose first one has not settled.
     */
    it('ignores clicks immediately, before the spinner is even visible', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderWithProviders(
        <Switch name="dark-mode" checked={false} onChange={onChange} loading={true} />
      );
      await user.click(screen.getByRole('switch'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('reports busy to assistive tech without waiting out the delay', () => {
      renderWithProviders(
        <Switch name="dark-mode" checked={false} onChange={vi.fn()} loading={true} />
      );
      expect(screen.getByRole('switch')).toHaveAttribute('aria-busy', 'true');
    });
  });

  it('calls onChange with the toggled value when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Switch name="dark-mode" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange when Enter is pressed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Switch name="dark-mode" checked={false} onChange={onChange} />);
    screen.getByRole('switch').focus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange when Space is pressed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Switch name="dark-mode" checked={false} onChange={onChange} />);
    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Switch name="dark-mode" checked={false} disabled onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders the label text when provided', () => {
    renderWithProviders(
      <Switch name="dark-mode" checked={false} label="Dark mode" onChange={vi.fn()} />
    );
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('renders a description and links it via aria-describedby', () => {
    renderWithProviders(
      <Switch
        name="simplify"
        checked={false}
        label="Simplify"
        description="Helper text explaining the toggle"
        onChange={vi.fn()}
      />
    );
    const description = screen.getByText('Helper text explaining the toggle');
    expect(description).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-describedby', description.id);
  });

  it('does not toggle when the description is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <Switch
        name="simplify"
        checked={false}
        label="Simplify"
        description="Helper text explaining the toggle"
        onChange={onChange}
      />
    );
    await user.click(screen.getByText('Helper text explaining the toggle'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders label and description and still toggles in the horizontal layout', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <Switch
        name="grayscale"
        checked={false}
        label="Grayscale"
        description="Helper text explaining the toggle"
        layout="horizontal"
        onChange={onChange}
      />
    );
    expect(screen.getByText('Grayscale')).toBeInTheDocument();
    expect(screen.getByText('Helper text explaining the toggle')).toBeInTheDocument();
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles when the description is clicked in the horizontal layout', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <Switch
        name="grayscale"
        checked={false}
        label="Grayscale"
        description="Helper text explaining the toggle"
        layout="horizontal"
        onChange={onChange}
      />
    );
    await user.click(screen.getByText('Helper text explaining the toggle'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('unchecked track', () => {
  // The track is the thumb's parent; the thumb is the one childless div.
  const track = () => {
    const divs = [...document.querySelectorAll('[role="switch"] div')];
    const thumb = divs.find((div) => div.children.length === 0);
    if (thumb?.parentElement == null) throw new Error('no track rendered');
    return thumb.parentElement;
  };

  it('is painted bg.switchOff, which holds 3:1 on a shaded row', () => {
    renderWithProviders(
      <Switch name="n" checked={false} label="N" layout="horizontal" onChange={vi.fn()} />
    );
    expect(getComputedStyle(track()).backgroundColor).toBe(rgb(lightTheme.color.bg.switchOff));
  });

  it('turns brand when checked', () => {
    renderWithProviders(<Switch name="n" checked label="N" onChange={vi.fn()} />);
    expect(getComputedStyle(track()).backgroundColor).toBe(rgb(lightTheme.color.brand.default));
  });
});
