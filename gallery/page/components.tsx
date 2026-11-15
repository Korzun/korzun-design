import {
  Card,
  CardDivider,
  CardRow,
  CollapsibleSection,
  EmptyState,
  MetaLine,
  MetadataList,
  NavDesktop,
  NavMobile,
  Page,
  ProgressIndicator,
  Tag,
  ThemeSetting,
  TopFade,
  type NavItem,
} from '@korzun/design/component';
import { BookIcon, HomeIcon, SettingsIcon } from '@korzun/design/icon';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState, type ReactNode } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  section: { display: 'flex', flexDirection: 'column', gap: theme.space.xl, marginBottom: '2rem' },
  heading: { margin: 0, fontSize: theme.fontSize.xl },
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: theme.space.xl },
  caption: { margin: 0, fontSize: theme.fontSize.sm, color: theme.color.text.muted },
  frames: { display: 'flex', flexWrap: 'wrap', gap: theme.space.xxxl },
  // The `transform` makes the frame the containing block for `position: fixed`
  // descendants, so the mobile nav sits inside it rather than the viewport.
  frame: {
    width: 390,
    height: 500,
    overflow: 'auto',
    transform: 'translateZ(0)',
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.bg.page,
  },
  navFrame: {
    position: 'relative',
    width: 390,
    height: 200,
    overflow: 'hidden',
    transform: 'translateZ(0)',
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.lg,
  },
}));

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  const styles = useStyle();
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      {children}
    </section>
  );
};

const NAV_ITEMS: NavItem[] = [
  { to: '/components', label: 'Home', Icon: HomeIcon, active: true },
  { to: '/controls', label: 'Books', Icon: BookIcon, active: false, badge: 3 },
  { to: '/tokens', label: 'Settings', Icon: SettingsIcon, active: false, badge: 'dot' },
];

export function ComponentsPage() {
  const styles = useStyle();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h1>Components</h1>

      <Section title="Card">
        <Card title="Card title" subTitle="Subtitle" footer="Footer">
          <CardRow>First row</CardRow>
          <CardDivider />
          <CardRow onClick={() => {}}>Clickable row</CardRow>
          <CardDivider>Labelled divider</CardDivider>
          <CardRow>Last row</CardRow>
        </Card>
        <Card title="Collapsible card" isCollapsible defaultCollapsed>
          <CardRow>Hidden until expanded</CardRow>
        </Card>
        <Card title="Small card" size="small">
          <CardRow>Small</CardRow>
        </Card>
      </Section>

      <Section title="CardDivider">
        <Card>
          <CardDivider />
          <CardDivider align="center">Center</CardDivider>
          <CardDivider align="right" actions={<Tag size="sm">action</Tag>}>
            Right with actions
          </CardDivider>
        </Card>
      </Section>

      <Section title="CardRow">
        <Card>
          <CardRow>Plain row</CardRow>
          <CardRow onClick={() => {}}>Clickable row</CardRow>
        </Card>
      </Section>

      <Section title="CollapsibleSection">
        <CollapsibleSection title="Uncontrolled" subTitle="Click to toggle">
          Section body
        </CollapsibleSection>
        <CollapsibleSection title="Controlled" open={open} onOpenToggle={() => setOpen((o) => !o)}>
          Controlled body
        </CollapsibleSection>
      </Section>

      <Section title="EmptyState">
        <EmptyState title="Nothing here">Try adding something.</EmptyState>
        <EmptyState title="Something went wrong" danger>
          Details of the error.
        </EmptyState>
      </Section>

      <Section title="MetaLine">
        <MetaLine items={['Author', '2024', null, '320 pages']} />
      </Section>

      <Section title="MetadataList">
        <MetadataList
          metadata={[
            { title: 'Title', value: 'A Book' },
            { title: 'Status', value: <Tag size="sm">Reading</Tag> },
          ]}
        />
      </Section>

      <Section title="Tag">
        <div className={styles.row}>
          <Tag>Medium</Tag>
          <Tag size="sm">Small</Tag>
          <Tag onClick={() => {}}>Clickable</Tag>
        </div>
      </Section>

      <Section title="ProgressIndicator">
        <div className={styles.row}>
          {[0.1, 0.25, 0.5, 0.75, 0.95].map((v) => (
            <ProgressIndicator key={v} value={v} ariaLabel={`${v * 100}%`} size={48} />
          ))}
        </div>
      </Section>

      <Section title="NavDesktop">
        <NavDesktop items={NAV_ITEMS} />
      </Section>

      <Section title="NavMobile">
        <p className={styles.caption}>
          Fixed-position capsule, contained here by a transformed frame.
        </p>
        <div className={styles.navFrame}>
          <NavMobile
            main={{ items: NAV_ITEMS, collapsed: NAV_ITEMS[0]! }}
            settings={{ items: NAV_ITEMS.slice(1), collapsed: NAV_ITEMS[2]! }}
            expanded="main"
          />
        </div>
      </Section>

      <Section title="Page">
        <p className={styles.caption}>
          The mobile padding difference (bottomNav clearance) shows at mobile widths; resize the
          window below 640px to see it.
        </p>
        <div className={styles.frames}>
          <div className={styles.frame}>
            <Page
              type="default"
              bottomNav
              back="/components"
              headerActions={[{ label: 'Action', onClick: () => {} }]}
              documentTitle="Page with bottomNav"
            >
              <Card title="With bottomNav">
                <CardRow>Page body</CardRow>
              </Card>
            </Page>
          </div>
          <div className={styles.frame}>
            <Page type="default">
              <Card title="Without bottomNav">
                <CardRow>Page body</CardRow>
              </Card>
            </Page>
          </div>
        </div>
      </Section>

      <Section title="ThemeSetting">
        <p className={styles.caption}>Also rendered at the top of every page by the shell.</p>
        <ThemeSetting />
      </Section>

      <Section title="TopFade">
        <p className={styles.caption}>
          A fixed, aria-hidden frosted band at the top of the viewport (visible here as a blur
          strip).
        </p>
        <TopFade />
      </Section>
    </div>
  );
}
