import { afterEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/index.js';
import { Card } from '../card/index.js';
import { Page } from '../page/index.js';
import { Code } from './index.js';

const renderDark = (ui: React.ReactElement) => {
  localStorage.setItem('theme-setting:test', 'dark');
  return renderWithProviders(ui, { identity: 'test' });
};

describe('Code', () => {
  afterEach(() => localStorage.clear());

  it('renders a code element with its text', () => {
    const { container } = renderWithProviders(<Code>maxLength</Code>);
    expect(container.querySelector('code')).toHaveTextContent('maxLength');
  });

  it('takes the inline code look', () => {
    const { container } = renderWithProviders(<Code>maxLength</Code>);
    const style = getComputedStyle(container.querySelector('code')!);
    // jsdom rewrites the family's single quotes as double quotes.
    expect(style.fontFamily.replaceAll('"', "'")).toBe(lightTheme.fontFamily.mono);
    expect(style.fontSize).toBe('0.875em');
  });

  describe('page edge', () => {
    it('is added in dark mode directly on a Page', () => {
      const { container } = renderDark(
        <Page>
          <Code>x</Code>
        </Page>
      );
      expect(getComputedStyle(container.querySelector('code')!).boxShadow).toContain('inset');
    });

    it('is not added in dark mode inside a Card', () => {
      const { container } = renderDark(
        <Page>
          <Card title="T">
            <Code>x</Code>
          </Card>
        </Page>
      );
      expect(getComputedStyle(container.querySelector('code')!).boxShadow).not.toContain('inset');
    });

    it('is not added in light mode on a Page', () => {
      const { container } = renderWithProviders(
        <Page>
          <Code>x</Code>
        </Page>
      );
      expect(getComputedStyle(container.querySelector('code')!).boxShadow).not.toContain('inset');
    });
  });

  it('merges className on the root', () => {
    const { container } = renderWithProviders(<Code className="mine">x</Code>);
    expect(container.querySelector('code')).toHaveClass('mine');
  });
});
