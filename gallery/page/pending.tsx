import { Heading, Page, Text } from '@korzun/design/component';
import { useParams } from 'react-router';

import { siteData } from '../data.js';
import { NotFound } from '../not-found.js';

// Placeholders until the guide and changelog pages land: each renders its
// title so routing works end to end.

export const GuidePage = () => {
  const slug = useParams().slug ?? '';
  const guide = siteData.guides.find((g) => g.slug === slug);
  if (!guide) return <NotFound />;
  return (
    <Page documentTitle={`${guide.title} · @korzun/design`}>
      <Heading level={1}>{guide.title}</Heading>
      <Text as="p" tone="description">
        {guide.description}
      </Text>
    </Page>
  );
};

export const ChangelogPage = () => (
  <Page documentTitle="Changelog · @korzun/design">
    <Heading level={1}>Changelog</Heading>
  </Page>
);
