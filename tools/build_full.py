#!/usr/bin/env python3
"""Build tests/walkthroughs/full.json: one uninterrupted playthrough of the whole game, splicing each tale's
walkthrough into its chapter's frame walkthrough at the 'endtale' marker."""
import json, os
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tests', 'walkthroughs')
CH = [('prologue', None), ('ch1', 'priest'), ('ch2', 'soldier'), ('ch3', 'poet'), ('ch4', 'scholar'), ('ch5', 'detective'), ('ch6', 'consul'), ('epilogue', None)]
full = []
for i, (ch, tale) in enumerate(CH):
    steps = json.load(open(os.path.join(D, ch + '.json')))
    if i > 0 and steps[0][0] == 'start':
        steps = steps[1:]          # the previous chapter already chains into this one
    if tale:
        tsteps = json.load(open(os.path.join(D, tale + '.json')))
        tsteps = [s for s in tsteps if s[0] != 'tale']
        # drop the tale's own final "expect player consul" (frame continues)
        while tsteps and tsteps[-1][0] == 'expect':
            tsteps.pop()
        k = next(j for j, s in enumerate(steps) if s[0] == 'endtale')
        steps = steps[:k] + [['expect', {'tale': tale}]] + tsteps + steps[k + 1:]
    # within the full run, drop "expect chapter" checks that only hold for stubs? keep all.
    full += steps
json.dump(full, open(os.path.join(D, 'full.json'), 'w'), indent=0)
print(len(full), 'steps')
