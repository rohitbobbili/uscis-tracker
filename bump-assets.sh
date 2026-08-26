#!/usr/bin/env bash
# Bump the ?v= query on css/js in index.html so returning visitors can't mix
# a new index.html with cached old assets. Run this whenever CSS or JS changes.
# Fails loudly rather than silently no-opping (which it did, unnoticed, once).
set -euo pipefail
cd "$(dirname "$0")"
python3 - <<'PY'
import re, sys
h = open('index.html').read()
found = set(re.findall(r'(?:css/style\.css|js/main\.js)\?v=(\d+)', h))
if not found:
    sys.exit('ERROR: no versioned asset references found in index.html')
new = str(max(int(v) for v in found) + 1)
h2 = re.sub(r'((?:css/style\.css|js/main\.js)\?v=)\d+', r'\g<1>' + new, h)
n = len(re.findall(r'\?v=' + new + r'\b', h2))
if n != 2:
    sys.exit(f'ERROR: expected to rewrite 2 references, rewrote {n}')
open('index.html', 'w').write(h2)
print(f'assets bumped to v={new}')
PY
