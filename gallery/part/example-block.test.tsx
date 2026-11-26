import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { act, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { moduleBySlug } from '../data.js';
import { MOBILE_WIDTH } from '../frame-url.js';
import { ExampleBlock } from './example-block.js';

const button = moduleBySlug('button')!;

describe('ExampleBlock', () => {
  it('sets data-ready once its frame has loaded and posted its height', () => {
    const { container } = render(
      <ThemeProvider identity="test">
        <ToastProvider>
          <MemoryRouter>
            <ExampleBlock mod={button} example={button.examples[0]} />
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
            <ExampleBlock mod={button} example={button.examples[0]} />
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
            <ExampleBlock mod={button} example={mobile} />
            <ExampleBlock mod={button} example={button.examples[1]} />
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
