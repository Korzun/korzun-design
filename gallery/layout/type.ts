/**
 * The site's type scale beyond the library's `Heading` and `Text` defaults,
 * shared so pages, markdown and parts agree:
 * - Headings: h2 `fontSize.xl` bold with `space.xxxxxl` above and `space.xl`
 *   below, h3 `fontSize.lg` semibold with `space.xxxl` above and `space.md`
 *   below, in markdown and in page templates alike.
 * - Prose lines stop at `PROSE_WIDTH` (about 70 characters of body text);
 *   tables and code blocks keep the column's full width.
 * - Code takes the library's look: `CodeBlock` and `Code`, or
 *   `theme.recipe.codeBlock` and `theme.recipe.inlineCode` on rendered markdown.
 */
export const PROSE_WIDTH = '45rem';

/**
 * A code block that scrolls sideways fades out at its right edge while more
 * of it is hidden there (`useScrollHint` sets `data-scroll-more`): phones
 * hide scrollbars, and a cut-off line otherwise reads as truncated.
 */
export const scrollHint = {
  '&[data-scroll-more]': {
    maskImage: 'linear-gradient(to left, transparent, #000 3rem)',
    WebkitMaskImage: 'linear-gradient(to left, transparent, #000 3rem)',
  },
};
