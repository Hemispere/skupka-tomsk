/*
 * Яндекс.Метрика: счётчик + цели.
 *
 * КАК ПОДКЛЮЧИТЬ:
 * 1. Зарегистрировать счётчик на https://metrika.yandex.ru (бесплатно),
 *    указать адрес сайта, получить номер (8 цифр).
 * 2. Вписать номер вместо 0 в METRIKA_ID ниже — это единственное место.
 * 3. В веб-интерфейсе Метрики цели создаются автоматически не нужно —
 *    они заводятся как «JavaScript-событие» с идентификаторами из goal() ниже.
 *
 * Пока METRIKA_ID = 0, код ничего не загружает и не ломает сайт.
 */
export const METRIKA_ID = 111774742

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void
  }
}

let inited = false

export function initMetrika() {
  if (!METRIKA_ID || inited || typeof window === 'undefined') return
  inited = true
  /* eslint-disable @typescript-eslint/no-explicit-any */
  ;(function (m: Window, e: Document, t: string, r: string, i: string) {
    const w = m as any
    w[i] =
      w[i] ||
      function (...args: unknown[]) {
        ;(w[i].a = w[i].a || []).push(args)
      }
    w[i].l = Date.now()
    const k = e.createElement(t) as HTMLScriptElement
    const a = e.getElementsByTagName(t)[0]
    k.async = true
    k.src = r
    a.parentNode?.insertBefore(k, a)
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

  window.ym?.(METRIKA_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  })
}

/** Идентификаторы целей — заводятся в Метрике как JS-события с этими именами */
export type GoalName =
  | 'phone_click' // звонок (шапка, контакты, подвал)
  | 'whatsapp_click' // любая кнопка WhatsApp
  | 'telegram_click'
  | 'vk_click'
  | 'gis_click'
  | 'buyback_cta' // «Продать технику» на hero
  | 'repair_cta' // «Нужен ремонт» на hero

export function goal(name: GoalName) {
  if (!METRIKA_ID || typeof window.ym !== 'function') return
  window.ym(METRIKA_ID, 'reachGoal', name)
}
