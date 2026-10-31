"""Собирает папку dist (запуск:  python3 tools/build.py).

dist/ne_moy_tip.html  - страница, подключает style.css, imgs.js и aka3000.js
dist/style.css        - стили
dist/imgs.js          - картинки (const IMG = {...}) из data/imgs.json
dist/aka3000.js       - вся логика игры (src/js/*.js по порядку из ORDER)
"""

import json, os, shutil

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = lambda *a: os.path.join(root, *a)
read = lambda *a: open(p(*a), encoding="utf-8").read()
ORDER = [
    "audio.js",
    "art.js",
    "art2.js",
    "engine.js",
    "minis.js",
    "minis2.js",
    "script.js",
    "boot.js",
]
os.makedirs(p("dist"), exist_ok=True)

shutil.copyfile(p("src", "html", "ne_moy_tip.html"), p("dist", "ne_moy_tip.html"))
shutil.copyfile(p("src", "css", "style.css"), p("dist", "style.css"))

imgs = json.load(open(p("data", "imgs.json"), encoding="utf-8"))
open(p("dist", "imgs.js"), "w", encoding="utf-8").write(
    "const IMG = " + json.dumps(imgs) + ";\n"
)

js = "\n".join(read("src", "js", f) for f in ORDER)
# как и в одностраничной версии, файл не должен начинаться с директивы 'use strict'
js = js.removeprefix("'use strict';\n")
open(p("dist", "aka3000.js"), "w", encoding="utf-8").write(js)
print("ok:", ", ".join(sorted(os.listdir(p("dist")))))
