import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Page } from '../page/index.js';
import { Surface, depthClass, radiusForDepth, useSurfaceDepth, useSurfaceRadius } from './index.js';

const Probe = ({ id = 'probe' }: { id?: string }) => (
  <span data-testid={id}>{String(useSurfaceDepth())}</span>
);
const RadiusProbe = () => <span data-testid="radius">{useSurfaceRadius()}</span>;

describe('surface depth', () => {
  it('reports no depth outside any provider', () => {
    const { getByTestId } = renderWithProviders(<Probe />);
    expect(getByTestId('probe').textContent).toBe('undefined');
  });

  it('Page provides depth 0 to its children, header and footer actions', () => {
    const { getByTestId } = renderWithProviders(
      <Page header={<Probe id="header" />}>
        <Probe />
      </Page>
    );
    expect(getByTestId('probe').textContent).toBe('0');
    expect(getByTestId('header').textContent).toBe('0');
  });

  it('Page footerActions buttons are 16px, the page-level look', () => {
    renderWithProviders(<Page footerActions={[{ label: 'Save', onClick: () => {} }]} />);
    expect(getComputedStyle(screen.getByRole('button', { name: 'Save' })).borderRadius).toBe(
      '16px'
    );
  });

  it('Page type="minimal" also provides depth 0', () => {
    const { getByTestId } = renderWithProviders(
      <Page type="minimal">
        <Probe />
      </Page>
    );
    expect(getByTestId('probe').textContent).toBe('0');
  });

  it('Surface steps one level deeper', () => {
    const inPage = renderWithProviders(
      <Page>
        <Surface>
          <Probe />
        </Surface>
      </Page>
    );
    expect(inPage.getByTestId('probe').textContent).toBe('1');
    inPage.unmount();

    const bare = renderWithProviders(
      <Surface>
        <Surface>
          <Probe />
        </Surface>
      </Surface>
    );
    expect(bare.getByTestId('probe').textContent).toBe('2');
  });

  it('radiusForDepth maps 0/1/2/5 to lg/md/sm/sm', () => {
    const { radius } = lightTheme;
    expect([0, 1, 2, 5].map((d) => radiusForDepth(radius, d))).toEqual([
      radius.lg,
      radius.md,
      radius.sm,
      radius.sm,
    ]);
  });

  it('depthClass clamps to 2', () => {
    expect([0, 1, 2, 5].map(depthClass)).toEqual([0, 1, 2, 2]);
  });

  it('useSurfaceRadius returns radius.md inside Page > Surface', () => {
    const { getByTestId } = renderWithProviders(
      <Page>
        <Surface>
          <RadiusProbe />
        </Surface>
      </Page>
    );
    expect(getByTestId('radius').textContent).toBe(lightTheme.radius.md);
  });
});
