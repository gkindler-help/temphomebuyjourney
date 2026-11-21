"""Build assets/data/repair-costs-2026.json from the repair cost guide's two cost tables.

The guide (articles/stl-home-repair-cost-guide.html) owns St. Louis repair cost ranges.
This file is the one dataset the inspection negotiation worksheet reads, so the
calculator and the article never disagree. Re-run after changing either table.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUIDE = ROOT / 'articles' / 'stl-home-repair-cost-guide.html'
OUT = ROOT / 'assets' / 'data' / 'repair-costs-2026.json'
MONTHS = 'January February March April May June July August September October November December'.split()


def text(cell):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', cell)).split())


def money(s):
    return int(s.replace('$', '').replace(',', ''))


def main():
    s = GUIDE.read_text(encoding='utf-8')
    items = []
    for t, table in enumerate(re.findall(r'<table.*?</table>', s, re.S)[:2]):
        for row in re.findall(r'<tr.*?</tr>', table, re.S):
            cells = [text(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', row, re.S)]
            if len(cells) < 2:
                continue
            nums = re.findall(r'\$[\d,]+', cells[1])
            if len(nums) < 2:
                continue
            name = cells[0]
            lo, hi = money(nums[0]), money(nums[1])
            if any(i['item'] == name or ((name.startswith(i['item']) or i['item'].startswith(name)) and (i['low'], i['high']) == (lo, hi)) for i in items):
                continue
            items.append({
                'item': name,
                'low': money(nums[0]),
                'high': money(nums[1]),
                'open_ended': cells[1].rstrip().endswith('+'),
                'per_unit': 'per ' in cells[1],
                'note': cells[2] if len(cells) > 2 else '',
            })
    m = re.search(r'class="last-updated">Last updated (\w+) (\d+), (\d{4})', s)
    updated = '%s-%02d-%02d' % (m.group(3), MONTHS.index(m.group(1)) + 1, int(m.group(2))) if m else None
    data = {
        'source': 'STL Home Journey, St. Louis repair cost guide: 2026 expected costs',
        'source_url': '/articles/stl-home-repair-cost-guide',
        'updated': updated,
        'items': [i for i in items if not i['per_unit']],
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print('%s: %d items, guide updated %s' % (OUT.relative_to(ROOT), len(data['items']), updated))


if __name__ == '__main__':
    main()
