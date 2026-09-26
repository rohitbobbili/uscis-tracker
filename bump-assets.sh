#!/usr/bin/env bash
# Bump the ?v= query on every css/js/data asset reference, across every
# HTML page. Run this whenever any CSS/JS/data file changes, so a returning
# visitor can't end up with a new HTML page paired with a cached old asset.
# Fails loudly rather than silently no-opping (which it did once, unnoticed,
# for ten commits — see project history).
set -euo pipefail
cd "$(dirname "$0")"
python3 - <<'PY'
import re, sys, glob

ASSET_RE = re.compile(r'((?:css|js|data)/[\w.-]+\.(?:css|js))\?v=(\d+)')

html_files = sorted(glob.glob('*.html'))
if not html_files:
    sys.exit('ERROR: no HTML files found')

found_versions = set()
for f in html_files:
    found_versions |= {int(v) for _, v in ASSET_RE.findall(open(f).read())}
if not found_versions:
    sys.exit('ERROR: no versioned asset references found in any HTML file')

new = str(max(found_versions) + 1)
total_rewritten = 0
for f in html_files:
    src = open(f).read()
    before = len(ASSET_RE.findall(src))
    out = ASSET_RE.sub(lambda m: f'{m.group(1)}?v={new}', src)
    after = len(re.findall(r'\?v=' + new + r'\b', out))
    if before == 0:
        continue
    if before != after:
        sys.exit(f'ERROR: {f} — expected to rewrite {before} references, rewrote {after}')
    open(f, 'w').write(out)
    total_rewritten += after

print(f'assets bumped to v={new} ({total_rewritten} references across {len(html_files)} pages)')
PY
