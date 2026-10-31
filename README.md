# Не мой тип

Визуальная новелла. Папка `dist/` — готовая игра из отдельных файлов, открывается двойным кликом по `not_my_type.html`.

```
src/
  html/not-my-type.html   страница (подключает style.css, imgs.js, aka3000.js)
  css/style.css          стили
  js/                    audio, art, art2, engine, minis, minis2, script, boot
data/imgs.json           картинки (base64)
tools/build.py           сборка dist/
dist/
  not_my_type.html        страница
  style.css              стили
  imgs.js                картинки: const IMG = {...}
  aka3000.js             вся логика игры (src/js/* по порядку)
```

Сборка: `python3 tools/build.py`. Порядок подключения JS задан списком `ORDER` в `tools/build.py`.
Скрипты в HTML подключаются в порядке `imgs.js` → `aka3000.js`, менять порядок нельзя.
Форматирование: Prettier, настройки в `.prettierrc.json`.
