# Recipes: design

## Intent

A recipe shows how a set of library parts goes together for one job. Sometimes
that's a whole screen (sign-in); sometimes it's a smaller group of components.
Module docs cover one part each, and `patterns.md` gives code-only snippets.
Recipes fill the gap between those: a worked, live, copyable assembly.

There are two audiences, and both matter:

- **Coding agents in consuming apps** read `docs/recipes/<slug>.md` from the
  tarball (via `AGENTS.md` and `llms.txt`). The doc carries the full code and the
  reasoning behind each choice.
- **People on the docs site** see a live preview with the code and a copy button
  beside it.

The first recipe is **Sign in**: Bookplate's login screen, rebuilt with this
package's parts.

## Goals

- A recipe is a doc (`docs/recipes/<slug>.md`, front matter `category: Recipe`)
  plus one or more runnable examples (`recipes/<slug>/NN-slug.tsx`).
- The generator fills the doc's `<!-- generated:examples -->` region from those
  files, the same way module docs are filled. Agents get the exact code that the
  site previews.
- The site gets:
  - `#/recipes`: an index of recipes, each with a centred thumbnail as on the
    overview
  - `#/recipes/:slug`: the recipe page, with the title, the description, the
    examples as live blocks (reusing `ExampleBlock`), then the prose body
  - a **Recipes** link in the header nav
- Recipes appear in `llms.txt` under their own `## Recipes` section, and in
  `llms-full.txt` (that file already includes every doc).
- `AGENTS.md` gets a `[docs/recipes]|{…}.md` index line, maintained by
  `docs:gen`, plus one sentence in the guide pointing agents at recipes before
  they build a screen.
- `gallery/examples.test.tsx` renders every recipe example, so a recipe that
  stops rendering fails `npm test`. `docs:check` fails when a recipe doc is
  stale.

## Non-goals

- Live examples inside ordinary guides (approach B). They can come later.
- Recipes that ship as code. Recipe `.tsx` files are never built or exported.
- Auth logic. The recipe's submit is a stub: a fake async action that shows the
  pending state and then shows a toast.
- Recipes beyond Sign in in this change.

## Anti-goals

- A recipe that breaks the package's own rules (`AGENTS.md`):
  - literal px values
  - layout or text in style files
  - `radius` passed where depth decides it
  - Bookplate-only parts such as `BrandLockup`

  A recipe is exemplary code, and agents will copy it verbatim.
- A recipe that drifts from its preview. The doc code is generated from the
  same file the site renders, never pasted by hand.
- A recipe that looks different from Bookplate's login. Match the screenshot:
  - a card holding the two fields
  - a full-width primary **Sign In** below the fields, with a larger gap above
    it than between the fields
  - a full-width default **Forgot password?** on the page below the card, as
    wide as the card

## Constraints

- `recipes/` lives at the repo root, outside `src`. That keeps it out of
  `tsconfig.build.json`, out of `dist`, and out of the `files` list.
  - The smoke test adds a check that no `recipes/` path is in the tarball,
    while `docs/recipes/*.md` is.
- Recipe examples import only from the public entry points
  (`@korzun/design/control`, …), as module examples do.
  - Check that the gallery's Vite alias, `tsconfig`, eslint and vitest include
    globs cover `recipes/**`, and extend them where they don't.
