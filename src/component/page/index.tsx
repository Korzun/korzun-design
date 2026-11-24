import cx from 'classnames';
import { PropsWithChildren, useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { BackButton } from '../../control/back-button/index.js';
import { PageActionsBar } from '../../control/page-actions-bar/index.js';
import { PageActionsMenu, type PageActionItem } from '../../control/page-actions-menu/index.js';
import { PageFooterActions, type FooterAction } from '../../control/page-footer-actions/index.js';
import { SurfaceDepthProvider } from '../surface/index.js';
import { useStyle, PageType, PageTypeValue } from './style.js';

export type { PageTypeValue };

export type PageProps = PropsWithChildren<{
  /** `'default'` (default) or `'minimal'`, which drops all layout styles and the header row. */
  type?: PageTypeValue;
  /** Route path for the back button. **Mobile only**: there is no back button on desktop. */
  back?: string;
  /**
   * Page-level actions. Desktop: `primary` items as buttons, the rest in a "More…" menu.
   * Mobile: all in a floating menu.
   */
  headerActions?: PageActionItem[];
  /** Overrides the overflow trigger's label (default "More…") on the desktop
   * action bar — e.g. "Actions" when every action lives in the menu. */
  actionsLabel?: string;
  /**
   * The page's own chrome for the header row — the row the desktop actions bar
   * occupies, which every default page holds open whether or not it has
   * actions (see `style.ts`).
   *
   * `page/library` passes its `<SearchBar />` here rather than rendering it as
   * the first child: as a child it would sit BELOW the reserved row, starting
   * the one page anyone lands on first lower than every other page. In the
   * slot it lines up with every other page's actions instead.
   */
  header?: React.ReactNode;
  /** Sticky footer buttons. */
  footerActions?: FooterAction[];
  /** Sets `document.title` when given; the title is not restored on unmount. Leave it
   * out when the app manages the title itself. */
  documentTitle?: string;
  /** Reserve space under the content for a floating bottom navigation bar
   * (`NavMobile`) on mobile. Default `false`. */
  bottomNav?: boolean;
}>;

/** The `<main>` of every screen: a centred column of Cards, plus back button, header and footer actions. */
export const Page = ({
  children,
  type = PageType.default as PageTypeValue,
  back,
  headerActions,
  actionsLabel,
  header,
  footerActions,
  documentTitle,
  bottomNav = false,
}: PageProps) => {
  const styles = useStyle();

  useEffect(() => {
    if (documentTitle !== undefined) document.title = documentTitle;
  }, [documentTitle]);

  const hasHeaderActions = headerActions !== undefined && headerActions.length > 0;
  const hasControls = back !== undefined || hasHeaderActions;

  return (
    <Fragment>
      <main className={cx(styles[type], { [styles.bottomNav]: bottomNav })}>
        <SurfaceDepthProvider depth={0}>
          {hasControls && (
            <div className={styles.controlsRow}>
              {back !== undefined && <BackButton to={back} />}
              {hasHeaderActions && <PageActionsMenu items={headerActions} />}
            </div>
          )}
          {/* Rendered for every default page, EMPTY INCLUDED — holding the row
              open is what keeps pages with and without actions starting their
              content at the same height. A minimal page (login, loading, the
              forced password change) has no nav, no actions and nothing to line
              up with, so it gets no row. */}
          {type === PageType.default && (
            <header className={styles.headerRow}>
              {header}
              {hasHeaderActions && (
                <PageActionsBar items={headerActions} actionsLabel={actionsLabel} />
              )}
            </header>
          )}
          {children}
          {footerActions !== undefined && footerActions.length > 0 && (
            <PageFooterActions items={footerActions} />
          )}
        </SurfaceDepthProvider>
      </main>
    </Fragment>
  );
};
