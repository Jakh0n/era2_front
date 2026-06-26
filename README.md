# ERA2 — Очередь генераций

Клиентская страница **«Очередь генераций»** с живым мок-движком: задачи продвигаются по статусам, прогресс растёт в реальном времени, часть задач падает с ошибкой. Бэкенда нет — все данные и асинхронность эмулируются на клиенте.

**Маршрут:** `/queue`  
**Глобальный индикатор:** `GenerationStatusBar` — виден на любой странице, пока есть `queued` / `running` задачи.

---

## Запуск

```bash
npm install
npm run dev      # http://localhost:8080
npm test         # vitest — 15 unit-тестов
npm run build    # production-сборка
```

---

## Выполнение требований ТЗ

Ниже — краткое соответствие спецификации (`тз.md`) и реализации.

### §3 — Мок-движок очереди

| Требование                             | Реализация                                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Макс. 2 параллельных `running`         | `MAX_CONCURRENT = 2` в `lib/queueConstants.ts`; FIFO-продвижение через `pickTasksToStart()` в `lib/queueEnginePure.ts` |
| Прогресс тиками → `done`               | `queueEngine.ts` шлёт `TICK_PROGRESS`; при 100% — `COMPLETE` в `queueReducer.ts`                                       |
| ~15% случайных `failed`                | `FAIL_RATE = 0.15`, три варианта сообщений в `queueConstants.ts`                                                       |
| video/audio медленнее text/image       | `getProgressStep()` — video/audio +2–6 за тик, text/image +8–15                                                        |
| Чистка таймеров / cancel без «дотиков» | `engine.stop()` и `abortTask()` перед `CANCEL`                                                                         |
| Единый источник правды                 | `useReducer` + `QueueProvider`; движок только диспатчит actions                                                        |
| Сид 8–12 задач                         | 10 задач в `entities/generation-task/model/seed.ts` (running, queued, done, failed, canceled)                          |

### §4.1 — Шапка экрана

- Заголовок «Очередь генераций» + подзаголовок — `ui/QueueHeader.tsx`
- «Очистить готовые» с подтверждением (`AlertDialog`) — action `CLEAR_DONE`

### §4.2 — Сводка (4 счётчика)

- Карточки **В очереди / Идёт / Готово / Ошибка** — `ui/QueueStats.tsx`
- Значения реактивны через `selectStats()` в `model/selectors.ts`

### §4.3 — Тулбар

- Фильтр по статусу (чипы) — `ui/QueueToolbar.tsx`
- Сортировка: сначала новые / старые
- Поиск по промпту с debounce 300 ms

### §4.4 — Список задач

- Desktop: строка (`TaskRow.tsx`), mobile: карточка (`TaskCard.tsx`)
- Иконка/превью по типу, промпт, модель, ETA/кредиты/позиция в очереди
- Прогресс-бар для `running`, текст ошибки для `failed`
- Действия по статусу: отмена, повтор, скачать (заглушка), удалить — `TaskActions.tsx` + `lib/taskRules.ts`

### §4.5 — Состояния экрана

| Состояние                        | Компонент                 | Как проверить                          |
| -------------------------------- | ------------------------- | -------------------------------------- |
| Загрузка (~600 ms)               | `states/LoadingState.tsx` | Открыть `/queue`                       |
| Пустое / нет результатов фильтра | `states/EmptyState.tsx`   | Очистить все задачи или сузить фильтр  |
| Ошибка загрузки                  | `states/ErrorState.tsx`   | `/queue?failQueueLoad=1` → «Повторить» |

### §4.6 — Адаптив

- **≥1024px** — строки списка, статистика 4 колонки
- **<1024px** — карточки, статистика 2×2, горизонтальный скролл чипов
- Breakpoint: `min-[1024px]` в `TaskRow` / `TaskCard` / `QueueStats`

### §4.7 — Персистентность

