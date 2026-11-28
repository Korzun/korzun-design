// The docs sections, in display order, each with its modules in alphabetical
// order by doc title (a test holds this). A module is its doc's basename
// (`docs/control/text-input.md` is `text-input`).
// `[parent, [children]]` nests modules that only make sense with their parent:
// the overview leaves them out (a search still finds them), the parent's page
// shows them under Parts, and their pages link back to it.
//
// The generator requires every documented module to appear here exactly once,
// in the section its front matter `category` names, so the tree and the docs
// cannot drift. The overview and llms.txt read the order from here.
export const SECTIONS = Object.freeze([
  {
    name: 'Layout',
    modules: [
      ['card', ['card-row']],
      'collapsible-section',
      'divider',
      ['page', ['page-actions-bar', 'page-actions-menu', 'page-footer-actions']],
      'space',
      'surface',
      'top-fade',
    ],
  },
  { name: 'Navigation', modules: ['anchor', 'back-button', 'nav-desktop', 'nav-mobile'] },
  { name: 'Typography', modules: ['code', 'heading', 'text'] },
  {
    name: 'Inputs',
    modules: [
      'button',
      'chips-input',
      'date-time-input',
      'field-list',
      'number-input',
      'segmented-control',
      'select',
      'switch',
      'text-area',
      'text-input',
    ],
  },
  { name: 'Overlays', modules: ['confirm-modal', 'menu', 'modal', 'popover'] },
  { name: 'Data display', modules: ['chip', 'code-block', 'meta-line', 'table'] },
  {
    name: 'Feedback',
    modules: ['alert', 'empty-state', 'error-message', 'progress-indicator', 'spinner', 'toast'],
  },
  { name: 'Foundations', modules: ['icon', 'theme', 'theme-setting'] },
  {
    name: 'Hooks',
    modules: ['use-is-standalone', 'use-minimize-on-scroll', 'use-modal', 'use-pull-to-refresh'],
  },
]);

/** The section names, in display order. */
export const CATEGORIES = Object.freeze(SECTIONS.map((s) => s.name));

/**
 * Every module slug in display order, with its section and, for a nested one,
 * its parent's slug.
 * @returns {{ slug: string, category: string, parent?: string }[]}
 */
export const moduleOrder = () =>
  SECTIONS.flatMap(({ name, modules }) =>
    modules.flatMap((m) =>
      typeof m === 'string'
        ? [{ slug: m, category: name }]
        : [
            { slug: m[0], category: name },
            ...m[1].map((child) => ({ slug: child, category: name, parent: m[0] })),
          ]
    )
  );
