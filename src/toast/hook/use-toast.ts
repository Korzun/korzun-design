import { use } from 'react';

import { Context } from '../context.js';

export const useToast = (): ((message: string, type: 'success' | 'error' | 'info') => void) => {
  const { showToast } = use(Context);
  return showToast;
};
