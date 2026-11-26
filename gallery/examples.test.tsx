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
    const listed = new Set(siteData.modules.flatMap((m) => m.examples.map((e) => e.file)));
    expect(Object.keys(exampleComponents).filter((file) => !listed.has(file))).toEqual([]);
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

  it('Stack 05: "See all" shows more tags', () => {
    clickChangesDemo('src/component/stack/examples/05-nested-with-inline.tsx', /See all/);
  });
});
