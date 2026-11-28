import { describe, expect, it } from 'vitest';

import { defaultTheme, lightTheme, darkTheme } from './theme.js';

describe('defaultTheme glass tokens', () => {
  it('exposes a full-capsule pill radius', () => {
    expect(defaultTheme.radius.pill).toBe('999px');
  });

  it('derives the translucent glass fill from white', () => {
    expect(defaultTheme.color.bg.glass).toBe('rgba(255, 255, 255, 0.6)');
    expect(defaultTheme.color.bg.glassFallback).toBe('rgba(255, 255, 255, 0.92)');
  });

  it('defines an easing for the highlight slide', () => {
    expect(defaultTheme.transition.spring).toBe('0.35s cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('builds recipe.glass from the glass tokens (no hardcoded values)', () => {
    const glass = defaultTheme.recipe.glass;
    expect(glass.backgroundColor).toBe(defaultTheme.color.bg.glass);
    expect(glass.borderColor).toBe(defaultTheme.color.border.glass);
    expect(glass.boxShadow).toBe(defaultTheme.shadow.glass);
    expect(glass.backdropFilter).toBe('blur(20px) saturate(180%)');
    expect(glass['-webkit-backdrop-filter']).toBe('blur(20px) saturate(180%)');
  });

  it('builds recipe.glassHighlight (the active-tab lens) from the active-glass tokens', () => {
    const lens = defaultTheme.recipe.glassHighlight;
    expect(lens.backgroundColor).toBe(defaultTheme.color.bg.glassActive);
    expect(lens.borderColor).toBe(defaultTheme.color.border.glassActive);
    expect(lens.boxShadow).toBe(defaultTheme.shadow.glassActive);
  });
});

describe('semantic tokens replacing raw-scale refs (light)', () => {
  it('border.faint equals gray[500]', () => {
    expect(defaultTheme.color.border.faint).toBe(defaultTheme.color.gray[500]);
  });
  it('brand.linkHover equals blue[300]', () => {
    expect(defaultTheme.color.brand.linkHover).toBe(defaultTheme.color.blue[300]);
  });
  it('bg.selected equals blue[100]', () => {
    expect(defaultTheme.color.bg.selected).toBe(defaultTheme.color.blue[100]);
  });
});

describe('new semantic tokens — light values are byte-identical to replaced literals', () => {
  it('bg.hover light is a translucent scrim, not an opaque grey', () => {
    // Deliberately no longer the old '#f0f0f0' literal: an opaque grey lighter
    // than the modal footer it sits on (gray[100]) made a text button's hover
    // invisible there. A scrim darkens whatever surface it lands on.
    expect(lightTheme.color.bg.hover).toBe('rgba(0, 0, 0, 0.07)');
  });
  it('bg.success light equals #f0fdf4', () => {
    expect(lightTheme.color.bg.success).toBe('#f0fdf4');
  });
  it('bg.placeholder light equals #d1d5db', () => {
    expect(lightTheme.color.bg.placeholder).toBe('#d1d5db');
  });
  it('border.loading light equals #e6e6e6', () => {
    expect(lightTheme.color.border.loading).toBe('#e6e6e6');
  });
  it('border.success light equals #bbf7d0', () => {
    expect(lightTheme.color.border.success).toBe('#bbf7d0');
  });
  it('border.section light equals #E6E6E9', () => {
    expect(lightTheme.color.border.section).toBe('#E6E6E9');
  });
  it('text.description light equals #585863', () => {
    expect(lightTheme.color.text.description).toBe('#585863');
  });
  it('chip.book light values match replaced literals', () => {
    expect(lightTheme.color.chip.book.text).toBe('#0e6b7d');
    expect(lightTheme.color.chip.book.bg).toBe('rgba(14, 107, 125, 0.08)');
    expect(lightTheme.color.chip.book.border).toBe('rgba(14, 107, 125, 0.22)');
  });
  it('chip.entryType light values match replaced literals', () => {
    expect(lightTheme.color.chip.entryType.text).toBe('#c0415e');
    expect(lightTheme.color.chip.entryType.bg).toBe('rgba(192, 65, 94, 0.08)');
    expect(lightTheme.color.chip.entryType.border).toBe('rgba(192, 65, 94, 0.22)');
  });
  it('chip.user light values are a distinct plum, off subject', () => {
    expect(lightTheme.color.chip.user.text).toBe('#a23a95');
    expect(lightTheme.color.chip.user.bg).toBe('rgba(162,58,149,0.08)');
    expect(lightTheme.color.chip.user.border).toBe('rgba(162,58,149,0.22)');
    expect(lightTheme.color.chip.user.text).not.toBe(lightTheme.color.chip.subject.text);
  });
});

describe('new semantic tokens — dark values exist and differ from light', () => {
  it('bg.hover dark differs from light', () => {
    expect(darkTheme.color.bg.hover).toBeDefined();
    expect(darkTheme.color.bg.hover).not.toBe(lightTheme.color.bg.hover);
  });
  it('bg.success dark differs from light', () => {
    expect(darkTheme.color.bg.success).toBeDefined();
    expect(darkTheme.color.bg.success).not.toBe(lightTheme.color.bg.success);
  });
  it('bg.placeholder dark differs from light', () => {
    expect(darkTheme.color.bg.placeholder).toBeDefined();
    expect(darkTheme.color.bg.placeholder).not.toBe(lightTheme.color.bg.placeholder);
  });
  it('border.loading dark differs from light', () => {
    expect(darkTheme.color.border.loading).toBeDefined();
    expect(darkTheme.color.border.loading).not.toBe(lightTheme.color.border.loading);
  });
  it('border.success dark differs from light', () => {
    expect(darkTheme.color.border.success).toBeDefined();
    expect(darkTheme.color.border.success).not.toBe(lightTheme.color.border.success);
  });
  it('border.section dark differs from light', () => {
    expect(darkTheme.color.border.section).toBeDefined();
    expect(darkTheme.color.border.section).not.toBe(lightTheme.color.border.section);
  });
  it('text.description dark differs from light', () => {
    expect(darkTheme.color.text.description).toBeDefined();
    expect(darkTheme.color.text.description).not.toBe(lightTheme.color.text.description);
  });
  it('chip.book dark differs from light', () => {
    expect(darkTheme.color.chip.book.text).not.toBe(lightTheme.color.chip.book.text);
    expect(darkTheme.color.chip.book.bg).not.toBe(lightTheme.color.chip.book.bg);
    expect(darkTheme.color.chip.book.border).not.toBe(lightTheme.color.chip.book.border);
  });
  it('chip.entryType dark differs from light', () => {
    expect(darkTheme.color.chip.entryType.text).not.toBe(lightTheme.color.chip.entryType.text);
    expect(darkTheme.color.chip.entryType.bg).not.toBe(lightTheme.color.chip.entryType.bg);
    expect(darkTheme.color.chip.entryType.border).not.toBe(lightTheme.color.chip.entryType.border);
  });
  it('chip.neutral dark differs from light', () => {
    expect(darkTheme.color.chip.neutral.text).not.toBe(lightTheme.color.chip.neutral.text);
    expect(darkTheme.color.chip.neutral.bg).not.toBe(lightTheme.color.chip.neutral.bg);
    expect(darkTheme.color.chip.neutral.border).not.toBe(lightTheme.color.chip.neutral.border);
  });
  it('chip.neutral is a tint of each mode’s muted text colour, with stronger text', () => {
    expect(lightTheme.color.chip.neutral.bg).toBe('rgba(110, 110, 110, 0.08)');
    expect(lightTheme.color.chip.neutral.border).toBe('rgba(110, 110, 110, 0.22)');
    expect(lightTheme.color.chip.neutral.text).toBe('#5E5E5E');
    expect(darkTheme.color.chip.neutral.bg).toBe('rgba(156, 161, 171, 0.16)');
    expect(darkTheme.color.chip.neutral.text).toBe(darkTheme.color.text.description);
  });
  it('chip.user dark differs from light', () => {
    expect(darkTheme.color.chip.user.text).not.toBe(lightTheme.color.chip.user.text);
    expect(darkTheme.color.chip.user.bg).not.toBe(lightTheme.color.chip.user.bg);
    expect(darkTheme.color.chip.user.border).not.toBe(lightTheme.color.chip.user.border);
  });
});

// Relative luminance of a #rrggbb hex, 0 (black) – 1 (white).
const luminance = (hex: string): number => {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

describe('light/dark themes', () => {
  it('defaultTheme is the light theme', () => {
    expect(defaultTheme).toBe(lightTheme);
  });

  it('dark theme has a dark page and light primary text', () => {
    expect(luminance(darkTheme.color.bg.page)).toBeLessThan(0.2);
    expect(luminance(darkTheme.color.text.primary)).toBeGreaterThan(0.7);
  });

  it('light theme has a light page and dark primary text', () => {
    expect(luminance(lightTheme.color.bg.page)).toBeGreaterThan(0.9);
    expect(luminance(lightTheme.color.text.primary)).toBeLessThan(0.2);
  });

  it('carries colorScheme matching the mode', () => {
    expect(lightTheme.colorScheme).toBe('light');
    expect(darkTheme.colorScheme).toBe('dark');
  });

  it('shares identical structural tokens across modes', () => {
    expect(darkTheme.space).toEqual(lightTheme.space);
    expect(darkTheme.radius).toEqual(lightTheme.radius);
    expect(darkTheme.fontSize).toEqual(lightTheme.fontSize);
    expect(darkTheme.fontFamily).toEqual(lightTheme.fontFamily);
    expect(darkTheme.fontWeight).toEqual(lightTheme.fontWeight);
    expect(darkTheme.lineHeight).toEqual(lightTheme.lineHeight);
    expect(darkTheme.transition).toEqual(lightTheme.transition);
    expect(darkTheme.zIndex).toEqual(lightTheme.zIndex);
    expect(darkTheme.breakpoint).toEqual(lightTheme.breakpoint);
  });
});

describe('bg.page flat noise-average (noise textures removed)', () => {
  it('dark bg.page is the flat charcoal average', () => {
    expect(darkTheme.color.bg.page).toBe('#242527');
  });
  it('light bg.page is the lightened off-white', () => {
    expect(lightTheme.color.bg.page).toBe('#F6F6F9');
  });
});

describe('bg.track separates the segmented-control track from what it sits on', () => {
  // The track is borderless by design (the lens carries the control's only
  // outlined edge), so its background is the ONLY thing separating it from the
  // surface beneath. `bg.cardHeader` used to serve here, which works in light
  // (gray[100] on a lighter page) but collapsed in dark, where cardHeader
  // (#232427) and page (#242527) are a single channel-step apart — the track
  // simply disappeared on the Add page.
  const channelDistance = (a: string, b: string) => {
    const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const [ca, cb] = [channels(a), channels(b)];
    return Math.max(...ca.map((value, i) => Math.abs(value - cb[i])));
  };

  it('reads against the page in dark mode', () => {
    expect(
      channelDistance(darkTheme.color.bg.track, darkTheme.color.bg.page)
    ).toBeGreaterThanOrEqual(6);
  });

  it('reads against the page in light mode', () => {
    expect(
      channelDistance(lightTheme.color.bg.track, lightTheme.color.bg.page)
    ).toBeGreaterThanOrEqual(6);
  });

  it('reads against a card body, where the Appearance copy of the control sits', () => {
    expect(
      channelDistance(darkTheme.color.bg.track, darkTheme.color.bg.card)
    ).toBeGreaterThanOrEqual(6);
    expect(
      channelDistance(lightTheme.color.bg.track, lightTheme.color.bg.card)
    ).toBeGreaterThanOrEqual(6);
  });

  it('holds the lens apart from the track in both modes', () => {
    expect(
      channelDistance(darkTheme.color.bg.track, darkTheme.color.bg.input)
    ).toBeGreaterThanOrEqual(6);
    expect(
      channelDistance(lightTheme.color.bg.track, lightTheme.color.bg.input)
    ).toBeGreaterThanOrEqual(6);
  });

  it('leaves light mode exactly as it rendered before', () => {
    expect(lightTheme.color.bg.track).toBe(lightTheme.color.gray[100]);
  });
});

// WCAG 2 relative luminance (gamma-decoded, unlike `luminance` above).
const relativeLuminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// WCAG 2 contrast ratio of two opaque hex colours.
const contrast = (a: string, b: string) => {
  const [x, y] = [relativeLuminance(a), relativeLuminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// An `rgba(r, g, b, a)` or hex colour laid over an opaque hex surface, as hex.
const over = (color: string, surface: string) => {
  const [r, g, b, a = 1] = color.startsWith('#')
    ? [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16))
    : color.match(/[\d.]+/g)!.map(Number);
  return `#${[r, g, b]
    .map((c, i) => {
      const under = parseInt(surface.slice(1 + i * 2, 3 + i * 2), 16);
      return Math.round(c! * a + under * (1 - a))
        .toString(16)
        .padStart(2, '0');
    })
    .join('')}`;
};

describe('chip.neutral text (4.5:1) on its own tint over every surface', () => {
  it.each([
    ['light', lightTheme],
    ['dark', darkTheme],
  ] as const)('%s mode', (_mode, theme) => {
    const chip = theme.color.chip.neutral;
    for (const surface of ['page', 'card', 'cardHeader'] as const) {
      const fill = over(chip.bg, theme.color.bg[surface]);
      expect(contrast(chip.text, fill), surface).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('border.light, the hairline divider', () => {
  it('in dark mode is a visible step on page and card, at least light mode’s', () => {
    const step = (theme: typeof lightTheme, surface: 'page' | 'card') =>
      contrast(theme.color.border.light, theme.color.bg[surface]);
    expect(darkTheme.color.border.light).toBe('#333439');
    expect(step(darkTheme, 'page')).toBeGreaterThanOrEqual(step(lightTheme, 'page'));
    expect(step(darkTheme, 'card')).toBeGreaterThanOrEqual(step(lightTheme, 'card'));
    expect(step(darkTheme, 'page')).toBeLessThan(
      contrast(darkTheme.color.border.default, darkTheme.color.bg.page)
    );
  });
});

describe('non-text contrast (3:1) on every surface', () => {
  const surfaces = ['page', 'card', 'cardHeader'] as const;

  it.each([
    ['light', lightTheme],
    ['dark', darkTheme],
  ] as const)('bg.switchOff, the unchecked Switch track, in %s mode', (_mode, theme) => {
    for (const surface of surfaces) {
      expect(contrast(theme.color.bg.switchOff, theme.color.bg[surface])).toBeGreaterThanOrEqual(3);
    }
  });

  it.each([
    ['light', lightTheme],
    ['dark', darkTheme],
  ] as const)('border.focus, the text/link Button focus ring, in %s mode', (_mode, theme) => {
    for (const surface of [...surfaces, 'footer', 'input'] as const) {
      expect(contrast(theme.color.border.focus, theme.color.bg[surface])).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('recipe.row', () => {
  it('is the shaded field row: cardHeader fill, md corners, md/lg/md/sm padding', () => {
    for (const theme of [lightTheme, darkTheme]) {
      expect(theme.recipe.row).toEqual({
        backgroundColor: theme.color.bg.cardHeader,
        borderRadius: theme.radius.md,
        padding: `${theme.space.md} ${theme.space.lg} ${theme.space.md} ${theme.space.sm}`,
      });
    }
  });
});

describe('status tones', () => {
  it('every chip has text, bg and border in both modes', () => {
    for (const theme of [lightTheme, darkTheme]) {
      for (const [tone, chip] of Object.entries(theme.color.chip)) {
        expect(Object.keys(chip).sort(), tone).toEqual(['bg', 'border', 'text']);
        expect(chip.text && chip.bg && chip.border, tone).toBeTruthy();
      }
    }
  });
  it('has the four status chips', () => {
    for (const theme of [lightTheme, darkTheme]) {
      expect(Object.keys(theme.color.chip)).toEqual(
        expect.arrayContaining(['success', 'warning', 'danger', 'info'])
      );
    }
  });
  it('warning chip uses the picked yellow', () => {
    expect(lightTheme.color.chip.warning).toEqual({
      text: '#854d0e',
      bg: 'rgba(234,179,8,0.16)',
      border: 'rgba(202,138,4,0.40)',
    });
    expect(darkTheme.color.chip.warning).toEqual({
      text: '#FDE047',
      bg: 'rgba(234,179,8,0.20)',
      border: 'rgba(234,179,8,0.42)',
    });
  });
  it('info chip is built from brand blue', () => {
    expect(lightTheme.color.chip.info.text).toBe(lightTheme.color.blue[700]);
    expect(darkTheme.color.chip.info.text).toBe(darkTheme.color.blue[300]);
  });
  it('success and danger chips derive from the theme colours', () => {
    expect(lightTheme.color.chip.success.text).toBe('#15803d');
    expect(darkTheme.color.chip.success.text).toBe('#86EFAC');
    expect(lightTheme.color.chip.danger.text).toBe(lightTheme.color.red[700]);
    expect(darkTheme.color.chip.danger.text).toBe(darkTheme.color.red[400]);
  });
  it('solid warning and info colours', () => {
    expect(lightTheme.color.warning).toBe('#ca8a04');
    expect(darkTheme.color.warning).toBe('#EAB308');
    expect(lightTheme.color.info).toBe(lightTheme.color.brand.default);
    expect(darkTheme.color.info).toBe(darkTheme.color.brand.default);
  });
});

describe('fontWeight.regular token', () => {
  it('has a regular font weight of 400', () => {
    expect(lightTheme.fontWeight.regular).toBe(400);
    expect(darkTheme.fontWeight.regular).toBe(400);
  });
});

describe('layout.formWidth', () => {
  it('is 400px, narrower than a dialog, in both themes', () => {
    expect(lightTheme.layout.formWidth).toBe('400px');
    expect(darkTheme.layout.formWidth).toBe('400px');
  });
});

describe('code styles', () => {
  it('code palette maps to the highlight colours', () => {
    for (const t of [lightTheme, darkTheme]) {
      const { chip, text, brand } = t.color;
      expect(t.color.code).toEqual({
        foreground: text.primary,
        keyword: chip.status.text,
        string: chip.author.text,
        function: chip.series.text,
        parameter: chip.subject.text,
        constant: chip.entryType.text,
        punctuation: text.secondary,
        comment: text.muted,
        link: brand.default,
      });
    }
  });

  it('recipe.codeBlock is the in-surface code box', () => {
    for (const t of [lightTheme, darkTheme]) {
      expect(t.recipe.codeBlock).toMatchObject({
        margin: 0,
        padding: t.space.xl,
        overflowX: 'auto',
        fontFamily: t.fontFamily.mono,
        fontSize: t.fontSize.md,
        lineHeight: 1.5,
        borderRadius: t.radius.md,
        backgroundColor: t.color.bg.cardHeader,
      });
    }
  });

  it('recipe.inlineCode is the code span', () => {
    for (const t of [lightTheme, darkTheme]) {
      expect(t.recipe.inlineCode).toMatchObject({
        fontFamily: t.fontFamily.mono,
        fontSize: '0.875em',
        padding: `0 ${t.space.xxs}`,
        borderRadius: t.radius.sm,
        backgroundColor: t.color.bg.cardHeader,
        overflowWrap: 'break-word',
      });
    }
  });

  it('recipe.codeColours is the --code-* variable map from color.code', () => {
    for (const t of [lightTheme, darkTheme]) {
      const c = t.color.code;
      expect(t.recipe.codeColours).toEqual({
        '--code-foreground': c.foreground,
        '--code-token-keyword': c.keyword,
        '--code-token-string': c.string,
        '--code-token-string-expression': c.string,
        '--code-token-function': c.function,
        '--code-token-parameter': c.parameter,
        '--code-token-constant': c.constant,
        '--code-token-punctuation': c.punctuation,
        '--code-token-comment': c.comment,
        '--code-token-link': c.link,
      });
    }
  });
});
