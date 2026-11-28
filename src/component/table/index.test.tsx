import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../../control/button/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/index.js';
import { Page } from '../page/index.js';
import { Surface } from '../surface/index.js';
import { Table, type TableColumn } from './index.js';

type Book = { id: string; title: string; author: string };

const books: Book[] = [
  { id: 'a', title: 'Middlemarch', author: 'Eliot' },
  { id: 'b', title: 'Persuasion', author: 'Austen' },
];
const columns: TableColumn<Book>[] = [
  { key: 'title', title: 'Title' },
  { key: 'author', title: 'Author' },
];

describe('Table', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders a header cell per column and a row per item', () => {
    renderWithProviders(<Table columns={columns} rows={books} rowKey="id" ariaLabel="Books" />);
    expect(screen.getByRole('table', { name: 'Books' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Title',
      'Author',
    ]);
    expect(screen.getAllByRole('row')).toHaveLength(books.length + 1);
  });

  it('default cell renders falsy values, dash only for null and undefined', () => {
    type Row = { n?: unknown };
    const rows: Row[] = [{ n: 0 }, { n: false }, { n: '' }, { n: null }, {}];
    renderWithProviders(
      <Table
        columns={[{ key: 'n', title: 'N' }]}
        rows={rows}
        rowKey={(_row, index) => String(index)}
      />
    );
    expect(screen.getAllByRole('cell').map((c) => c.textContent)).toEqual([
      '0',
      'false',
      '',
      '–',
      '–',
    ]);
  });

  it('render receives the row and its index', () => {
    const render_ = vi.fn((row: Book, index: number) => `${index}:${row.title}`);
    renderWithProviders(
      <Table
        columns={[{ key: 'title', title: 'Title', render: render_ }]}
        rows={books}
        rowKey="id"
      />
    );
    expect(render_).toHaveBeenCalledWith(books[1], 1);
    expect(screen.getAllByRole('cell').map((c) => c.textContent)).toEqual([
      '0:Middlemarch',
      '1:Persuasion',
    ]);
  });

  it('labels each value for the phone layout, except label: false', () => {
    renderWithProviders(
      <Table
        columns={[
          { key: 'title', title: 'Title' },
          { key: 'author', title: 'Author', label: 'Shelf' },
          { key: 'id', title: 'Id', label: false },
        ]}
        rows={[books[0]!]}
        rowKey="id"
      />
    );
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveAttribute('data-label', 'Title');
    expect(cells[1]).toHaveAttribute('data-label', 'Shelf');
    expect(cells[2]).not.toHaveAttribute('data-label');
  });

  it('empty rows show the empty message across all columns', () => {
    const { unmount } = renderWithProviders(
      <Table columns={columns} rows={[]} rowKey="id" empty="No books yet" />
    );
    const body = screen.getAllByRole('rowgroup')[1]!;
    expect(within(body).getAllByRole('row')).toHaveLength(1);
    const cell = within(body).getByRole('cell');
    expect((cell as HTMLTableCellElement).colSpan).toBe(columns.length);
    expect(cell).toHaveTextContent('No books yet');
    unmount();

    const { container } = renderWithProviders(<Table columns={columns} rows={[]} rowKey="id" />);
    expect(container.querySelector('tbody')!.querySelectorAll('tr')).toHaveLength(0);
    expect(container.querySelectorAll('thead th')).toHaveLength(2);
  });

  it('rowKey accepts a field name or a function', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = renderWithProviders(<Table columns={columns} rows={books} rowKey="id" />);
    unmount();
    renderWithProviders(<Table columns={columns} rows={books} rowKey={(row) => row.id} />);
    expect(error).not.toHaveBeenCalled();
  });

  it('wide and nowrap and align land on the cells', () => {
    renderWithProviders(
      <Table
        columns={[
          { key: 'title', title: 'Title', wide: true },
          { key: 'author', title: 'Author', nowrap: true },
          { key: 'id', title: 'Id', align: 'end' },
        ]}
        rows={[books[0]!]}
        rowKey="id"
      />
    );
    const cells = screen.getAllByRole('cell');
    expect(cells[0]!.className).toMatch(/wide/);
    expect(cells[1]!.className).toMatch(/nowrap/);
    expect(getComputedStyle(cells[1]!).whiteSpace).toBe('nowrap');
    expect(getComputedStyle(cells[2]!).textAlign).toBe('right');
    expect(getComputedStyle(cells[0]!).textAlign).not.toBe('right');
  });

  it('width sets the header cell width', () => {
    renderWithProviders(
      <Table
        columns={[
          { key: 'title', title: 'Title', width: '35%' },
          { key: 'author', title: 'Author' },
        ]}
        rows={books}
        rowKey="id"
      />
    );
    expect(screen.getByRole('columnheader', { name: 'Title' })).toHaveStyle({ width: '35%' });
  });

  it("minWidth sets the table's minimum width on a wide screen", () => {
    renderWithProviders(
      <Table columns={columns} rows={books} rowKey="id" minWidth="40rem" ariaLabel="Books" />
    );
    const table = screen.getByRole('table');
    expect(table.style.getPropertyValue('--table-min-width')).toBe('40rem');
    // The rule that reads it sits under the wide-screen breakpoint only.
    const css = Array.from(document.querySelectorAll('style'))
      .map((style) => style.textContent ?? '')
      .join('\n');
    const media = lightTheme.breakpoint.normal;
    const at = css.indexOf('var(--table-min-width');
    expect(at).toBeGreaterThan(-1);
    expect(css.lastIndexOf(media, at)).toBeGreaterThan(-1);
    expect(css.slice(css.lastIndexOf(media, at), at)).not.toContain(lightTheme.breakpoint.mobile);
    expect(css.indexOf('var(--table-min-width', at + 1)).toBe(-1);
  });

  it('merges className on the root', () => {
    const { container } = renderWithProviders(
      <Table columns={columns} rows={books} rowKey="id" className="mine" />
    );
    expect(container.firstElementChild).toHaveClass('mine');
  });

  describe('radius follows surface depth', () => {
    const ui = <Table columns={columns} rows={books} rowKey="id" />;
    const rootRadius = () =>
      getComputedStyle(screen.getByRole('table').parentElement!).borderRadius;

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

    it('puts a Button in a cell one level deeper', () => {
      const withButton: TableColumn<Book>[] = [
        { key: 'title', title: 'Title', render: () => <Button>Go</Button> },
      ];
      renderWithProviders(
        <Page>
          <Table columns={withButton} rows={[books[0]!]} rowKey="id" />
        </Page>
      );
      expect(getComputedStyle(screen.getByRole('button', { name: 'Go' })).borderRadius).toBe('8px');
    });
  });
});