- `Recipe` is not a module category. `CATEGORIES` stays as it is.
  - The generator accepts `Recipe` the way it accepts `Guide` (via
    `checkCategory`'s allow path) and builds `site.recipes` from those docs.
  - A recipe doc with no examples is an error, in strict mode and always: a
    recipe without a preview is a guide.
- Every recipe example has the usual `/** Title … */` header. `@viewport mobile`
  is allowed.
- Front-matter `title`, `description` and `category` are required, as for
  every doc.
- The frame route gets a recipe namespace, so a recipe slug can never collide
  with a module slug: `/frame/recipe/:recipe/:example`, beside the existing
  `/frame/:module/:example`.
  - `frameSrc` and `ExampleBlock` take a source (module or recipe) or a ready
    path. The builder picks whichever keeps the change smallest.

## Approaches

- **A. Recipes as their own doc kind (chosen).** A new `Recipe` category, a
  `recipes/<slug>/` folder of examples, a generated examples region, a site
  route, an index page and a nav link. It reuses the example pipeline end to
  end, makes recipes a browsable section, and handles one example or several.
- **B. Live-example markers inside any guide.** A marker such as
  `<!-- example: path -->` would be expanded by both the generator and the
  site's markdown renderer. It's more flexible, but it's a custom markdown
  dialect that two renderers have to understand, and recipes wouldn't be a
  section you can browse. Deferred.
- **C. Recipes as pseudo-modules in `src/recipe/`.** Rejected. They'd look
  like exports, and they'd fight the assumption made by the build, smoke and
  props tests that everything in `src` ships.

The user picked A.

## Data shape

Added to `scripts/docs-gen/types.d.ts`:

```ts
export type Recipe = {
  slug: string;        // docs/recipes/<slug>.md and recipes/<slug>/
  docPath: string;
  title: string;
  description: string;
  body: string;        // prose with the H1 and generated regions stripped
  examples: ExampleInfo[];
};
// SiteData gains: recipes: Recipe[]
```

The generator rules:

- The examples for `docs/recipes/<slug>.md` come from `recipes/<slug>/*.tsx`.
- A doc with no matching folder is an error.
- A folder with no matching doc is an error.
- The doc's `examples` region is rewritten with the existing region writer,
  so the format matches module docs.
- Recipe docs have only the `examples` region. They have no `import`,
  `props`, `tokens` or `changelog` region, because those are module concepts.

## The Sign in recipe

`docs/recipes/login.md`, with the title **Sign in** and one example,
`recipes/login/01-sign-in.tsx`. Its parts:

- `Page type="minimal"`, wrapping a full-height centred column on the page
  background.
- A `Card` with no title, holding a `<form action={…}>`:
  - The two fields go in a `Stack gap="md"`: `TextInput` with
    `placeholder="Username or email"`, `name="username"` and
    `autoCapitalize="none"`, then `TextInput` with `password`,
    `placeholder="Password"` and `name="password"`.
  - Then the primary submit `Button` (**Sign In**), with `loading` while
    pending.
  - Both sit in an outer `Stack` with a larger gap (`xxl`, Bookplate's
    spacing), which makes the button full width.
  - No `radius` prop. The button gets its corners from the card depth. Check
    this matches the screenshot, where the button's corners are squarer than
    the card's. If it doesn't, the difference goes in "What's left" and is
    raised with the user, not hacked around.
- Below the card, in the same column: a default `Button` **Forgot password?**,
  full width, with the page radius and no `radius` prop. It's outside the
  `<form>`, so it can't submit.
- The submit is stubbed: a fake async delay so the pending state is visible,
  then a toast (`"Signed in"`, success).
- Centring and width:
  - The column is centred in the viewport and is the card's width. The
    Forgot password? button matches the card's width.
  - On mobile the column is full width, with the page gutter.
  - These use `Stack` and `Inline` props where they can express it. Anything
    they can't express (`minHeight: 100vh`, the width) goes in the example's
    sibling `style.ts`, tokens only.
  - The width is a new theme token, `theme.layout.formWidth: '400px'`, the
    same width as Bookplate's literal. The user decided this: `modalWidth`
    (500px) is too wide. The column is `width: formWidth`, with
    `maxWidth: 100%` so it fits on mobile. The token is documented as the
    width of a standalone form column (sign-in, password reset), in both the
    light and dark themes.
- The prose body explains the choices:
  - why the gaps differ
  - why Forgot password? is outside the form and on the page
  - why there are no radius props
  - where real auth goes: replace the stub, and show errors with
    `useToast`, as Bookplate does
  - the email-disabled variant (a "Username" placeholder and no Forgot
    password?) as a short note, not a second example

The preview renders in the existing flow frame. The frame's own padding plus
the recipe's full-height column has to give a sensible height. If it doesn't
(an endless or zero-height frame), the builder adjusts the frame, not the
recipe.

## Tests

Tests are written first, per the repo's habit:

- **Generator** (`generate.test.mjs`):
  - recipes are collected
  - the examples region is filled
  - errors for a missing folder, a missing doc, and no examples
  - `Recipe` is accepted as a category
- **`docs.test.mjs` and the smoke test:**
  - `docs/recipes/*.md` ships
  - `recipes/` does not
  - the `AGENTS.md` index line is present
- **Site:**
  - `#/recipes` lists the recipe
  - `#/recipes/login` renders the title, the example block and the body
  - an unknown slug renders NotFound
  - the header has a Recipes link
  - the recipe frame route renders the example
- **`examples.test.tsx`:** globs recipe examples too. The "every file is listed"
  check includes `siteData.recipes`.
- **`llms-plugin.test.ts`:** a `## Recipes` section.
- **The Sign in recipe itself:**
  - it renders the two fields and the two buttons
  - Forgot password? is outside the form
  - submitting shows the loading state

## Release

- Consumers get a new shipped doc, an `AGENTS.md` line, and a new token.
  Bump the minor version, because the token is new API. Add two CHANGELOG
  lines:
  - one tagged `[General]` for recipes, which aren't modules
  - one tagged `[Theme]` for `layout.formWidth`

  Add a theme test for the token, and regenerate the token docs.
  - Bookplate can adopt `formWidth` in its own login later. That's a
    separate change in Bookplate, not part of this one.
- Run `npm run docs:gen`, `npm test` and `npm run smoke`.
- Screenshot `#/recipes/login` with `playwright screenshot` and compare it
  with the reference before calling the change done.
  - The user's screenshot is no longer on disk. The reference is the
    description under "Anti-goals" plus Sign In's corners being squarer than
    the card's.
  - Check light mode at desktop width and at mobile width (390px).

## What's left to the builder

- Exact file split for the new site page and the index page.
- Whether `frameSrc` takes a source or a path.
- The `AGENTS.md` sentence wording.
- The thumbnail layout on `#/recipes`.
