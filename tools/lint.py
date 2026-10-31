#!/usr/bin/env python3
"""Static content lint: single-language t() calls, missing asset files, suspicious Spanish words.

Usage: python3 tools/lint.py
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'js', 'content')
problems = 0


def report(f, line, msg):
    global problems
    problems += 1
    print(f'{os.path.relpath(f, ROOT)}:{line}: {msg}')


STR = r"""(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)"""
single_t = re.compile(r'(?<![\w.])t\(\s*' + STR + r'\s*\)')
asset = re.compile(r"""['"`](assets/[^'"`$]+\.(?:webp|png|jpg))['"`]""")
pair = re.compile(r'(?<![\w.])t\(\s*(' + STR + r')\s*,\s*(' + STR + r')\s*\)', re.S)
bad_es = re.compile(r'\b(coger|cogí|coge|cojo)\b', re.I)

for dp, _, fs in os.walk(CONTENT):
    for fn in fs:
        if not fn.endswith('.js'):
            continue
        f = os.path.join(dp, fn)
        src = open(f, encoding='utf8').read()
        for m in single_t.finditer(src):
            report(f, src[:m.start()].count('\n') + 1, 'single-language t(): ' + m.group(0)[:80])
        for m in asset.finditer(src):
            if not os.path.exists(os.path.join(ROOT, m.group(1))):
                report(f, src[:m.start()].count('\n') + 1, 'missing asset ' + m.group(1))
        for m in pair.finditer(src):
            en, es = m.group(1)[1:-1], m.group(2)[1:-1]
            ln = src[:m.start()].count('\n') + 1
            if bad_es.search(es):
                report(f, ln, 'avoid "coger" in Spanish: ' + es[:60])
            if en == es and len(en.split()) >= 3 and not en.startswith('<'):
                report(f, ln, 'identical EN/ES text: ' + en[:60])
            if len(en) > 300 and not en.lstrip().startswith('<'):
                report(f, ln, f'long string ({len(en)} chars), consider splitting: ' + en[:50])

print(f'{problems} problem(s)')
sys.exit(1 if problems else 0)
