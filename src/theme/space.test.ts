import { describe, expect, it } from 'vitest';

import type { PopoverGap } from '../control/popover/index.js';
import { lightTheme } from './theme.js';
import type { SpaceValue } from './theme.js';

const gap: PopoverGap = lightTheme.space.sm;
const value: SpaceValue = '0.5rem';
// @ts-expect-error px is not a space value
const wrong: SpaceValue = '8px';

describe('SpaceValue', () => {
  it('lets theme.space values be used as a Popover gap without a cast', () => {
    expect([gap, value, wrong]).toHaveLength(3);
  });
  it('types every space value as a rem string', () => {
    for (const v of Object.values(lightTheme.space)) expect(v).toMatch(/^\d*\.?\d+rem$/);
  });
});
