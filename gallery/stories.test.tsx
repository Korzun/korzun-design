import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import {
  collectStories,
  resolveArgs,
  stories,
  storyTree,
  toKebab,
  type StoryEntry,
  type StoryGroup,
} from './stories.js';

const Comp = () => <div />;

describe('toKebab', () => {
  it.each([
    ['Button', 'button'],
    ['WithIcons', 'with-icons'],
    ['Date Time Input', 'date-time-input'],
    ['  Control ', 'control'],
  ])('%s → %s', (input, out) => expect(toKebab(input)).toBe(out));
});

describe('collectStories', () => {
  it('derives ids from title segments and export names', () => {
    const [s] = collectStories({
      '/src/control/button/button.stories.tsx': {
        default: { title: 'Control / Button' },
        WithIcons: Comp,
      },
    });
    expect(s).toMatchObject({
      id: 'control/button/with-icons',
      path: ['Control', 'Button'],
      name: 'With Icons',
      sheet: true,
    });
  });
  it('merges file args/argTypes under story-level ones and honours storyName', () => {
    const Named = Object.assign(() => <div />, { storyName: 'Big one', args: { size: 'lg' } });
    const [s] = collectStories({
      '/a.stories.tsx': {
        default: {
          title: 'X',
          args: { size: 'sm', label: 'a' },
          argTypes: { size: { control: 'text' } },
        },
        Named,
      },
    });
    expect(s.name).toBe('Big one');
    expect(s.args).toEqual({ size: 'lg', label: 'a' });
    expect(s.argTypes).toEqual({ size: { control: 'text' } });
  });
  it('throws on a module without a string title', () => {
    expect(() => collectStories({ '/a.stories.tsx': { default: {}, A: Comp } })).toThrow(/title/);
  });
  it('throws on a non-function named export', () => {
    expect(() => collectStories({ '/a.stories.tsx': { default: { title: 'X' }, A: 42 } })).toThrow(
      /A/
    );
  });
  it('throws on duplicate ids across files or via storyName', () => {
    expect(() =>
      collectStories({
        '/a.stories.tsx': { default: { title: 'X' }, A: Comp },
        '/b.stories.tsx': { default: { title: 'X' }, A: Comp },
      })
    ).toThrow(/x\/a/);
  });
  it('returns entries sorted by id', () => {
    const ids = collectStories({
      '/a.stories.tsx': { default: { title: 'B' }, Z: Comp, A: Comp },
    }).map((s) => s.id);
    expect(ids).toEqual(['b/a', 'b/z']);
  });
});

describe('resolveArgs', () => {
  it('applies overrides over defaults and wires action args to onAction', () => {
    const [s] = collectStories({
      '/a.stories.tsx': {
        default: {
          title: 'X',
          args: { label: 'a', n: 1 },
          argTypes: { onClick: { control: 'action' } },
        },
        A: Comp,
      },
    });
    const seen: unknown[] = [];
    const args = resolveArgs(s, { n: 2 }, (name, a) => seen.push([name, a]));
    expect(args).toMatchObject({ label: 'a', n: 2 });
    (args.onClick as (x: number) => void)(7);
    expect(seen).toEqual([['onClick', [7]]]);
  });
});

describe('storyTree', () => {
  it('groups by path alphabetically with nested groups before entries', () => {
    const entries = collectStories({
      '/b.stories.tsx': { default: { title: 'Control / Button' }, Default: Comp, Primary: Comp },
      '/c.stories.tsx': { default: { title: 'Component / Card' }, Default: Comp },
      '/i.stories.tsx': { default: { title: 'Icon' }, Grid: Comp },
      '/k.stories.tsx': { default: { title: 'Control' }, Intro: Comp },
    });
    const tree = storyTree(entries);
    expect(tree.map((g) => g.label)).toEqual(['Component', 'Control', 'Icon']);
    const control = tree[1];
    expect(control.children.map((c) => ('label' in c ? c.label : c.id))).toEqual([
      'Button',
      'control/intro',
    ]);
    const button = control.children[0] as StoryGroup;
    expect(button.children.map((c) => (c as StoryEntry).id)).toEqual([
      'control/button/default',
      'control/button/primary',
    ]);
  });
});

describe('every story mounts', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });
  it('found the button stories', () => {
    expect(stories.map((s) => s.id)).toEqual(
      expect.arrayContaining(['control/button/default', 'control/button/with-icons'])
    );
  });
  it.each(stories.map((s) => [s.id, s] as const))('%s renders without console errors', (_id, s) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Story = s.component;
    render(
      <MemoryRouter>
        <ThemeProvider identity="gallery">
          <ToastProvider>
            <Story {...resolveArgs(s, {}, () => {})} />
          </ToastProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
  it('declares an arg default for every non-action argType', () => {
    for (const s of stories)
      for (const [k, t] of Object.entries(s.argTypes))
        if (t.control !== 'action') expect(s.args, `${s.id}.${k}`).toHaveProperty(k);
  });
});
