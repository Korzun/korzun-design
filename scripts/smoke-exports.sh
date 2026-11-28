#!/usr/bin/env bash
# Packs the library, installs the tarball into a scratch project, and checks
# that every subpath export type-checks, imports under Node, and resolves a single
# copy of react/react-jss.
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$repo"
npm pack --pack-destination "$tmp" --silent >/dev/null
shopt -s nullglob
tarballs=("$tmp"/*.tgz)
shopt -u nullglob
[ "${#tarballs[@]}" = 1 ] || { echo "smoke: expected one tarball from npm pack, found ${#tarballs[@]}"; exit 1; }
if tar -tzf "${tarballs[0]}" | grep -E '\.test\.[cm]?[jt]sx?$'; then
  echo "smoke: tarball contains test files"; exit 1
fi
listing="$(tar -tzf "${tarballs[0]}")"
grep -qx 'package/AGENTS.md' <<<"$listing" || { echo "smoke: tarball is missing AGENTS.md"; exit 1; }
while IFS= read -r doc; do
  grep -qx "package/$doc" <<<"$listing" || { echo "smoke: tarball is missing $doc"; exit 1; }
done < <(find docs -name '*.md' -not -path 'docs/superpowers/*' | sort)
if grep -q '^package/docs/superpowers/' <<<"$listing"; then echo "smoke: tarball contains docs/superpowers"; exit 1; fi
if grep '/examples/' <<<"$listing"; then echo "smoke: tarball contains examples"; exit 1; fi
if grep -q '^package/recipes/' <<<"$listing"; then echo "smoke: tarball contains recipes"; exit 1; fi
grep -q '^package/docs/recipes/' <<<"$listing" || { echo "smoke: tarball is missing docs/recipes"; exit 1; }
mkdir "$tmp/pkg"
tar -xzf "${tarballs[0]}" -C "$tmp/pkg"
node -e '
  const fs = require("node:fs");
  const path = require("node:path");
  const empty = /<!-- generated:([a-z]+) -->\s*<!-- \/generated:\1 -->/;
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".md") ? [path.join(d, e.name)] : []);
  const bad = walk(process.argv[1]).filter((f) => empty.test(fs.readFileSync(f, "utf8")));
  if (bad.length) { console.log("smoke: empty generated region in " + bad.join(", ")); process.exit(1); }
' "$tmp/pkg/package/docs"
tarball="$(basename "${tarballs[0]}")"

peer() { node -p "require('$repo/package.json').peerDependencies['$1']"; }
dev() { node -p "require('$repo/package.json').devDependencies['$1']"; }

mkdir "$tmp/app"
cat >"$tmp/app/package.json" <<JSON
{
  "name": "smoke-app",
  "private": true,
  "type": "module",
  "dependencies": {
    "@korzun/design": "file:../$tarball",
    "classnames": "$(peer classnames)",
    "react": "$(peer react)",
    "react-dom": "$(peer react-dom)",
    "react-jss": "$(peer react-jss)",
    "react-router": "$(peer react-router)"
  },
  "devDependencies": {
    "@types/react": "$(dev @types/react)",
    "typescript": "$(dev typescript)"
  }
}
JSON

cat >"$tmp/app/index.ts" <<'TS'
import { applyTransparency } from '@korzun/design';
import { Alert, Code, Page, Surface, Table, CodeBlock, useSurfaceRadius, type AlertProps, type AlertTone, type CardProps, type CodeBlockProps, type CodeProps, type ErrorMessageProps, type HeadingProps, type InlineProps, type SpinnerProps, type StackProps, type TableColumn, type TableProps, type TagTone, type TextProps } from '@korzun/design/component';
import { Button, Menu, Dialog, useModal, useModalDialog, type ButtonProps, type DialogProps, type ModalProps, type MenuItem, type MenuProps, type PopoverSide } from '@korzun/design/control';
import { isStandalone } from '@korzun/design/hooks';
import { CheckIcon } from '@korzun/design/icon';
import { ThemeProvider, type SpaceValue, type Theme } from '@korzun/design/theme';
import { useToast } from '@korzun/design/toast';

export const typeProbe: [ButtonProps['radius'], CardProps['size']] = ['card', 'small'];
export const toneProbe: [TagTone, PopoverSide] = ['warning', 'top'];
export const codeProbe: [CodeProps['className']] = ['x'];
export const tableProbe: [TableColumn<{ a: string }>['align'], TableProps<{ a: string }>['minWidth']] = ['end', '40rem'];
export const codeBlockProbe: [CodeBlockProps['copyLabel']] = ['Copy import'];
export const layoutProbe: [StackProps['gap'], InlineProps['justify'], TextProps['tone'], HeadingProps['level']] = ['none', 'between', 'muted', 2];
export const feedbackProbe: [ModalProps['canDismiss'], ErrorMessageProps['as'], SpinnerProps['size']] = [false, 'div', 'xl'];
export const menuProbe: [MenuItem, MenuProps['surface']] = [{ label: 'Open', to: '/x' }, 'glass'];
export const surfaceProbe: [AlertTone, AlertProps['title'], SpaceValue, Theme['space']['sm']] = ['warning', 'Overdue', '1rem', '0.5rem'];
export const probe = [Alert, Code, CodeBlock, Surface, Table, useSurfaceRadius, ThemeProvider, Button, Menu, Dialog, useModal, useModalDialog, Page, CheckIcon, useToast, isStandalone, applyTransparency];
TS

cd "$tmp/app"
npm install --silent --no-audit --no-fund
npx --no-install tsc --noEmit --moduleResolution bundler --module esnext --target es2022 --jsx react-jsx --strict --skipLibCheck index.ts

for p in "" /theme /control /component /icon /toast /hooks; do
  node --input-type=module -e "await import('@korzun/design$p')" ||
    { echo "smoke: Node could not import @korzun/design$p"; exit 1; }
done

for p in react react-jss; do
  n=$(npm ls "$p" --all --json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const seen=new Set();const walk=o=>{for(const [k,v] of Object.entries(o.dependencies??{})){if(k===process.argv[1]&&v.version)seen.add(v.version);walk(v);}};walk(JSON.parse(d));console.log(seen.size);})' "$p")
  [ "$n" = 1 ] || { echo "smoke: expected one version of $p, found $n"; exit 1; }
done

echo "smoke: ok"
