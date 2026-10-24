#!/usr/bin/env python3
"""Tell IndexNow (Bing, Copilot, DuckDuckGo, Yandex and others) which pages changed.

Usage:
  python3 scripts/indexnow.py --changed <git-range>   # pages whose .html changed in that range
  python3 scripts/indexnow.py --all                  # every URL in sitemap.xml
  python3 scripts/indexnow.py <url> [<url> ...]
Add --dry-run to print the URLs without sending.

Only URLs listed in sitemap.xml are sent, so redirects and internal files never go out.
The key file lives at the site root as <key>.txt, which is how IndexNow verifies ownership.
"""
import glob, json, os, re, subprocess, sys, urllib.error, urllib.request

HOST = "stlhomejourney.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENDPOINT = "https://api.indexnow.org/indexnow"

def key():
    files = [f for f in glob.glob(os.path.join(ROOT, "*.txt")) if re.fullmatch(r"[0-9a-f]{32}\.txt", os.path.basename(f))]
    if len(files) != 1:
        sys.exit("expected exactly one IndexNow key file (<32 hex>.txt) at the repo root")
    return os.path.basename(files[0])[:-4]

def sitemap_urls():
    with open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8") as f:
        return re.findall(r"<loc>\s*(\S+?)\s*</loc>", f.read())

def url_for(path):
    """articles/foo.html -> https://stlhomejourney.com/articles/foo ; index.html -> /"""
    p = path[:-5] if path.endswith(".html") else path
    if p == "index":
        p = ""
    elif p.endswith("/index"):
        p = p[: -len("index")]
    return f"https://{HOST}/{p}"

def changed(rng):
    out = subprocess.run(["git", "-C", ROOT, "diff", "--name-only", "--diff-filter=AM", rng, "--", "*.html"],
                         capture_output=True, text=True, check=True).stdout.split()
    return [url_for(p) for p in out]

def main(argv):
    dry = "--dry-run" in argv
    argv = [a for a in argv if a != "--dry-run"]
    known = sitemap_urls()
    if argv[:1] == ["--all"]:
        urls = known
    elif argv[:1] == ["--changed"] and len(argv) == 2:
        urls = changed(argv[1])
    else:
        urls = argv
    allowed = set(known)
    urls = sorted({u for u in urls if u in allowed or u.rstrip("/") in allowed})
    if not urls:
        print("nothing to submit"); return
    k = key()
    body = {"host": HOST, "key": k, "keyLocation": f"https://{HOST}/{k}.txt", "urlList": urls}
    print(f"{len(urls)} URL(s):"); print("\n".join("  " + u for u in urls))
    if dry:
        return
    ua = {"User-Agent": "stlhomejourney-indexnow/1.0"}
    # IndexNow answers 403 when it can't read the key file, so check it is live first.
    try:
        with urllib.request.urlopen(urllib.request.Request(body["keyLocation"], headers=ua), timeout=30) as r:
            live = r.read().decode().strip()
        print("key file:", r.status, "matches" if live == k else f"DOES NOT MATCH ({live[:40]!r})")
    except urllib.error.HTTPError as e:
        print("key file not reachable:", e.code, body["keyLocation"])
    req = urllib.request.Request(ENDPOINT, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json; charset=utf-8", **ua})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print("IndexNow response:", r.status)
    except urllib.error.HTTPError as e:
        sys.exit(f"IndexNow refused: {e.code} {e.read().decode(errors='replace')[:500]}")

if __name__ == "__main__":
    main(sys.argv[1:])
