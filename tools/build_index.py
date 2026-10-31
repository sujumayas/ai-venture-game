#!/usr/bin/env python3
"""Write assets/index.json: every image asset path (used for background prefetching). Run after adding art."""
import os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = []
for d in ['bg', 'panels', 'chars', 'portraits', 'items', 'cards']:
    for f in sorted(os.listdir(os.path.join(ROOT, 'assets', d))):
        if f.endswith('.webp'):
            out.append(f'assets/{d}/{f}')
json.dump(out, open(os.path.join(ROOT, 'assets', 'index.json'), 'w'))
print(len(out), 'assets indexed')
