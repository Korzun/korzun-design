import { CodeBlock, Heading, Space, Surface } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';
import { useEffect, useId, useRef, useState } from 'react';

import { anchor } from '../../scripts/docs-gen/slug.mjs';
import type { ExampleInfo } from '../../scripts/docs-gen/types.js';
import type { ExampleOwner } from '../data.js';
import { frameSrc, MOBILE_WIDTH, SCREEN_HEIGHT, useFrameTheme } from '../frame-url.js';
import { tapTarget } from '../layout/tap-target.js';
import { PROSE_WIDTH } from '../layout/type.js';
import { isHeightMessage } from '../messages.js';
import { CopyButton } from './copy-button.js';
import { highlight } from './highlight.js';
import { Markdown } from './markdown.js';

const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.bg.card,
    overflow: 'hidden',
  },
  demo: {
    borderBottom: `1px solid ${theme.color.border.light}`,
    backgroundColor: theme.color.bg.page,
  },
  // Until the frame reports its height, reserve room for a row of controls.
  frame: { display: 'block', width: '100%', border: 0, minHeight: theme.layout.controlHeight },
  // A `@viewport mobile` example lays out at phone width, centred, with its edges drawn.
  mobile: {
    width: `${MOBILE_WIDTH}px`,
    maxWidth: '100%',
    margin: '0 auto',
    borderLeft: `1px solid ${theme.color.border.light}`,
    borderRight: `1px solid ${theme.color.border.light}`,
    boxSizing: 'border-box',
  },
  // A frame's blank document paints white before the example loads; hide it till then.
  pending: { visibility: 'hidden' },
  meta: { padding: `${theme.space.xl} ${theme.space.xxl}` },
  // A long description stops at a readable line length.
  description: { maxWidth: PROSE_WIDTH },
  // The code sits flush at the card's bottom: square, ruled off from the meta above.
  code: {
    '&&': {
      borderRadius: 0,
      borderTop: `1px solid ${theme.color.border.light}`,
    },
  },
  // "Show code" is a text-height link: on a phone its hit area grows to 44px.
  toggle: tapTarget(theme),
}));

export type ExampleBlockProps = {
  /** The module or recipe the example belongs to. */
  owner: ExampleOwner;
  /** The example to show. */
  example: ExampleInfo;
  /** Id of the title heading. Default: the slug of the title, as the doc's `### <title>` has. */
  headingId?: string;
};

/** One example: its live demo in a frame sized to fit, title, description and copyable code. */
export const ExampleBlock = ({ owner, example, headingId }: ExampleBlockProps) => {
  const styles = useStyle();
  const [theme, onLoad] = useFrameTheme();
  const [height, setHeight] = useState<number | null>(null);
  // A full-height screen sizes itself to the frame, so the frame gets a fixed height.
  const fixedHeight = example.viewport === 'screen' ? SCREEN_HEIGHT : null;
  const [loaded, setLoaded] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  // The id the doc's `### <title>` heading has, so `#expanded-side` links land here too.
  const titleId = headingId ?? anchor(example.title);
  const codeId = useId();

  // The frame posts its content height; only this block's frame sizes it.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      const data: unknown = event.data;
      if (isHeightMessage(data) && fixedHeight === null) setHeight(data.height);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [fixedHeight]);

  return (
    <section
      className={styles.root}
      aria-labelledby={titleId}
      id={`example-${example.slug}`}
      // For screenshot scripts: the demo has loaded and sized itself.
      data-ready={loaded && (fixedHeight ?? height) !== null ? '' : undefined}
    >
      <div className={styles.demo}>
        <iframe
          ref={frameRef}
          className={cx(
            styles.frame,
            example.viewport === 'mobile' && styles.mobile,
            // Shown once it has painted: on load, or on its first height message if that comes first.
            !loaded && height === null && styles.pending
          )}
          data-viewport={example.viewport}
          src={frameSrc(owner.framePath, example.slug, theme)}
          title={`${owner.title}: ${example.title}`}
          // Eager: a demo sizing itself on scroll would shift the page under the reader.
          height={fixedHeight ?? height ?? undefined}
          onLoad={() => {
            setLoaded(true);
            onLoad();
          }}
        />
      </div>
      {/* The block is a hand-drawn card on the page: its buttons sit one level in. */}
      <Surface>
        <Space direction="vertical" gap="md" className={styles.meta}>
          <Heading level={3} id={titleId}>
            {example.title}
          </Heading>
          {example.description && (
            <Markdown
              source={example.description}
              from={owner.docPath}
              inline
              className={styles.description}
            />
          )}
          <Space gap="md" wrap>
            <Button
              type="link"
              className={styles.toggle}
              ariaExpanded={showCode}
              ariaControls={codeId}
              onClick={() => setShowCode((s) => !s)}
            >
              {showCode ? 'Hide code' : 'Show code'}
            </Button>
            <CopyButton text={example.code} label={`Copy ${example.title} code`} />
          </Space>
        </Space>
      </Surface>
      {showCode && (
        // Inside the hand-drawn card: one level in, so the box draws no page edge.
        <Surface>
          <div id={codeId}>
            <CodeBlock code={example.code} className={styles.code}>
              {/* highlight() escapes the source; the spans are its own. */}
              <code dangerouslySetInnerHTML={{ __html: highlight(example.code) }} />
            </CodeBlock>
          </div>
        </Surface>
      )}
    </section>
  );
};
