// client/src/component/collapsible-section/index.test.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { CollapsibleSection } from './index.js';

describe('CollapsibleSection', () => {
  it('hides children by default (uncontrolled)', () => {
    renderWithProviders(
      <CollapsibleSection title="Details">
        <span>Hidden content</span>
      </CollapsibleSection>
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('shows children after clicking the header', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollapsibleSection title="Details">
        <span>Visible content</span>
      </CollapsibleSection>
    );
    await user.click(screen.getByRole('button', { name: /Details/ }));
    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('toggles back to hidden on second click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollapsibleSection title="Details">
        <span>Content</span>
      </CollapsibleSection>
    );
    await user.click(screen.getByRole('button', { name: /Details/ }));
    await user.click(screen.getByRole('button', { name: /Details/ }));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('calls onOpenToggle when the header is clicked', async () => {
    const user = userEvent.setup();
    const onOpenToggle = vi.fn();
    renderWithProviders(
      <CollapsibleSection title="Details" onOpenToggle={onOpenToggle}>
        <span>Content</span>
      </CollapsibleSection>
    );
    await user.click(screen.getByRole('button', { name: /Details/ }));
    expect(onOpenToggle).toHaveBeenCalledOnce();
  });

  it('opens and closes with Enter key', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollapsibleSection title="Details">
        <span>Content</span>
      </CollapsibleSection>
    );
    const header = screen.getByRole('button', { name: /Details/ });
    header.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Content')).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('respects controlled open={false} — keeps children hidden even after click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CollapsibleSection title="Details" open={false} onOpenToggle={vi.fn()}>
        <span>Content</span>
      </CollapsibleSection>
    );
    await user.click(screen.getByRole('button', { name: /Details/ }));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders subTitle when provided', () => {
    renderWithProviders(
      <CollapsibleSection title="Books" subTitle="3 items">
        <span>Content</span>
      </CollapsibleSection>
    );
    expect(screen.getByText('3 items')).toBeInTheDocument();
  });
});

describe('CollapsibleSection actions', () => {
  it('a native button action fires without toggling the section', async () => {
    const onAction = vi.fn();
    const onOpenToggle = vi.fn();
    renderWithProviders(
      <CollapsibleSection
        title="Shelf"
        onOpenToggle={onOpenToggle}
        actions={[
          <button key="add" type="button" onClick={onAction}>
            Add
          </button>,
        ]}
      >
        <p>Body</p>
      </CollapsibleSection>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onOpenToggle).not.toHaveBeenCalled();
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
  });

  it('Enter and Space on a focused action reach the action, not the header', async () => {
    const onAction = vi.fn();
    const onOpenToggle = vi.fn();
    renderWithProviders(
      <CollapsibleSection
        title="Shelf"
        onOpenToggle={onOpenToggle}
        actions={[
          <button key="add" type="button" onClick={onAction}>
            Add
          </button>,
        ]}
      />
    );
    screen.getByRole('button', { name: 'Add' }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onAction).toHaveBeenCalledTimes(2);
    expect(onOpenToggle).not.toHaveBeenCalled();
  });

  it('a link action does not toggle the section', async () => {
    const onOpenToggle = vi.fn();
    renderWithProviders(
      <CollapsibleSection
        title="Shelf"
        onOpenToggle={onOpenToggle}
        actions={[
          <a key="all" href="#all">
            All
          </a>,
        ]}
      />
    );
    await userEvent.click(screen.getByRole('link', { name: 'All' }));
    expect(onOpenToggle).not.toHaveBeenCalled();
  });
});
