import { ThemeProvider } from '@korzun/design/theme';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

import { NotFound } from '../not-found.js';
import { docHref, Markdown } from './markdown.js';

describe('docHref', () => {
  const from = 'docs/component/popover.md';
  const route = '/components/popover';

  it('puts an in-page #section link after the current route', () => {
    expect(docHref('#layers', from, route)).toBe('#/components/popover#layers');
  });

  it('maps a doc link to its route and keeps the fragment', () => {
    expect(docHref('../tokens.md#recipe', 'docs/control/button.md', route)).toBe(
      '#/guides/tokens#recipe'
    );
    expect(
      docHref('../control/page-actions-menu.md#pageactionitem', 'docs/component/page.md', route)
    ).toBe('#/components/page-actions-menu#pageactionitem');
    expect(docHref('nav-desktop.md#navitem', 'docs/component/nav-mobile.md', route)).toBe(
      '#/components/nav-desktop#navitem'
    );
    expect(docHref('../corners.md', 'docs/control/button.md', route)).toBe('#/guides/corners');
    expect(docHref('corners.md', 'docs/index.md', route)).toBe('#/guides/corners');
  });

  it('maps a recipe doc link to its recipe route, not a component page', () => {
    expect(docHref('recipes/login.md', 'docs/patterns.md', '/guides/patterns')).toBe(
      '#/recipes/login'
    );
    expect(docHref('../recipes/login.md#why', 'docs/control/button.md', route)).toBe(
      '#/recipes/login#why'
    );
  });

  it('leaves http(s), mailto and non-doc relative links alone', () => {
    expect(docHref('https://github.com/x#readme', from, route)).toBe('https://github.com/x#readme');
    expect(docHref('http://example.com', from, route)).toBe('http://example.com');
    expect(docHref('mailto:a@b.c', from, route)).toBe('mailto:a@b.c');
    expect(docHref('/llms.txt', from, route)).toBe('/llms.txt');
    expect(docHref('./image.png', from, route)).toBe('./image.png');
  });

  it.each([
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    ' java\tscript:alert(1)',
    'data:text/html,<b>x</b>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
  ])('drops a link with another scheme (%s) to #', (href) => {
    expect(docHref(href, from, route)).toBe('#');
  });
});

const Where = () => {
  const { pathname, hash } = useLocation();
  return <output aria-label="location">{`${pathname}${hash}`}</output>;
};

const mount = (source: string, inline = false) =>
  render(
    <ThemeProvider identity="test">
      <MemoryRouter initialEntries={['/components/popover']}>
        <Routes>
          <Route
            path="/components/:slug"
            element={
              <>
                <Markdown source={source} from="docs/component/popover.md" inline={inline} />
                <Where />
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

describe('Markdown', () => {
  // jsdom has no scrollIntoView; each test gets a fresh spy.
  let scroll: ReturnType<typeof vi.fn<(arg?: boolean | ScrollIntoViewOptions) => void>>;
  beforeEach(() => {
    scroll = vi.fn<(arg?: boolean | ScrollIntoViewOptions) => void>();
    Element.prototype.scrollIntoView = scroll;
  });
  afterEach(() => {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });

  it('renders links as their text with links={false}, for markdown inside a link', () => {
    const { container } = render(
      <ThemeProvider identity="test">
        <MemoryRouter>
          <Markdown
            source="Uses `Stack`; see [corners](../corners.md) and ![a logo](x.png)."
            inline
            links={false}
          />
        </MemoryRouter>
      </ThemeProvider>
    );
    const span = container.querySelector('span')!;
    expect(span.querySelector('a, img')).toBeNull();
    expect(span.querySelector('code')).toHaveTextContent('Stack');
    expect(span).toHaveTextContent('Uses Stack; see corners and a logo.');
  });

  it('gives headings the slug ids section links use, unique on the page', () => {
    const { container } = mount('## Header slot\n\n### `Layers`\n\n## Notes\n\n## Notes\n');
    const ids = Array.from(container.querySelectorAll('h2, h3')).map((h) => h.id);
    expect(ids).toEqual(['header-slot', 'layers', 'notes', 'notes-1']);
  });

  it('renders an unsafe scheme as a dead # link and raw HTML as text', () => {
    const { container } = mount('[j](javascript:alert(1)) <img src=x onerror="alert(1)">');
    expect(screen.getByRole('link', { name: 'j' })).toHaveAttribute('href', '#');
    expect(container.querySelector('img')).toBeNull();
  });

  it('scrolls to the section on an in-page link click instead of routing to Not found', () => {
    mount('See [Layers](#layers).\n\n## Layers\n\nBody.');
    const link = screen.getByRole('link', { name: 'Layers' });
    expect(link).toHaveAttribute('href', '#/components/popover#layers');
    const notPrevented = fireEvent.click(link);
    expect(notPrevented).toBe(false);
    expect(screen.queryByRole('heading', { name: 'Not found' })).toBeNull();
    expect(screen.getByRole('status', { name: 'location' })).toHaveTextContent(
      '/components/popover#layers'
    );
    expect(scroll).toHaveBeenCalled();
    expect(scroll.mock.contexts[0]).toBe(screen.getByRole('heading', { name: 'Layers' }));
  });

  it('handles in-page links in inline text too (a prop description)', () => {
    mount('see [Layers](#layers)', true);
    expect(fireEvent.click(screen.getByRole('link', { name: 'Layers' }))).toBe(false);
    expect(screen.getByRole('status', { name: 'location' })).toHaveTextContent(
      '/components/popover#layers'
    );
  });

  it('leaves a link to another page to the browser', () => {
    mount('[Tokens](../tokens.md#recipe)');
    const link = screen.getByRole('link', { name: 'Tokens' });
    expect(link).toHaveAttribute('href', '#/guides/tokens#recipe');
    expect(fireEvent.click(link)).toBe(true);
  });
});

describe('Markdown fenced code', () => {
  it('highlights a tsx fence', () => {
    const { container } = mount('```tsx\nconst n = 1;\n```');
    const code = container.querySelector('pre code')!;
    expect(code).toHaveClass('language-tsx');
    expect(code.querySelector('[style*="--code-token-keyword"]')).toHaveTextContent('const');
  });

  it('escapes a fence in an unknown language and keeps its info string out of the markup', () => {
    const { container } = mount('```x" onclick="alert(1)\n<b>hi</b>\n```');
    const code = container.querySelector('pre code')!;
    expect(code.getAttribute('onclick')).toBeNull();
    expect(code.querySelector('b')).toBeNull();
    expect(code).toHaveTextContent('<b>hi</b>');
  });
});
