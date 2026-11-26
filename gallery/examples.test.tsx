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
