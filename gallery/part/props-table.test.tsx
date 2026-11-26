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
});
