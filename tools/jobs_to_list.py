#!/usr/bin/env python3
"""Turn a jobs_wait JSON result (stdin) into a fetch list. Args: index:kind:path ...  Prints list lines."""
import sys, json
data = json.load(sys.stdin)
m = {}
for a in sys.argv[1:]:
    i, k, p = a.split(':', 2)
    m[int(i)] = (k, p)
for j in data['jobs']:
    if j['index'] in m and j.get('result_url'):
        k, p = m[j['index']]
        print(k, p, j['result_url'], j['job_id'])
    elif j['index'] in m:
        print('#', j['index'], j['status'], file=sys.stderr)
