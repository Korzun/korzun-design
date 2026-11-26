import { ThemeProvider } from '@korzun/design/theme';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import type { TypeTable } from '../../scripts/docs-gen/types.js';
import { PropsTable } from './props-table.js';

const mount = (table: TypeTable) =>
  render(
    <ThemeProvider identity="test">
      <MemoryRouter>
        <PropsTable table={table} tables={[table]} from="docs/control/menu.md" />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('PropsTable', () => {
  it('labels the type and default cells and marks the description wide, for the stacked phone layout', () => {
    const { container } = mount({
      name: 'ButtonProps',
      kind: 'props',
      rows: [
        { name: 'size', type: 'string', required: false, default: "'m'", description: 'Size.' },
      ],
    });
    const cells = Array.from(container.querySelectorAll('tbody td'));
    expect(cells.map((td) => td.getAttribute('data-label'))).toEqual([
      null,
      'Type',
      'Default',
      null,
    ]);
    expect(cells[3]!.className).toMatch(/wide/);
  });

  it('shows the type description under the heading, with markdown', () => {
    mount({
      name: 'MenuLinkItem',
      kind: 'object',
      rows: [{ name: 'to', type: 'string', required: true, description: 'Path.' }],
      description: 'An item that navigates. Needs a `Router`.',
    });
    const text = screen.getByText(/An item that navigates/);
    expect(text).toBeInTheDocument();
    expect(text.querySelector('code')).toHaveTextContent('Router');
  });

  it('shows an alias description too, and nothing extra without one', () => {
    const { container } = mount({ name: 'Side', kind: 'alias', rows: [], text: "'top'" });
    expect(container.querySelectorAll('p')).toHaveLength(0);
    mount({ name: 'Gap', kind: 'alias', rows: [], text: 'number', description: 'Pixels.' });
    expect(screen.getByText('Pixels.')).toBeInTheDocument();
  });

  it('shows a prose default as plain text and a value default as code', () => {
    mount({
      name: 'NumberInputProps',
      kind: 'props',
      rows: [
        {
          name: 'validate',
          type: '() => boolean',
          required: false,
          default: 'accepts numeric text',
          defaultProse: true,
          description: '',
        },
        { name: 'size', type: 'string', required: false, default: "'m'", description: '' },
      ],
    });
    const prose = screen.getByText('accepts numeric text');
    expect(prose.tagName).not.toBe('CODE');
    expect(prose.closest('code')).toBeNull();
    expect(screen.getByText("'m'").tagName).toBe('CODE');
  });

  it('links an array type with no space before the brackets', () => {
    const item: TypeTable = { name: 'MenuItem', kind: 'object', rows: [] };
    const props: TypeTable = {
      name: 'MenuProps',
      kind: 'props',
      rows: [{ name: 'items', type: 'MenuItem[]', required: true, description: '' }],
    };
    render(
      <ThemeProvider identity="test">
        <MemoryRouter>
          <PropsTable table={props} tables={[props, item]} from="docs/control/menu.md" />
        </MemoryRouter>
      </ThemeProvider>
    );
    const link = screen.getByRole('link', { name: 'MenuItem' });
    expect(link.closest('code')).toHaveTextContent(/^MenuItem\[\]$/);
  });
});

describe('PropsTable links to types documented on other pages', () => {
  const props: TypeTable = {
    name: 'PageActionsBarProps',
    kind: 'props',
    rows: [{ name: 'items', type: 'PageActionItem[]', required: true, description: '' }],
  };

  it('links a type another module documents to that page and its table', () => {
    render(
      <ThemeProvider identity="test">
        <MemoryRouter>
          <PropsTable
            table={props}
            tables={[props]}
            typePages={new Map([['PageActionItem', 'page-actions-menu']])}
            from="docs/control/page-actions-bar.md"
          />
        </MemoryRouter>
      </ThemeProvider>
    );
    const link = screen.getByRole('link', { name: 'PageActionItem' });
    expect(link).toHaveAttribute('href', '#/components/page-actions-menu#pageactionitem');
    expect(link.closest('code')).toHaveTextContent(/^PageActionItem\[\]$/);
  });

  it('does not link a recursive type to its own table, as the .md does not', () => {
    const item: TypeTable = {
      name: 'MenuItem',
      kind: 'object',
      rows: [{ name: 'children', type: 'MenuItem[]', required: false, description: '' }],
    };
    render(
      <ThemeProvider identity="test">
        <MemoryRouter initialEntries={['/components/menu']}>
          <PropsTable
            table={item}
            tables={[item]}
            typePages={new Map([['MenuItem', 'menu']])}
            from="docs/control/menu.md"
          />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.queryByRole('link', { name: 'MenuItem' })).toBeNull();
    expect(screen.getByText('MenuItem[]').tagName).toBe('CODE');
  });

  it('prefers a table on this page over one elsewhere', () => {
    const item: TypeTable = { name: 'PageActionItem', kind: 'object', rows: [] };
    render(
      <ThemeProvider identity="test">
        <MemoryRouter initialEntries={['/components/page-actions-bar']}>
          <PropsTable
            table={props}
            tables={[props, item]}
            typePages={new Map([['PageActionItem', 'page-actions-menu']])}
            from="docs/control/page-actions-bar.md"
          />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByRole('link', { name: 'PageActionItem' })).toHaveAttribute(
      'href',
      '#/components/page-actions-bar#pageactionitem'
    );
  });
});
