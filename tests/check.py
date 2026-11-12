#!/usr/bin/env python3
"""Physics Lab regression check (not shipped with the app; lives next to the PL folder).
   Per sim and per phone size it checks: no dock/monitor/page scroll, no clipped dock text, no console errors,
   every 3D label >= 11 px tall and inside the screen.
   Run:   pip install playwright && playwright install chromium
          python3 tests/check.py                      # all sims, 4 phone sizes
          python3 tests/check.py magnet10 sound9      # only these sims
          SIZES=390x844 python3 tests/check.py        # only these sizes
   Exit code 0 = all good, 1 = something failed (details printed). A full run is slow: run a few sims per command."""
import os, re, sys, threading, http.server, functools
from playwright.sync_api import sync_playwright
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); PORT = int(os.environ.get('PORT', 8765))
SIZES = [tuple(map(int, s.split('x'))) for s in os.environ.get('SIZES', '390x844,844x390,360x740,667x375').split(',')]
ids = sys.argv[1:] or re.findall(r'id: "(\w+)"', open(os.path.join(ROOT, 'syllabus.js')).read())
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
H = functools.partial(Quiet, directory=ROOT)
srv = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
SCROLL = """()=>{const q=s=>document.querySelector(s),d=q('#dock'),o=q('.opts'),m=q('#mon'),R=document.documentElement,bad=[];
 const add=(n,v)=>v>0&&bad.push(n+' +'+v);
 add('dock-v',d.scrollHeight-d.clientHeight);add('dock-h',d.scrollWidth-d.clientWidth);add('opts-v',o?o.scrollHeight-o.clientHeight:0);
 add('monitor-v',m.scrollHeight-m.clientHeight);add('page-h',R.scrollWidth-innerWidth);add('page-v',R.scrollHeight-innerHeight);
 const dr=d.getBoundingClientRect();
 d.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width||e.closest('[hidden]'))return;
  if(r.right>dr.right+.6||r.bottom>dr.bottom+.6)bad.push('outside dock: '+(e.className||e.tagName));
  if(e.matches('.nm,.vl,.seg button,.tgl,.chip')&&e.scrollWidth>e.clientWidth+1)bad.push('clipped text: '+e.textContent.slice(0,16));});
 return bad}"""
LABELS = """async()=>{const {view}=await import('/scene.js'),w=document.getElementById('cv').clientWidth,bad=[];
 for(const s of view.labelList){if(!s.visible||!s.fs||s.wpx<1)continue;
  if(s.px<11)bad.push('label too small '+s.px.toFixed(1)+'px');
  if(s.sx-s.wpx/2<-1||s.sx+s.wpx/2>w+1)bad.push('label off screen');}
 return bad}"""
fails = 0
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for sid in ids:
        for w, h in SIZES:
            pg = b.new_page(viewport={'width': w, 'height': h}); errs = []
            pg.on('pageerror', lambda e: errs.append('js error: ' + str(e))); pg.on('console', lambda m: errs.append('console error: ' + m.text) if m.type == 'error' else None)
            pg.goto(f'http://127.0.0.1:{PORT}/lab.html?sim={sid}'); pg.wait_for_timeout(1000)
            bad = errs + pg.evaluate(SCROLL) + pg.evaluate(LABELS); pg.close()
            print(('FAIL ' if bad else 'ok   ') + f'{sid} {w}x{h}', '; '.join(bad)); fails += bool(bad)
    b.close()
print('FAILED:', fails) if fails else print('ALL OK'); sys.exit(1 if fails else 0)