- Ключ `localStorage`: `era2_generation_queue`
- Сохраняются задачи + filter / sort / search
- При reload `running` → `queued`, `progress: 0` (таймеры в памяти вкладки теряются)
- Логика: `lib/queuePersistence.ts` → `normalizeRestoredTasks()`

### §4.8 — Глобальный статус-бар

- `GenerationStatusBar` смонтирован в `app/App.tsx` внутри `QueueProvider`
- 0 активных → скрыт; 1 → компактная карточка; 2+ → панель с «Открыть очередь →»
- Collapsed-пилюля (бонус) — сворачивание по клику
- Desktop: снизу-справа; mobile: полноширинная панель с safe-area
- Клик → переход на `/queue`; тот же стор, что и страница очереди

### Бонус (§6)

- **15 unit-тестов** (vitest): `model/queueReducer.test.ts`, `model/queueEngine.test.ts`
- Покрытие: лимит слотов, FIFO, cancel, переходы статусов, COMPLETE / FAIL

---

## Архитектура (FSD)

```
app/          — QueueProvider + GenerationStatusBar, роутинг
pages/        — QueuePage (тонкая обёртка)
widgets/      — GenerationQueue (композиция экрана)
features/
  generation-queue/
    model/    — reducer, engine, selectors, provider, useQueue
    lib/      — константы, pure-функции движка, persistence, правила UI
    ui/       — презентационные компоненты (без бизнес-логики)
entities/
  generation-task/ — типы домена + стартовый сид
```

**Импорты:** снаружи слайса — только через `@/features/generation-queue` (`index.ts`). Deep-import запрещён.

| Что проверяю                           | Где смотреть                                      |
| -------------------------------------- | ------------------------------------------------- |
| Конечный автомат статусов              | `model/queueReducer.ts`                           |
| Лимит слотов, таймеры, сбои            | `model/queueEngine.ts` + `lib/queueEnginePure.ts` |
| Счётчики / фильтр / сортировка / поиск | `model/selectors.ts`                              |
| Персистентность                        | `lib/queuePersistence.ts`                         |
| Правила UI (действия, мета)            | `lib/taskRules.ts`                                |
| Сборка экрана                          | `widgets/generation-queue/ui/GenerationQueue.tsx` |

---

## Роутинг

Лёгкий клиентский роутер: `Record<path, Component>` в `app/router/index.tsx`.

```
/queue  →  QueuePage  →  GenerationQueue (widget)
```

`QueueProvider` оборачивает всё приложение — статус-бар и страница очереди читают один стор.

---

## Константы движка

| Константа        | Значение                 | Файл                    |
| ---------------- | ------------------------ | ----------------------- |
| `MAX_CONCURRENT` | 2                        | `lib/queueConstants.ts` |
| `FAIL_RATE`      | 0.15                     | `lib/queueConstants.ts` |
| `TICK_MS`        | `{ min: 400, max: 700 }` | `lib/queueConstants.ts` |
| `INIT_DELAY_MS`  | 600                      | `lib/queueConstants.ts` |

---

## Тесты

```bash
npm test
```

| Файл                         | Что проверяет                                |
| ---------------------------- | -------------------------------------------- |
| `model/queueReducer.test.ts` | Переходы статусов, позиции в очереди         |
| `model/queueEngine.test.ts`  | Лимит 2 слота, FIFO, cancel, COMPLETE / FAIL |

Тесты лежат рядом с исходниками (colocated) — внутри FSD-слайса `features/generation-queue`.

---

## Быстрая проверка перед сдачей

1. `localStorage.removeItem('era2_generation_queue')` + reload → статус-бар появляется внизу
2. `/queue` — экран очереди, счётчики обновляются
3. `/queue?failQueueLoad=1` — ошибка + «Повторить»
4. `npm test` — 15/15
5. `npm run build` — без ошибок

---

## Шрифты

Основной — **Geist** / **Geist Mono** (`@fontsource-variable/geist`).
