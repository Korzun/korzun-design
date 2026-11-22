import { createContext } from 'react';

import type { ButtonRadiusValue } from './style.js';

/**
 * Internal: a surface (the Dialog footer) supplies the default `radius` for
 * Buttons inside it. An explicit `radius` prop always wins. Not exported from
 * any barrel.
 */
export const ButtonRadiusContext = createContext<ButtonRadiusValue | undefined>(undefined);
