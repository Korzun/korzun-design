#!/usr/bin/env bash
# Packs the library, installs the tarball into a scratch project, and checks
# that every subpath export type-checks with a single copy of react/react-jss.
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$repo"
npm pack --pack-destination "$tmp" --silent >/dev/null
tarball="$(basename "$(ls "$tmp"/*.tgz)")"

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
import { Page } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { isStandalone } from '@korzun/design/hooks';
import { CheckIcon } from '@korzun/design/icon';
import { ThemeProvider } from '@korzun/design/theme';
import { useToast } from '@korzun/design/toast';

export const probe = [ThemeProvider, Button, Page, CheckIcon, useToast, isStandalone, applyTransparency];
TS

cd "$tmp/app"
npm install --silent --no-audit --no-fund
npx tsc --noEmit --moduleResolution bundler --module esnext --target es2022 --jsx react-jsx --strict --skipLibCheck index.ts

for p in react react-jss; do
  n=$(npm ls "$p" --all --json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const seen=new Set();const walk=o=>{for(const [k,v] of Object.entries(o.dependencies??{})){if(k===process.argv[1]&&v.version)seen.add(v.version);walk(v);}};walk(JSON.parse(d));console.log(seen.size);})' "$p")
  [ "$n" = 1 ] || { echo "smoke: expected one version of $p, found $n"; exit 1; }
done

echo "smoke: ok"
