# CLAUDE.md

`@korzun/design`: Bookplate's generic UI layer as a publishable package.

Folders: `src/theme` tokens and provider; `src/control` inputs and actions; `src/component` display components; `src/icon` icons; `src/toast` toast; `src/hooks` hooks; `gallery/` the docs site (dev-only Vite app, deployed to https://korzun.github.io/korzun-design/; each module's runnable examples live beside it in `examples/`); `scripts/` the port script (`port.mjs`, Bookplate copy and import rewrite), the docs generator (`docs-gen/`, run by `npm run docs:gen`) and the packaging smoke test (`smoke-exports.sh`).

Skills: `.claude/skills/new-component` adds a control, component or hook end to end; `.claude/skills/document-component` writes or refreshes a module's doc, JSDoc and examples (use it after any API change made elsewhere).

## Rules

- Extraction before curation: 0.0.1 ships Bookplate's code as-is; cleanups and redesigns come after, so the port stays reviewable.
- Styles move byte-equivalent from Bookplate (`~/code/bookplate/app/client/src`); the only diff is import lines, so Bookplate's look cannot drift.
- Every new or changed control and component gets a test (four upstream modules ship without tests today: use-modal, metadata, metadata-list, top-fade) and examples (`examples/NN-slug.tsx` beside it, plus `examples/preview.tsx`, the component alone for the overview thumbnail and never on its page; `gallery/examples.test.tsx` renders each), so behaviour and appearance are both covered.
- Every exported control and component also has an LLM-facing doc at `docs/<area>/<module>.md`, listed in the `AGENTS.md` docs index. Each doc has front matter (`title`, `description`, `category`) and generated regions (`<!-- generated:import -->`, `examples`, `props`, `tokens`, `changelog`) filled from JSDoc, examples, tokens and the CHANGELOG; never edit inside a region. Run `npm run docs:gen` after any API change (props, JSDoc, examples, tokens, CHANGELOG); `npm run docs:check` (part of `npm test`) fails when a doc or the index is stale. `AGENTS.md` and `docs/` ship in the tarball so consuming apps' agents can read them (`scripts/docs.test.mjs` and the smoke test enforce this). Every exported component also exports `<Name>Props` from its barrel, with JSDoc on every prop (`scripts/props-exports.test.mjs`). Docs describe the corner rule as Bookplate practises it: one radius step per nesting level (`docs/corners.md`).
- Examples and gallery code never ship: `files`, `tsconfig.build.json`, and the smoke test all exclude `examples/`, and `gallery/` is not in `files`.
- Bump `version` and add a CHANGELOG line with every behaviour change, so consumers can tell what an upgrade does. Start each bullet with its tags (`- [Button] …`, `- [Popover, Menu] …`, `- [General] …`); a tag names an exported module, and the generator puts the line in that module's doc.
- Relative imports only, pointing at a module folder, never at the `control` or `component` barrel, except examples, which import from the public entry points (`@korzun/design/control`, …); barrel imports caused circular-import failures before.
- No runtime `dependencies`, peers only, so consumers never get duplicate React or react-jss.
- Run `npm run smoke` before tagging; it checks the packed tarball resolves every subpath, which unit tests cannot.
- Releases are tag-driven: tag `vX.Y.Z` on `main` and the publish workflow ships it through npm trusted publishing (OIDC, no stored token); it fails if the tag and `package.json` version differ.
- Node comes from mise, pinned in `.node-version`, so local and CI match.
