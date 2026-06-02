# Design System Snapshot

Последняя проверка: 2026-06-01

## Назначение

Этот файл фиксирует текущее визуальное состояние проекта Quantix Studio по коду, без редизайна и без изменения существующих компонентов.

Цель:

- зафиксировать текущие дизайн-токены
- упростить дальнейшую работу над UI
- не допустить случайного дрейфа стилей

Это не новый дизайн-гайд, а снимок фактической реализации.

## Источники истины

Основные файлы, по которым собрана схема:

- `src/index.css`
- `tailwind.config.ts`
- `components.json`
- `src/components/ui/*`
- `src/components/landing/*`
- `src/components/admin/*`

Важно:

- `src/App.css` сейчас не подключен к приложению.
- Фактически используется только `src/index.css`, импортируемый из `src/main.tsx`.

## Общая визуальная направленность

Текущий интерфейс построен как:

- только темная тема
- монохромная палитра с белым акцентом
- высокий контраст
- минималистичный SaaS-style UI
- очень умеренное использование теней
- акцент на границах, контрасте и чистой типографике

Система сознательно отключает светлую тему:

- `color-scheme: dark !important`
- `prefers-color-scheme` принудительно сведён к dark

## Цветовая система

Все основные цвета задаются через CSS custom properties в `src/index.css` и используются через HSL.

### Базовые токены

| Токен | HSL | Примерный HEX | Назначение |
|---|---|---|---|
| `--background` | `0 0% 6%` | `#0F0F0F` | основной фон приложения |
| `--foreground` | `0 0% 100%` | `#FFFFFF` | основной текст |
| `--card` | `0 0% 10.5%` | `#1B1B1B` | карточки, панели, стеклянные блоки |
| `--card-foreground` | `0 0% 100%` | `#FFFFFF` | текст на карточках |
| `--popover` | `0 0% 10.5%` | `#1B1B1B` | popover / dialog surfaces |
| `--primary` | `0 0% 100%` | `#FFFFFF` | основной акцент, primary button |
| `--primary-foreground` | `0 0% 6%` | `#0F0F0F` | текст на primary |
| `--secondary` | `0 0% 10.5%` | `#1B1B1B` | secondary surfaces |
| `--secondary-foreground` | `0 0% 100%` | `#FFFFFF` | текст на secondary |
| `--muted` | `0 0% 10.5%` | `#1B1B1B` | тихие поверхности |
| `--muted-foreground` | `0 0% 63%` | `#A0A0A0` | вторичный текст |
| `--accent` | `0 0% 100%` | `#FFFFFF` | hover/focus accent |
| `--accent-foreground` | `0 0% 6%` | `#0F0F0F` | текст на accent |
| `--border` | `0 0% 20%` | `#333333` | все стандартные границы |
| `--input` | `0 0% 20%` | `#333333` | поля ввода |
| `--ring` | `0 0% 100%` | `#FFFFFF` | focus ring |
| `--destructive` | `0 84% 60%` | `#EF4444` | destructive actions / errors |

### Вывод по палитре

- Цветовая система почти полностью grayscale.
- `primary` и `accent` совпадают с белым.
- Брендовый цвет как отдельный token сейчас отсутствует.
- Визуальная иерархия строится больше на контрасте, чем на hue.

## Sidebar-токены

Для sidebar заданы отдельные токены, но по сути они повторяют общую палитру:

- `--sidebar-background = background`
- `--sidebar-foreground = foreground`
- `--sidebar-primary = primary`
- `--sidebar-accent = card`
- `--sidebar-border = border`

То есть sidebar визуально не отделён новой цветовой системой, а живёт внутри общей dark-monochrome схемы.

## Типографика

### Базовый стек

В `body` используется:

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

Важно:

- В проекте нет явного импорта `Inter` через `@import` или `next/font`.
- В `index.html` есть только `preconnect` к Google Fonts.
- Это значит, что `Inter` используется как preferred font, но при отсутствии подхватится системный sans-serif стек.

### Базовые правила

- Основной текст белый на почти чёрном фоне.
- Заголовки: `font-semibold`, `tracking-tight`, `leading-tight`.
- Глобально включены:
  - `-webkit-font-smoothing: antialiased`
  - `-moz-osx-font-smoothing: grayscale`

### Типовые размеры, встречающиеся в интерфейсе

