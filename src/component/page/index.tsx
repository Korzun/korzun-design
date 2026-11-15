import cx from 'classnames';
import { PropsWithChildren, useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { BackButton } from '../../control/back-button';
import { PageActionsBar } from '../../control/page-actions-bar';
import { PageActionsMenu, type PageActionItem } from '../../control/page-actions-menu';
import { PageFooterActions, type FooterAction } from '../../control/page-footer-actions';
import { useStyle, PageType, PageTypeValue } from './style';

type PageProps = PropsWithChildren<{
  type?: PageTypeValue;
  back?: string;
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
  footerActions?: FooterAction[];
  /** Sets `document.title` while the page is mounted. Leave it out when the app
   * manages the title itself. */
  documentTitle?: string;
  /** Reserve space under the content for a floating bottom navigation bar
   * (`NavMobile`) on mobile. Default `false`. */
  bottomNav?: boolean;
}>;

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
      </main>
    </Fragment>
  );
};
