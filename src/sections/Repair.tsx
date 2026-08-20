import Reveal from '@/components/Reveal'
import { goal } from '@/lib/metrika'

const PRICES: { name: string; price: string; note?: string }[] = [
  { name: 'Диагностика', price: '1 ₽', note: 'бесплатно при ремонте' },
  { name: 'Чистка с заменой термопасты', price: '1 000 ₽' },
  { name: 'Ремонт / замена клавиатуры', price: 'от 1 500 ₽' },
  { name: 'Ремонт корпуса и петель', price: 'от 1 500 ₽' },
  { name: 'Ноутбук не заряжается / не держит заряд', price: 'от 1 500 ₽' },
  { name: 'Включается, но нет картинки', price: 'от 2 000 ₽' },
  { name: 'Выключается во время работы', price: 'от 2 000 ₽' },
  { name: 'Ремонт материнской платы', price: 'от 2 500 ₽' },
  { name: 'Не включается вообще', price: 'от 3 000 ₽' },
  { name: 'Апгрейд ПК: SSD, память, сборка', price: 'от 1 500 ₽' },
  { name: 'Ремонт смартфонов', price: 'от 1 500 ₽' },
  { name: 'Установка Windows + драйверы', price: 'договорная' },
]

export default function Repair() {
  return (
    <section id="repair" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div>
          <Reveal>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#00e066]">Ремонт</p>
            <h2 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
              Починим то,<br />что <span className="text-[#00e066]">другие</span><br />не берут
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
              Свой сервисный центр на проспекте Кирова. Ремонтируем ноутбуки, ПК и смартфоны —
              от замены матрицы до сложной пайки. Прайс честный, как в 2ГИС.
            </p>
            <a
              href="https://wa.me/79521618811?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20%E2%80%94%20%D0%BD%D1%83%D0%B6%D0%B5%D0%BD%20%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%3A%20"
              target="_blank"
              rel="noreferrer"
              onClick={() => goal('whatsapp_click')}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#00e066] px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#04140a] transition hover:scale-105 hover:bg-white"
            >
              Описать поломку
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {PRICES.map((p, i) => (
              <div
                key={p.name}
                className={`group flex items-baseline justify-between gap-4 px-5 py-4 transition hover:bg-[#00e066]/[0.06] md:px-7 ${
                  i % 2 ? 'bg-white/[0.02]' : ''
                }`}
              >
                <span className="text-sm font-semibold text-white/80 transition group-hover:text-white md:text-[15px]">
                  {p.name}
                </span>
                <span className="mx-1 hidden flex-1 border-b border-dotted border-white/15 sm:block" />
                <span className="whitespace-nowrap text-right">
                  <span className="font-display text-sm font-bold text-[#00e066] md:text-base">{p.price}</span>
                  {p.note && <span className="ml-2 text-[11px] text-white/35">{p.note}</span>}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