- Hero H1: `text-5xl md:text-7xl`
- Section title: `text-4xl md:text-5xl`
- Section subtitle: `text-lg md:text-xl`
- Card title: `text-2xl`
- Project card title: `text-xl`
- Button text: `text-sm` по умолчанию, иногда `text-lg` для hero CTA
- Badge text: `text-xs`
- Form/input text: `text-base`, на `md` переходит в `text-sm`

### Тональность типографики

- Заголовки плотные, жирные, короткие по строке.
- Secondary copy идёт через `text-muted-foreground`.
- Система не строится на большом количестве font weights: чаще всего используются `font-medium`, `font-semibold`, `font-bold`.

## Контейнеры и layout

### Tailwind container

В `tailwind.config.ts`:

- container centered
- default padding: `2rem`
- `2xl = 1400px`

### Утилита секций

Глобальный класс:

```css
.section-container {
  @apply container mx-auto px-5 sm:px-6 md:px-8 py-20;
}
```

Это даёт базовый ритм секций:

- mobile horizontal padding: `20px`
- `sm`: `24px`
- `md+`: `32px`
- vertical padding section: `80px`

### Часто встречающиеся layout-паттерны

- Navbar: `h-16`
- Hero outer section: `py-32`
- Hero inner container: `py-20`
- Grid gaps:
  - `gap-4`
  - `gap-6`
  - `gap-8`
  - `gap-12`
- Card/internal blocks чаще всего используют `p-6`

### Общая пространственная логика

- Интерфейс дышит за счёт крупных секционных отступов.
- На уровне компонентов используется scale Tailwind без кастомной spacing map.
- Основной rhythm: `4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 80px`.

## Радиусы

Глобальный token:

- `--radius: 0.5rem` = `8px`

Маппинг в Tailwind:

- `rounded-lg = 8px`
- `rounded-md = 6px`
- `rounded-sm = 4px`

Типичные применения:

- Cards: `rounded-lg`
- Dialog: `sm:rounded-lg`
- Inputs: `rounded-md`
- Buttons: `rounded-md`
- Badges: `rounded-full`
- Mobile nav items: `rounded-lg`

## Границы

### Базовая логика

- Почти все элементы получают `border-border`
- Цвет границы: `hsl(var(--border))`
- Визуально это тонкая 1px граница тёмно-серого оттенка

### Где границы играют ключевую роль

- Cards
- Inputs
- Outline buttons
- Dialogs
- Glass navbar
- Hover states project cards

### Поведенческий паттерн

- Тени используются умеренно
- Основное разделение поверхностей построено через `bg-card` + `border`
- При hover часто усиливается именно border/accent, а не shadow

## Тени

Система теней очень сдержанная.

### Используемые паттерны

- Card: `shadow-sm`
- Dialog: `shadow-lg`
- Primary button hover:
  - `hover:shadow-[0_0_0_1px_hsl(var(--accent))]`

### Вывод

- Тень не является главным носителем depth.
- Глубина создаётся в основном через:
  - контраст поверхностей
  - border
  - backdrop blur
  - overlay

## Поверхности

### Card

Базовый card primitive:

- `rounded-lg`
- `border`
- `bg-card`
- `text-card-foreground`
- `shadow-sm`

Стандартные внутренние отступы:

- `CardHeader`: `p-6`
- `CardContent`: `p-6 pt-0`
- `CardFooter`: `p-6 pt-0`

### Dialog

Dialog content:

- `max-w-lg` по умолчанию
- `border`
- `bg-background`
- `p-6`
- `shadow-lg`
- `sm:rounded-lg`

Overlay:

- `bg-black/80`

### Glass surface

Глобальный utility class `.glass`:

- background: `card` с прозрачностью `0.8`
- `backdrop-filter: blur(12px)`
- border: `1px solid hsl(var(--border) / 0.5)`

Используется как ключевой visual pattern для fixed navbar.

## Кнопки

### Базовая форма

Базовый button primitive:

- `inline-flex`
- `items-center`
- `justify-center`
- `gap-2`
- `rounded-md`
- `text-sm`
- `font-medium`
- `transition-colors`

### Размеры

- default: `h-10 px-4 py-2`
- sm: `h-9 px-3`
- lg: `h-11 px-8`
- icon: `h-10 w-10`

### Варианты

`default`:

- белый фон
- чёрный текст
- hover: белый с прозрачностью `0.9`
- hover accent-like outline shadow

`outline`:

- border + background
- hover уходит в accent

