import { createUseStyles, type Theme } from '../../theme/index.js';
import { applyTransparency } from '../../utils.js';

// A small handful of literals stay un-tokenized in this file by design:
//   '#FFF'    — focus-ring border on colored backgrounds (intentional white-on-color)
//   '0.5em'   — gap that scales with the button's own font-size, not the rem scale
//   '0.80rem' — button-specific font-size, off the global fontSize scale

export type ButtonTypeValue = 'default' | 'primary' | 'text' | 'link' | 'dashed';
export enum ButtonType {
  Default = 'default',
  Primary = 'primary',
  Text = 'text',
  Link = 'link',
  Dashed = 'dashed',
}

export type ButtonRadiusValue = 'background' | 'card' | 'inset' | 'modal';
export enum ButtonRadius {
  Background = 'background',
  Card = 'card',
  Inset = 'inset',
  Modal = 'modal',
}

export type StyleProps = {
  type: ButtonType;
  radius?: ButtonRadius;
};

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    gap: '0.5em',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.color.text.primary,
    ...theme.recipe.focusRing,
    // In submit mode the root is a native <button>, which the UA styles rather
    // than inheriting from the page: it gets its own font and a native chrome
    // (ButtonFace background, system border). Reset all three so a submit button
    // is pixel-identical to the div the component renders otherwise. The
    // transparent background is only a floor — every `type` below is declared
    // later in this sheet, so any type that paints a background still wins.
    fontFamily: theme.fontFamily.body,
    backgroundColor: 'transparent',
    appearance: 'none',
    '-webkit-appearance': 'none',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: `${theme.space.md} ${theme.space.xxl}`,
    cursor: 'pointer',
    fontSize: '0.80rem', // button-specific size; not on the global fontSize scale
    // Pinned, so the height does not follow an inherited line-height: a Modal
    // sets 1.3 for its prose, which made footer buttons 35px. 0.875rem is the
    // 14px the UA's `normal` gave at this size, so a text button stays
    // 1px + 8px + 14px + 8px + 1px = 32px.
    lineHeight: '0.875rem',
    // An icon-only button has no line box, only its 1em (12.8px) icon, and
    // came out 31px beside 32px siblings. The floor makes it the same height.
    // The `link` variant drops it: it is text-sized, with no padding to match.
    boxSizing: 'border-box',
    minHeight: '2rem',
    userSelect: 'none',
    '-webkit-user-select': 'none',
    '-webkit-tap-highlight-color': 'transparent',
    touchAction: 'manipulation',
    transitionProperty: 'color, background-color',
    transitionDuration: '0.1s',
    transitionTimingFunction: 'ease-in',
    '&:hover, &:focus, &:active': { transitionDuration: '0s' },
  },

  [ButtonRadius.Background]: {
    borderRadius: theme.radius.lg,
  },
  [ButtonRadius.Card]: {
    borderRadius: theme.radius.md,
  },
  [ButtonRadius.Inset]: {
    borderRadius: theme.radius.sm,
  },
  [ButtonRadius.Modal]: {
    borderRadius: theme.radius.md,
  },

  [ButtonType.Default]: {
    backgroundColor: theme.color.bg.input,
    borderColor: theme.color.border.default,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: theme.shadow.cardStack,
    color: theme.color.text.primary,
    '&:focus': {
      borderColor: '#FFF',
      outlineColor: theme.color.brand.outline,
      boxShadow: `0px 2px 0px transparent`,
    },
    '&:hover': {
      borderColor: theme.color.brand.hover,
      color: theme.color.brand.hover,
      outlineColor: 'transparent',
    },
    '&:active': {
      borderColor: theme.color.brand.active,
      color: theme.color.brand.active,
    },
    '&$disabled': {
      cursor: 'not-allowed',
      filter: 'saturate(0)',
      '&:hover': {
        borderColor: theme.color.border.default,
        color: theme.color.text.primary,
        outlineColor: 'transparent',
      },
    },
    '&$loading': {
      cursor: 'default',
      borderColor: theme.color.border.loading,
      color: theme.color.text.muted,
      boxShadow: `0px 2px 0px transparent`,
      outlineColor: 'transparent',
      '&:focus': { borderColor: theme.color.border.loading, color: theme.color.text.muted },
      '&:hover': { borderColor: theme.color.brand.linkHover, color: theme.color.brand.linkHover },
      '&:active': {
        borderColor: theme.color.brand.loadingActive,
        color: theme.color.brand.loadingActive,
      },
      '&$disabled': { cursor: 'not-allowed', filter: 'saturate(0)' },
    },
    '&$danger': {
      color: theme.color.danger.default,
      borderColor: theme.color.danger.default,
      boxShadow: theme.shadow.dangerStack,
      '&:focus': {
        color: theme.color.danger.hover,
        borderColor: '#FFF',
        outlineColor: theme.color.danger.outline,
        boxShadow: `0px 2px 0px transparent`,
      },
      '&:hover': {
        color: applyTransparency(theme.color.danger.hover, 0.67),
        borderColor: applyTransparency(theme.color.danger.hover, 0.67),
        outlineColor: 'transparent',
      },
      '&:active': {
        color: theme.color.danger.active,
        borderColor: theme.color.danger.active,
      },
      '&$loading': {
        cursor: 'default',
        borderColor: theme.color.danger.hover,
        color: theme.color.danger.hover,
        outlineColor: 'transparent',
        boxShadow: `0px 2px 0px transparent`,
        '&:focus': { borderColor: theme.color.danger.hover, color: theme.color.danger.hover },
        '&:hover': {
          borderColor: theme.color.danger.loadingHover,
          color: theme.color.danger.loadingHover,
        },
        '&:active': {
          borderColor: theme.color.danger.loadingActive,
          color: theme.color.danger.loadingActive,
        },
      },
      '&$disabled': { cursor: 'not-allowed', filter: 'saturate(0)' },
    },
  },

  [ButtonType.Dashed]: {
    backgroundColor: theme.color.bg.input,
    borderColor: theme.color.border.default,
    borderStyle: 'dashed',
    borderWidth: '1px',
    color: theme.color.text.primary,
    '&:focus': {
      borderColor: '#FFF',
      outlineColor: theme.color.brand.outline,
    },
    '&:hover': {
      borderColor: theme.color.brand.hover,
      color: theme.color.brand.hover,
      outlineColor: 'transparent',
    },
    '&:active': {
      borderColor: theme.color.brand.active,
      color: theme.color.brand.active,
    },
    '&$disabled': {
      cursor: 'not-allowed',
      filter: 'saturate(0)',
      '&:hover': {
        borderColor: theme.color.border.default,
        color: theme.color.text.primary,
        outlineColor: 'transparent',
      },
    },
    '&$loading': {
      cursor: 'default',
      borderColor: theme.color.border.loading,
      color: theme.color.text.muted,
      outlineColor: 'transparent',
      '&:focus': { borderColor: theme.color.border.loading, color: theme.color.text.muted },
      '&:hover': { borderColor: theme.color.brand.linkHover, color: theme.color.brand.linkHover },
      '&:active': {
        borderColor: theme.color.brand.loadingActive,
        color: theme.color.brand.loadingActive,
      },
      '&$disabled': { cursor: 'not-allowed', filter: 'saturate(0)' },
    },
    '&$danger': {
      color: theme.color.danger.default,
      borderColor: theme.color.danger.default,
      '&:focus': {
        color: theme.color.danger.hover,
        borderColor: '#FFF',
        outlineColor: theme.color.danger.outline,
      },
      '&:hover': {
        color: applyTransparency(theme.color.danger.hover, 0.67),
        borderColor: applyTransparency(theme.color.danger.hover, 0.67),
        outlineColor: 'transparent',
      },
      '&:active': {
        color: theme.color.danger.active,
        borderColor: theme.color.danger.active,
      },
      '&$loading': {
        cursor: 'default',
        borderColor: theme.color.danger.hover,
        color: theme.color.danger.hover,
        outlineColor: 'transparent',
        '&:focus': { borderColor: theme.color.danger.hover, color: theme.color.danger.hover },
        '&:hover': {
          borderColor: theme.color.danger.loadingHover,
          color: theme.color.danger.loadingHover,
        },
        '&:active': {
          borderColor: theme.color.danger.loadingActive,
          color: theme.color.danger.loadingActive,
        },
      },
      '&$disabled': { cursor: 'not-allowed', filter: 'saturate(0)' },
    },
  },

  [ButtonType.Primary]: {
    backgroundColor: theme.color.brand.default,
    boxShadow: theme.shadow.brandStack,
    color: theme.color.text.onPrimary,
    '&:focus': {
      backgroundColor: theme.color.brand.hover,
      borderColor: '#FFFFFF',
      outlineColor: applyTransparency(theme.color.brand.hover, 0.5),
      boxShadow: `0px 2px 0px transparent`,
    },
    '&:hover': {
      backgroundColor: theme.color.brand.hover,
      outlineColor: 'transparent',
      borderColor: 'transparent',
    },
    '&:active': {
      backgroundColor: theme.color.brand.active,
      outlineColor: 'transparent',
      borderColor: 'transparent',
    },
    '&$loading': {
      cursor: 'default',
      backgroundColor: theme.color.brand.loading,
      boxShadow: `0px 2px 0px transparent`,
      '&:focus': { outlineColor: 'transparent', borderColor: 'transparent' },
      '&:hover': { backgroundColor: theme.color.brand.loadingHover, outlineColor: 'transparent' },
      '&:active': { backgroundColor: theme.color.brand.loadingActive },
    },
    '&$disabled': { cursor: 'not-allowed', filter: 'saturate(0)' },
    '&$danger': {
      backgroundColor: theme.color.danger.default,
      boxShadow: theme.shadow.dangerStack,
      '&:focus': {
        backgroundColor: theme.color.danger.hover,
        borderColor: '#FFFFFF',
        outlineColor: theme.color.danger.outline,
        boxShadow: `0px 2px 0px transparent`,
      },
      '&:hover': {
        backgroundColor: theme.color.danger.hover,
        outlineColor: 'transparent',
        borderColor: 'transparent',
      },
      '&:active': {
        backgroundColor: theme.color.danger.active,
        outlineColor: 'transparent',
        borderColor: 'transparent',
      },
      '&$loading': {
        cursor: 'default',
        backgroundColor: theme.color.danger.loading,
        boxShadow: `0px 2px 0px transparent`,
        '&:hover': {
          backgroundColor: theme.color.danger.loadingHover,
          outlineColor: 'transparent',
        },
        '&:active': { backgroundColor: theme.color.danger.loadingActive },
        '&:focus': { outlineColor: 'transparent' },
      },
      '&$disabled': { cursor: 'not-allowed', filter: 'saturate(0)' },
    },
  },

  // `text` and `link` have no border to turn white and no tinted surface, so
  // the pale `brand.outline` halo the other variants use (1.7:1 on white)
  // would be their only cue. Keyboard focus gets a solid ring in
  // `border.focus`, the colour an input's border takes on focus, which meets
  // 3:1 on every surface in both themes. `:focus-visible` only, so a click
  // leaves no ring.
  [ButtonType.Text]: {
    cursor: 'pointer',
    '&:focus-visible': { outlineColor: theme.color.border.focus },
    '&:hover': { backgroundColor: theme.color.bg.hover },
    '&:active': { backgroundColor: theme.color.border.default },
    '&$disabled': {
      cursor: 'not-allowed',
      filter: 'saturate(0)',
      '&:hover': { backgroundColor: 'transparent' },
    },
    '&$loading': {
      cursor: 'default',
      color: theme.color.text.muted,
      '&:hover': { backgroundColor: theme.color.bg.hover },
    },
    '&$danger': {
      color: theme.color.danger.default,
      '&:hover': { backgroundColor: theme.color.danger.light },
      '&$loading': {
        cursor: 'default',
        color: theme.color.danger.hover,
        '&:hover': { backgroundColor: theme.color.danger.light },
      },
    },
  },

  [ButtonType.Link]: {
    cursor: 'pointer',
    display: 'inline',
    borderStyle: 'none',
    outlineStyle: 'none',
    padding: '0',
    minHeight: 0,
    color: theme.color.brand.default,
    '&:focus-visible': {
      outlineStyle: 'solid',
      outlineColor: theme.color.border.focus,
      // Clear of the glyphs, since the link has no padding of its own.
      outlineOffset: '2px',
    },
    '&:hover': { color: theme.color.brand.hover },
    '&:active': { color: theme.color.brand.active },
    // Inline, so the root's flex gap does not apply and an icon would sit on
    // the text baseline, high and touching the label. Centre it on the text
    // and space it with a margin of the same 0.5em instead.
    '& $buttonIcon, & $spinner': { verticalAlign: '-0.225em' },
    '& $lead': { marginRight: '0.5em' },
    '& $trail': { marginLeft: '0.5em' },
    '&$disabled': {
      cursor: 'default',
      color: theme.color.text.muted,
    },
    '&$loading': {
      cursor: 'default',
      color: theme.color.text.muted,
      '&:hover': { color: theme.color.brand.linkHover },
      '&:active': { color: theme.color.brand.loadingActive },
    },
    '&$danger': {
      color: theme.color.danger.default,
      '&:hover': { color: theme.color.danger.hover },
      '&:active': { color: theme.color.danger.active },
      '&$loading': {
        cursor: 'default',
        color: theme.color.danger.loading,
        '&:hover': { color: theme.color.danger.loadingHover },
        '&:active': { color: theme.color.danger.loadingActive },
      },
    },
  },

  buttonIcon: {
    height: '1em',
    width: '1em',
    flexShrink: 0,
  },
  danger: {},
  disabled: { opacity: 0.5 },
  loading: {},
  spinner: {
    ...theme.recipe.spinner,
  },
  lead: {},
  trail: {},
}));
