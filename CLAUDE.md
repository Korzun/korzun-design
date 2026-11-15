# CLAUDE.md

`@korzun/design`: Bookplate's generic UI layer as a publishable package.

Folders: `src/theme` tokens and provider; `src/control` inputs and actions; `src/component` display components; `src/icon` icons; `src/toast` toast; `src/hooks` hooks; `gallery/` dev-only showcase; `scripts/` the port script (`port.mjs`, Bookplate copy and import rewrite) and the packaging smoke test (`smoke-exports.sh`).

## Rules

- Extraction before curation: 0.0.1 ships Bookplate's code as-is; cleanups and redesigns come after, so the port stays reviewable.
- Styles move byte-equivalent from Bookplate (`~/code/bookplate/app/client/src`); the only diff is import lines, so Bookplate's look cannot drift.
- Every new or changed control and component gets a test and a gallery entry (five upstream modules ship without tests today: popover, use-modal-dialog, metadata, metadata-list, top-fade), so behaviour and appearance are both covered.
- Bump `version` and add a CHANGELOG line with every behaviour change, so consumers can tell what an upgrade does.
- Relative imports only, pointing at a module folder, never at the `control` or `component` barrel; barrel imports caused circular-import failures before.
- No runtime `dependencies`, peers only, so consumers never get duplicate React or react-jss.
- Run `npm run smoke` before tagging; it checks the packed tarball resolves every subpath, which unit tests cannot.
- Releases are tag-driven: tag `vX.Y.Z` on `main` and the publish workflow ships it through npm trusted publishing (OIDC, no stored token); it fails if the tag and `package.json` version differ.
- Node comes from mise, pinned in `.node-version`, so local and CI match.