`secondary`:

- card-like dark surface

`ghost`:

- спокойный hover-fill

`destructive`:

- красный destructive token

### Визуальная роль

- Главные CTA в проекте почти всегда белые.
- Secondary CTA чаще строятся как `outline`.

## Формы

### Input

Базовый input:

- `h-10`
- `rounded-md`
- `border border-input`
- `bg-background`
- `px-3 py-2`
- placeholder через `text-muted-foreground`
- фокус через `focus-visible:ring-2 focus-visible:ring-ring`

### Form feel

- Формы не декоративные.
- Стиль ближе к clean-admin / production-ui, чем к marketing flourish.

## Badge

Badge primitive:

- `rounded-full`
- `border`
- `px-2.5 py-0.5`
- `text-xs`
- `font-semibold`

В проекте badge используется как:

- category label
- tool label
- lightweight metadata marker

## Сетка и карточки контента

### Portfolio / project cards

Типовой паттерн:

- карточка с `overflow-hidden`
- preview image в `aspect-video`
- border + hover border accent
- заголовок `text-xl font-semibold`
- description `text-sm text-muted-foreground`
- tools как outline badges

### Admin blocks

Чаще всего:

- page header с `text-3xl font-bold`
- supporting copy в `text-muted-foreground`
- action button справа
- table/card body ниже с `space-y-6`

## Motion и transitions

### Базовые transition-паттерны

- `transition-colors duration-300`
- `transition-opacity`
- локальные `ease-out`

### Зафиксированные анимации

`section-highlight`

- duration: `1.2s`
- use: мягкое выделение секции после scroll/hash navigation

`scroll-reveal`

- duration: `0.6s`
- effect: `translateY + scale + fade`

`nav-link underline`

- duration: `0.3s ease-out`
- underline grows from `0` to `100%`

`scroll-left`

- duration: `40s linear infinite`
- use: tools carousel
- hover: `animation-play-state: paused`

`accordion`

- `0.2s ease-out`

### Motion-характер

- Motion в проекте функциональный, не декоративный.
- Главные эффекты: reveal, underline, smooth emphasis, marquee.

## Иконки

- Основной набор: `lucide-react`
- Иконки чаще всего:
  - `h-4 w-4`
  - `h-5 w-5`
  - `h-6 w-6`

В buttons и compact controls иконка почти всегда живёт рядом с текстом и не доминирует над ним.

## Навигация

Navbar:

- fixed top
- glass surface
- высота `64px`
- desktop nav центрируется через `absolute left-1/2 -translate-x-1/2`
- mobile menu раскрывается как stacked list с `rounded-lg` hover states

Поведенчески:

- активные пункты подчеркиваются цветом и underline-анимацией
- auth UI для public flow отключен комментариями, но инфраструктура авторизации сохранена

## Контраст и accessibility

Текущее решение в целом держится на сильном контрасте:

- белый текст на почти чёрном фоне
- focus ring белый
- muted text серый, но не слишком низкоконтрастный

Что уже есть:

- видимый focus ring на интерактивных шадсн-примитивах
- семантические button/input/dialog patterns
- overlay/dialog separation

Что важно сохранять:

- не заменять видимый focus на декоративный слабый glow
- не уводить muted text в слишком низкий contrast
- не добавлять цвет как единственный носитель смысла

## Что считать текущим design baseline

Если нужно делать новые экраны без редизайна, baseline сейчас такой:

- dark-only interface
- background `#0F0F0F`
- surface `#1B1B1B`
- text mostly white
- accent = white
- radius = 8px base
- border-driven separation
- shadows sparse
- large section spacing
- Inter/system sans stack
- clean SaaS/admin visual language

## Что не менять автоматически

Этот документ не является разрешением на массовую нормализацию UI.

Без отдельной задачи не нужно автоматически:

- включать светлую тему
- менять палитру
- заменять Inter stack
- переписывать spacing scale
- переводить проект на новый design system
- удалять текущие utility classes ради "чистоты"

## Технические замечания

- `components.json` указывает `style: default`, `baseColor: slate`, `cssVariables: true`, но фактическая палитра уже полностью переопределена в `src/index.css`.
- Реальная дизайн-система живёт не в дефолтном shadcn preset, а в локальных CSS variables проекта.
- Если в будущем обновлять визуальную систему, сначала обновлять этот файл, затем токены в `src/index.css`, потом примитивы и feature-компоненты.
