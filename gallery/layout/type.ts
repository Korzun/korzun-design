import type { Theme } from '@korzun/design/theme';

/**
 * The site's type scale beyond the library's `Heading` and `Text` defaults,
 * shared so pages, markdown and parts agree:
 * - Headings: h2 `fontSize.xl` bold with `space.xxxxxl` above and `space.xl`
 *   below, h3 `fontSize.lg` semibold with `space.xxxl` above and `space.md`
 *   below, in markdown and in page templates alike.
 * - Prose lines stop at `PROSE_WIDTH` (about 70 characters of body text);
 *   tables and code blocks keep the column's full width.
 * - Code blocks are mono `fontSize.md` at `CODE_LINE_HEIGHT`; inline code is
 *   `INLINE_CODE_SIZE` of the text around it, so it scales with a heading.
 */
export const PROSE_WIDTH = '45rem';

/** Line height of a code block: looser than prose's `lineHeight.body`, so lines of code separate. */
export const CODE_LINE_HEIGHT = 1.5;

/** Inline code relative to the text it sits in. */
export const INLINE_CODE_SIZE = '0.875em';

/** A block of code (an example's source, a fenced block, the import line). */
export const codeBlock = (theme: Theme) => ({
  fontFamily: theme.fontFamily.mono,
  fontSize: theme.fontSize.md,
  lineHeight: CODE_LINE_HEIGHT,
});

/** A code span in running text. `break-word` breaks a long name only when it cannot fit a line. */
export const inlineCode = (theme: Theme) => ({
  fontFamily: theme.fontFamily.mono,
  fontSize: INLINE_CODE_SIZE,
  padding: `0 ${theme.space.xxs}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.color.bg.cardHeader,
  overflowWrap: 'break-word' as const,
});

/**
 * The edge of a code box on the page. In dark, `bg.cardHeader` is 1.01:1 on
 * `bg.page`, so the box draws a `border.default` hairline; inset, so the box
 * keeps light mode's size, where the fill alone is a visible step.
 */
export const pageCodeEdge = (theme: Theme) =>
  theme.colorScheme === 'dark'
    ? { boxShadow: `inset 0 0 0 1px ${theme.color.border.default}` }
    : {};
