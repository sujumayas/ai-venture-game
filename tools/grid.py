#!/usr/bin/env python3
"""Overlay a labelled coordinate grid on an image (for placing hotspots). Usage: grid.py in.webp out.jpg [step]"""
import sys
from PIL import Image, ImageDraw, ImageFont
im = Image.open(sys.argv[1]).convert('RGB')
step = int(sys.argv[3]) if len(sys.argv) > 3 else 100
d = ImageDraw.Draw(im)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except Exception:
    font = ImageFont.load_default()
for x in range(0, im.width, step):
    d.line([(x, 0), (x, im.height)], fill=(255, 255, 0) if x % 500 == 0 else (0, 255, 255), width=1)
    d.text((x + 3, 3), str(x), fill=(255, 255, 0), font=font, stroke_width=2, stroke_fill=(0, 0, 0))
for y in range(0, im.height, step):
    d.line([(0, y), (im.width, y)], fill=(255, 255, 0) if y % 500 == 0 else (0, 255, 255), width=1)
    d.text((3, y + 3), str(y), fill=(255, 255, 0), font=font, stroke_width=2, stroke_fill=(0, 0, 0))
im.thumbnail((1600, 1600))
im.save(sys.argv[2], quality=80)
