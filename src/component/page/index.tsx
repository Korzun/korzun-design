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
  /** The screen's content, usually one `Card` per feature. Direct children get the column gap. */
  children?: React.ReactNode;
  /**
   * `'minimal'` drops all layout styles (no width, margin, padding or gap) and the header row,
   * for a screen with no chrome such as a sign-in.
   * @default 'default'
   */
  type?: PageTypeValue;
  /**
   * Route path for the back button, which shows on mobile only. It navigates to the path with
   * `state: { restoreScroll: true }` (a new history entry); needs a react-router router above the
   * page.
   */
  back?: string;
  /**
   * Page-level actions (type from `@korzun/design/control`). On desktop `primary` items are
   * buttons and the rest sit in a "More…" menu; on mobile all of them sit in a floating menu next
   * to the back button.
   */
  headerActions?: PageActionItem[];
  /**
   * Label of the desktop overflow trigger, e.g. "Actions" when every action lives in the menu.
   * @default 'More…'
   */
  actionsLabel?: string;
  /**
   * Content for the header row, leading the desktop actions bar in the same row; ignored on
   * `minimal`. See [Header slot](#header-slot).
   */
  header?: React.ReactNode;
  /**
   * Buttons in a row after the children (type from `@korzun/design/control`), rendered as a
   * `PageFooterActions` row. Not sticky.
   */
  footerActions?: FooterAction[];
  /**
   * Sets `document.title` when given. The title is not restored on unmount, so leave it out when
   * the app manages the title itself.
   */
  documentTitle?: string;
  /** Mobile only: reserves space under the content for a floating `NavMobile`. */
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
