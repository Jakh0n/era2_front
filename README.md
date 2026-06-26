# ERA2 — Очередь генераций

## Запуск

```bash
npm install
npm run dev
```

## Архитектура (FSD)

```
app/          — QueueProvider + GenerationStatusBar (глобально), роутинг
pages/        — QueuePage (тонкая обёртка)
widgets/      — GenerationQueue (композиция экрана)
features/
  generation-queue/
    model/    — reducer, engine, selectors, persistence, useQueue
    lib/      — константы, чистые функции, лейблы, правила UI
    ui/       — презентационные компоненты (без бизнес-логики)
entities/
  generation-task/ — типы домена + стартовый сид
```

**Импорты:** снаружи слайса — только через `@/features/generation-queue` (`index.ts`). Deep-import (`@/features/generation-queue/ui/...`) запрещён.

**Слои ответственности (карта ревью из ТЗ):**

| Что                                  | Где                                               |
| ------------------------------------ | ------------------------------------------------- |
| Конечный автомат статусов            | `model/queueReducer.ts`                           |
| Лимит слотов, таймеры, сбои          | `model/queueEngine.ts` + `lib/queueEnginePure.ts` |
| Счётчики / фильтр / сортировка       | `model/selectors.ts`                              |
| Константы движка                     | `lib/queueConstants.ts`                           |
| Персистентность                      | `lib/queuePersistence.ts`                         |
| Правила отображения (действия, мета) | `lib/taskRules.ts`                                |
| Вёрстка                              | `ui/`                                             |
| Сборка экрана                        | `widgets/generation-queue/ui/GenerationQueue.tsx` |

## Роутинг

Используется лёгкий клиентский роутер (`shared/routing`): `Record<path, Component>` в `app/router/index.tsx`.

- `/queue` → `QueuePage` → виджет `GenerationQueue`
- `GenerationStatusBar` смонтирован в `App.tsx` поверх всех страниц и ведёт на `/queue` по клику (пока есть `queued` / `running` задачи)

`QueueProvider` оборачивает всё приложение, чтобы статус-бар и страница очереди читали один стор.

### Ошибка загрузки (§4.5)

Для демо сбоя инициализации откройте `/queue?failQueueLoad=1` — появится `ErrorState` с кнопкой «Повторить». Уберите query-параметр и нажмите «Повторить» для успешной загрузки.

## Персистентность (§4.7)

Ключ `localStorage`: `era2_generation_queue`.

**Сохраняется:** задачи + UI-настройки (фильтр, сортировка, поиск).

**Восстановление:** `QueueProvider` → `readPersistedState()` → `HYDRATE` в редьюсер. Нет данных — стартовый сид (`GENERATION_TASK_SEED`).

**Повреждённые данные:** невалидный JSON/схема → ключ удаляется, fallback на сид.

### Почему `running` → `queued` при перезагрузке

Тики прогресса — `setTimeout` в памяти вкладки. После reload интервалы и слоты теряются, продолжить «середину» генерации нельзя. При гидратации `running` переводятся в `queued` с `progress: 0`; движок подхватывает их заново по FIFO (`MAX_CONCURRENT = 2`).

Логика: `lib/queuePersistence.ts` → `normalizeRestoredTasks`.

## Константы движка

| Константа        | Значение                 | Файл                    |
| ---------------- | ------------------------ | ----------------------- |
| `MAX_CONCURRENT` | 2                        | `lib/queueConstants.ts` |
| `FAIL_RATE`      | 0.15                     | `lib/queueConstants.ts` |
| `TICK_MS`        | `{ min: 400, max: 700 }` | `lib/queueConstants.ts` |

## Шрифты

Основной — **Geist** / **Geist Mono** (`@fontsource-variable/geist`).
