# AI-стек проекта (внедрён из разборов видео про Claude Code)

Общие знания вынесены в **глобальные скиллы** (`~/.claude/skills`) — работают во всех проектах сразу.

## 1. Скиллы разработки (Matt Pocock, глобально)
Полный цикл: `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` → `/code-review`.
Плюс: `/tdd`, `/diagnosing-bugs`, `/research`, `/domain-modeling`, `/codebase-design`, `/wayfinder`, `/triage`.
`/autopilot` — прогоняет весь цикл одной командой (каждый тикет = отдельный субагент в чистом контексте).
Принцип: большую задачу дроби на тикеты, каждый — в чистом контексте.

## 2. Дизайн-скиллы (глобально) — «Claude как веб-дизайнер»
- **`emil-design-eng`** (Emil Kowalski) — философия UI-полировки, анимации, easing, spring, компоненты.
- `apple-design`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-vocabulary`, `pick-ui-library` — вся линейка Emil Kowalski.
- **`impeccable`** (pbakaus) — мощный дизайн-тулкит: OKLCH-цвет, анти-слоп правила, interaction states, live-итерация в браузере. ⚠️ содержит исполняемые `.mjs`-скрипты (запускаются только при вызове скилла).
- **`taste`** — реверс-инжиниринг дизайна ЛЮБОГО сайта: даёшь URL → получаешь токены (цвета/шрифты/отступы) + «почему так». Вдохновение с реальных сайтов вместо generic-дизайна.
Вызов: «сделай лендинг премиально», «/taste <url>», «убери AI-slop», «отревьюь анимации».

## 3. Память проекта — LLM Wiki (глобальный скилл `llm-wiki`)
`wiki/`: `index.md` (оглавление) + `entities/` (факты) + `concepts/` (выводы) + `log.md`. Агент читает индекс, затем нужные листы.

## 4. Мультиагентные системы (глобальный скилл `agentic-system`)
Субагенты → `.claude/agents/`, оркестраторы → `.claude/commands/`. Стадии аналитика→синтез→стратегия.

## 5. Внешние инструменты (MCP) — шаблон `.mcp.json.example`
Активация: `cp .mcp.json.example .mcp.json` (после экспорта нужных ключей).
- **Exa Search** — веб-поиск для агентов ⚠️ нужен `EXA_API_KEY` (exa.ai). *Подключён user-scope.*
- **Firecrawl** — парсинг сайтов в Markdown ⚠️ нужен `FIRECRAWL_API_KEY` (firecrawl.dev) + баланс кредитов.
- **Playwright** — управление браузером (Claude сам строит и ТЕСТИРУЕТ сайт). Бесплатно, без ключа.
- **Figma** — дизайн из макетов Figma ⚠️ нужен `FIGMA_API_KEY` (либо официальный Figma Dev Mode MCP в десктоп-Figma).

## 6. Pencil — дизайн из Claude Code  ⚠️ desktop-приложение, ставится вручную
Бесплатно, `pencil.dev`. Генерирует баннеры/дизайн параллельными агентами.

---
*Что НЕ внедрено за оператора: API-ключи Exa/Firecrawl/Figma и десктоп-приложения (Pencil, Figma Dev Mode). Всё остальное (скиллы + шаблоны MCP) внедрено.*
