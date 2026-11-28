/** Preview
 * @viewport mobile
 */
import { Stack, Text, TopFade } from '@korzun/design/component';

// Page content scrolled up under the band at the top edge.
export default function Preview() {
  return (
    <>
      <TopFade />
      <div style={{ position: 'fixed', top: -6, left: 16, right: 16 }}>
        <Stack gap="xs">
          <Text>Middlemarch</Text>
          <Text>Persuasion</Text>
          <Text>Villette</Text>
        </Stack>
      </div>
    </>
  );
}
