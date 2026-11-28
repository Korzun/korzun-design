// The docs sections, in display order, each with its modules in order. A
// module is its doc's basename (`docs/control/text-input.md` is `text-input`).
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
      'stack',
      'inline',
      'divider',
      'surface',
      ['page', ['page-actions-bar', 'page-actions-menu', 'page-footer-actions']],
      ['card', ['card-row']],
      'collapsible-section',
      'top-fade',
    ],
  },
  { name: 'Navigation', modules: ['nav-desktop', 'nav-mobile', 'back-button'] },
  { name: 'Typography', modules: ['heading', 'text', 'code'] },
  {
    name: 'Inputs',
    modules: [
      'button',
      'text-input',
      'text-area',
      'number-input',
      'date-time-input',
      'chips-input',
      'select',
      'switch',
      'segmented-control',
      'field-list',
    ],
  },
  { name: 'Overlays', modules: ['popover', 'menu', 'modal', 'confirm-modal', 'use-modal'] },
  { name: 'Data display', modules: ['tag', 'meta-line', 'metadata-list', 'table'] },
  {
    name: 'Feedback',
    modules: ['alert', 'error-message', 'toast', 'empty-state', 'progress-indicator', 'spinner'],
  },
  { name: 'Foundations', modules: ['theme', 'theme-setting', 'icon'] },
  { name: 'Hooks', modules: ['hooks'] },
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
