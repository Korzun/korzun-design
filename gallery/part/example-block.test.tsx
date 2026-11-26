import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { act, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { moduleBySlug, moduleOwner, type ExampleOwner } from '../data.js';
import { MOBILE_WIDTH, SCREEN_HEIGHT } from '../frame-url.js';
import { ExampleBlock } from './example-block.js';

const button = moduleBySlug('button')!;

describe('ExampleBlock', () => {
  it('sets data-ready once its frame has loaded and posted its height', () => {
    const { container } = render(
      <ThemeProvider identity="test">
        <ToastProvider>
          <MemoryRouter>
            <ExampleBlock owner={moduleOwner(button)} example={button.examples[0]} />
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    );
    const section = container.querySelector('section')!;
    const iframe = section.querySelector('iframe')!;
    expect(section).not.toHaveAttribute('data-ready');
    fireEvent.load(iframe);
    expect(section).not.toHaveAttribute('data-ready');
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          source: iframe.contentWindow,
          data: { type: 'gallery:height', height: 120 },
        })
      );
    });
    expect(section).toHaveAttribute('data-ready');
    expect(iframe).toHaveAttribute('height', '120');
  });

  it('reveals the frame on its first height message, even before load fires', () => {
    const { container } = render(
      <ThemeProvider identity="test">
        <ToastProvider>
          <MemoryRouter>
            <ExampleBlock owner={moduleOwner(button)} example={button.examples[0]} />
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    );
    const iframe = container.querySelector('iframe')!;
    expect(getComputedStyle(iframe).visibility).toBe('hidden');
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          source: iframe.contentWindow,
          data: { type: 'gallery:height', height: 80 },
        })
      );
    });
    expect(getComputedStyle(iframe).visibility).not.toBe('hidden');
  });

  it('renders a @viewport mobile example in a phone-width frame', () => {
    const mobile = { ...button.examples[0], viewport: 'mobile' as const };
    const { container } = render(
      <ThemeProvider identity="test">
        <ToastProvider>
          <MemoryRouter>
            <ExampleBlock owner={moduleOwner(button)} example={mobile} />
            <ExampleBlock owner={moduleOwner(button)} example={button.examples[1]} />
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    );
    const [phone, wide] = container.querySelectorAll('iframe');
    expect(phone).toHaveAttribute('data-viewport', 'mobile');
    expect(getComputedStyle(phone).width).toBe(`${MOBILE_WIDTH}px`);
    expect(wide).not.toHaveAttribute('data-viewport');
    expect(getComputedStyle(wide).width).toBe('100%');
  });

  const mountBlock = (owner: ExampleOwner, example = button.examples[0]!) =>
    render(
      <ThemeProvider identity="test">
        <ToastProvider>
          <MemoryRouter>
            <ExampleBlock owner={owner} example={example} />
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    );
  const recipe: ExampleOwner = {
    title: 'Sign in',
    docPath: 'docs/recipes/login.md',
    framePath: 'recipe/login',
    examples: button.examples,
  };

  it('points a module example at its module frame and a recipe example at the recipe frame', () => {
    const mod = mountBlock(moduleOwner(button)).container.querySelector('iframe')!;
    expect(mod.getAttribute('src')).toContain(`#/frame/button/${button.examples[0]!.slug}?`);
    const rec = mountBlock(recipe).container.querySelector('iframe')!;
    expect(rec.getAttribute('src')).toContain(`#/frame/recipe/login/${button.examples[0]!.slug}?`);
    expect(rec).toHaveAttribute('title', `Sign in: ${button.examples[0]!.title}`);
  });

  it('gives a @viewport screen example a fixed height that height messages do not change', () => {
    const screenEx = { ...button.examples[0]!, viewport: 'screen' as const };
    const iframe = mountBlock(recipe, screenEx).container.querySelector('iframe')!;
    expect(iframe).toHaveAttribute('height', String(SCREEN_HEIGHT));
    expect(SCREEN_HEIGHT).toBe(640);
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          source: iframe.contentWindow,
          data: { type: 'gallery:height', height: 2000 },
        })
      );
    });
    expect(iframe).toHaveAttribute('height', String(SCREEN_HEIGHT));
    fireEvent.load(iframe);
    expect(getComputedStyle(iframe).visibility).not.toBe('hidden');
  });
});

describe('ExampleBlock code', () => {
  it('shows the example code highlighted, text unchanged', () => {
    const { container, getByRole } = render(
      <ThemeProvider identity="test">
        <ToastProvider>
          <MemoryRouter>
            <ExampleBlock mod={button} example={button.examples[0]} />
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    );
    fireEvent.click(getByRole('button', { name: 'Show code' }));
    const code = container.querySelector('pre code')!;
    expect(code.textContent).toBe(button.examples[0].code);
    expect(code.querySelector('[style*="--code-token-keyword"]')).not.toBeNull();
  });
});
