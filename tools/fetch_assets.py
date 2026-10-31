#!/usr/bin/env python3
"""Download generated images and convert them to optimized WebP game assets.

Usage: python3 tools/fetch_assets.py list.txt
Each line of list.txt:  <kind> <out_path_relative_to_repo> <url> [job_id]
kind: bg | panel | char | item | card
Records provenance in assets/manifest.json.
"""
import sys, os, json, io, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, 'assets', 'manifest.json')


def fetch(url):
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read()


def trim_alpha(im, pad=6):
    a = im.split()[-1]
    # treat near-transparent as transparent
    a = a.point(lambda v: 255 if v > 24 else 0)
    bbox = a.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + 2)))


def cover(im, w, h):
    sw, sh = im.size
    s = max(w / sw, h / sh)
    nw, nh = round(sw * s), round(sh * s)
    im = im.resize((nw, nh), Image.LANCZOS)
    l, t = (nw - w) // 2, (nh - h) // 2
    return im.crop((l, t, l + w, t + h))


def process(kind, data):
    im = Image.open(io.BytesIO(data))
    if kind == 'bg':
        im = cover(im.convert('RGB'), 1920, 820)
        return im, dict(quality=82, method=6)
    if kind in ('panel', 'card'):
        im = cover(im.convert('RGB'), 1920, 1080)
        return im, dict(quality=80, method=6)
    if kind == 'char':
        im = trim_alpha(im.convert('RGBA'))
        if im.height > 1200:
            im = im.resize((round(im.width * 1200 / im.height), 1200), Image.LANCZOS)
        return im, dict(quality=86, method=6)
    if kind == 'item':
        im = trim_alpha(im.convert('RGBA'), pad=4)
        im.thumbnail((256, 256), Image.LANCZOS)
        return im, dict(quality=88, method=6)
    raise ValueError(kind)


def portrait(im):
    """Square head-and-shoulders crop from a trimmed full-body sprite."""
    a = im.split()[-1]
    h = im.height
    side = int(h * 0.2)
    band = a.crop((0, 0, im.width, int(h * 0.1)))
    cols = [sum(1 for y in range(band.height) if band.getpixel((x, y)) > 40) for x in range(band.width)]
    tot = sum(cols) or 1
    cx = int(sum(i * c for i, c in enumerate(cols)) / tot)
    top = 0
    box = (cx - side // 2, top, cx + side // 2, top + side)
    out = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    out.paste(im.crop(box), (0, 0))
    return out.resize((256, 256), Image.LANCZOS)


def main():
    lines = [l.split() for l in open(sys.argv[1]) if l.strip() and not l.startswith('#')]
    man = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
    for parts in lines:
        kind, out, url = parts[:3]
        job = parts[3] if len(parts) > 3 else None
        dest = os.path.join(ROOT, out)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        os.makedirs(os.path.join(ROOT, 'assets', 'portraits'), exist_ok=True)
        try:
            im, opts = process(kind, fetch(url))
            im.save(dest, 'WEBP', **opts)
            if kind == 'char':
                portrait(im).save(dest.replace('/chars/', '/portraits/'), 'WEBP', quality=86)
            man[out] = {'job': job, 'kind': kind}
            print('ok', out, im.size, os.path.getsize(dest) // 1024, 'KB')
        except Exception as e:
            print('FAIL', out, e)
    json.dump(man, open(MANIFEST, 'w'), indent=1, sort_keys=True)


if __name__ == '__main__':
    main()
