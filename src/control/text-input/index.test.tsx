import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../test-utils.js';
import { TextInput } from './index.js';

const counter = /^\d+\/\d+$/;

it('shows a character counter as the field approaches its limit', () => {
  renderWithProviders(<TextInput name="name" value={'a'.repeat(95)} maxLength={100} />);
  expect(screen.getByText('95/100')).toBeInTheDocument();
});

it('hides the counter while the field is far from its limit', () => {
  renderWithProviders(<TextInput name="name" value={'a'.repeat(50)} maxLength={100} />);
  expect(screen.queryByText('50/100')).not.toBeInTheDocument();
});

it('shows the counter for a short field only near the limit', () => {
  // Threshold floor is 10 chars, so a 50-char field stays clean until 40.
  const { rerender } = renderWithProviders(
    <TextInput name="name" value={'a'.repeat(39)} maxLength={50} />
  );
  expect(screen.queryByText(counter)).not.toBeInTheDocument();

  rerender(<TextInput name="name" value={'a'.repeat(41)} maxLength={50} />);
  expect(screen.getByText('41/50')).toBeInTheDocument();
});

it('renders no counter when maxLength is not set', () => {
  renderWithProviders(<TextInput name="name" value={'a'.repeat(95)} />);
  expect(screen.queryByText(counter)).not.toBeInTheDocument();
});

it('names the input after its visible label', () => {
  renderWithProviders(<TextInput name="title" label="Title" value={undefined} />);
  expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument();
});

it('names a label-less input with ariaLabel', () => {
  renderWithProviders(<TextInput name="q" ariaLabel="Search books" value={undefined} />);
  expect(screen.getByRole('textbox', { name: 'Search books' })).toBeInTheDocument();
});

it('gives two inputs with the same label distinct names', () => {
  renderWithProviders(
    <>
      <TextInput name="a" label="Title" value={undefined} />
      <TextInput name="b" label="Title" value={undefined} />
    </>
  );
  const [first, second] = screen.getAllByRole('textbox', { name: 'Title' });
  expect(first).not.toBe(second);
  expect(first!.id).not.toBe(second!.id);
});

it('calls the action when its icon button is clicked', async () => {
  const { default: userEvent } = await import('@testing-library/user-event');
  const action = vi.fn();
  const Icon = () => <svg />;
  renderWithProviders(
    <TextInput name="q" value={undefined} action={{ icon: Icon, action, ariaLabel: 'Clear' }} />
  );
  await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(action).toHaveBeenCalledTimes(1);
});
