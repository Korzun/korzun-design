import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from '../src/test-utils.js';
import { exampleComponents, siteData } from './data.js';

beforeAll(() => {
  // jsdom lacks the dialog API that dialog examples call.
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('examples', () => {
  it('finds the example files', () => {
    expect(Object.keys(exampleComponents).length).toBeGreaterThan(0);
  });

  for (const [file, Example] of Object.entries(exampleComponents)) {
    it(`${file} renders`, () => {
      const { container } = renderWithProviders(<Example />);
      expect(container).not.toBeEmptyDOMElement();
    });
  }

  it('lists every example file in the generated site data', () => {
    const listed = new Set(
      [
        ...siteData.modules.flatMap((m) => [...m.examples, ...(m.preview ? [m.preview] : [])]),
        ...siteData.recipes.flatMap((r) => r.examples),
      ].map((e) => e.file)
    );
    expect(Object.keys(exampleComponents).filter((file) => !listed.has(file))).toEqual([]);
  });
});

describe('previews', () => {
  it('every module has one, kept off its examples', () => {
    for (const mod of siteData.modules) {
      expect(mod.preview?.file, mod.slug).toMatch(/\/examples\/preview\.tsx$/);
      expect(mod.examples.map((e) => e.slug)).not.toContain('preview');
    }
  });
});

describe('pilot examples wire every button', () => {
  // A demo whose button does nothing looks broken; the Stack pilot is copied by
  // other modules' examples, so its buttons must change what the demo shows.
  const clickChangesDemo = (file: string, name: RegExp) => {
    const Example = exampleComponents[file];
    expect(Example).toBeDefined();
    const { container } = renderWithProviders(<Example />);
    for (const button of screen.getAllByRole('button', { name })) {
      const before = container.textContent;
      fireEvent.click(button);
      expect(container.textContent).not.toBe(before);
    }
  };

  it('Stack 03: each "Add a book" counts', () => {
    clickChangesDemo('src/component/stack/examples/03-align.tsx', /Add a book/);
  });

  it.each([
    ['02-variants', /^(Primary|Default|Text|Link|Dashed|Danger|Primary danger)$/],
    ['03-danger', /^(Log out|Delete book)$/],
    ['04-icons', /^(Search|Next|Settings)$/],
  ])('Button %s: each button shows what was pressed', (file, name) => {
    clickChangesDemo(`src/control/button/examples/${file}.tsx`, name);
  });

  it('Stack 05: "See all" shows more tags', () => {
    clickChangesDemo('src/component/stack/examples/05-nested-with-inline.tsx', /See all/);
  });
});
