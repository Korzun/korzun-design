import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { act, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { moduleBySlug } from '../data.js';
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
});
