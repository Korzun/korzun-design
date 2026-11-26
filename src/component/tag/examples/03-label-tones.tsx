/** Label tones
 * Label tones name a kind of thing, so the same kind of thing is the same colour everywhere. `status` is a legacy label tone despite its name: it is listed for completeness, and a new state tag uses a status tone. Each tag is labelled with its tone.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

export default function LabelTones() {
  return (
    <Stack gap="sm" align="start">
      <Inline>
        <Tag tone="author">George Eliot</Tag>
        <Text tone="muted">author: a person who wrote something</Text>
      </Inline>
      <Inline>
        <Tag tone="series">Discworld</Tag>
        <Text tone="muted">series: a series name</Text>
      </Inline>
      <Inline>
        <Tag tone="subject">Fiction</Tag>
        <Text tone="muted">subject: a subject, genre or keyword</Text>
      </Inline>
      <Inline>
        <Tag tone="book">Middlemarch</Tag>
        <Text tone="muted">book: a book or title</Text>
      </Inline>
      <Inline>
        <Tag tone="entryType">Essay</Tag>
        <Text tone="muted">entryType: the kind of an entry or record</Text>
      </Inline>
      <Inline>
        <Tag tone="user">simon</Tag>
        <Text tone="muted">user: an app user or account</Text>
      </Inline>
      <Inline>
        <Tag tone="rating">4.5</Tag>
        <Text tone="muted">rating: a rating value</Text>
      </Inline>
      <Inline>
        <Tag tone="status">Legacy</Tag>
        <Text tone="muted">status: legacy label tone</Text>
      </Inline>
    </Stack>
  );
}
