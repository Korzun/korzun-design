import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';

import { renderWithProviders } from '../src/test-utils.js';
import { exampleComponents, recipeBySlug } from './data.js';
import { Frame } from './frame.js';

const SIGN_IN = 'recipes/login/01-sign-in.tsx';

describe('Sign in recipe', () => {
  const mount = () => {
    const SignIn = exampleComponents[SIGN_IN];
    expect(SignIn).toBeDefined();
    return renderWithProviders(<SignIn />);
  };

  it('has both fields, Sign In inside the form, and Forgot password? outside it', () => {
    mount();
    expect(screen.getByPlaceholderText('Username or email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Sign In' }).closest('form')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Forgot password?' }).closest('form')).toBeNull();
  });

  it('submits on Enter in the password field, shows the pending state, then a toast', async () => {
    const user = userEvent.setup();
    mount();
    await user.type(screen.getByPlaceholderText('Username or email'), 'alice');
    await user.type(screen.getByPlaceholderText('Password'), 'secret{Enter}');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled());
    expect(await screen.findByText('Signed in', {}, { timeout: 3000 })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign In' })).toBeEnabled());
  });

  it('marks the fields for password managers', () => {
    mount();
    expect(screen.getByPlaceholderText('Username or email')).toHaveAttribute(
      'autocomplete',
      'username'
    );
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute(
      'autocomplete',
      'current-password'
    );
  });

  it('is listed as a recipe with a screen-viewport example', () => {
    const recipe = recipeBySlug('login');
    expect(recipe?.title).toBe('Sign in');
    expect(recipe?.examples.map((e) => [e.file, e.viewport])).toEqual([[SIGN_IN, 'screen']]);
  });
});

describe('recipe frame', () => {
  const mountFrame = (url: string) =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/frame/recipe/:recipe/:example" element={<Frame />} />
        </Routes>
      </MemoryRouter>
    );

  it('renders the recipe example named in the URL', () => {
    mountFrame('/frame/recipe/login/sign-in');
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('posts no height for a screen example: its height is the frame', async () => {
    const post = vi.spyOn(window, 'postMessage');
    mountFrame('/frame/recipe/login/sign-in');
    await act(async () => {});
    const heights = post.mock.calls.filter(
      (call) => (call[0] as { type?: string }).type === 'gallery:height'
    );
    expect(heights).toEqual([]);
    post.mockRestore();
  });
});

describe('Copy button recipe', () => {
  const COPY = 'recipes/copy-button/01-copy-button.tsx';
  const mount = () => {
    const Copy = exampleComponents[COPY];
    expect(Copy).toBeDefined();
    return renderWithProviders(<Copy />);
  };

  it('is listed as a recipe', () => {
    expect(recipeBySlug('copy-button')?.title).toBe('Copy button');
  });

  it('shows Copied after a successful copy and announces it', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
  });

  it('shows Could not copy when the clipboard is missing', async () => {
    const user = userEvent.setup();
    mount();
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByRole('button', { name: 'Could not copy' })).toBeInTheDocument();
  });
});
