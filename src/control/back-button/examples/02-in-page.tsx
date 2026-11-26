/** In a page
 * Usually you do not render it yourself: pass `back` to `Page`, which puts the
 * button in its sticky controls row on mobile.
 */
import { Card, Page } from '@korzun/design/component';

export default function InPage() {
  return (
    <Page back="/library">
      <Card title="Dune">Frank Herbert, 1965.</Card>
    </Page>
  );
}
