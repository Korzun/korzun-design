import { Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { ReactNode } from 'react';

import { inlineCode, PROSE_WIDTH } from '../layout/type.js';

const useStyle = createUseStyles((theme: Theme) => ({
  // A step above body text (16px) and below an h2 (20px), so it reads as an introduction.
  lead: {
    '&&': { fontSize: '1.125rem', lineHeight: 1.5, maxWidth: PROSE_WIDTH },
    '& code': inlineCode(theme),
  },
}));

/** The introduction under a page's h1. */
export const Lead = ({ children }: { children: ReactNode }) => {
  const styles = useStyle();
  return (
    <Text as="p" tone="description" className={styles.lead}>
      {children}
    </Text>
  );
};
