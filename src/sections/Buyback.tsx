import Reveal from '@/components/Reveal'
import { goal } from '@/lib/metrika'

const WA = 'https://wa.me/79521618811?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20%E2%80%94%20%D1%85%D0%BE%D1%87%D1%83%20%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D1%82%D1%8C%3A%20'

const ITEMS = [
  {
    n: '01',
    title: 'Ноутбуки',
    desc: 'Рабочие, сломанные, залитые, с разбитым экраном, не включающиеся — берём в любом состоянии и за любой год выпуска.',
    tags: ['рабочие', 'разбит экран', 'залит', 'не включается'],
  },
  {
    n: '02',
    title: 'Системные блоки',
    desc: 'Офисные и игровые ПК целиком, а также комплектующие: видеокарты, процессоры, память, SSD и HDD.',
    tags: ['игровые', 'офисные', 'комплектующие'],
  },
  {
    n: '03',
    title: 'Мониторы и телевизоры',
    desc: 'Рабочие мониторы и ТВ, а также с дефектами матрицы и питания. Оценим честно, заберём сами.',
    tags: ['мониторы', 'телевизоры', 'с дефектами'],
  },
  {
    n: '04',
    title: 'Смартфоны и планшеты',
    desc: 'Телефоны и планшеты в рабочем и нерабочем состоянии. Быстрая оценка по фото в мессенджере.',
    tags: ['смартфоны', 'планшеты'],
  },
]

export default function Buyback() {
  return (
    <section id="buyback" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#00e066]">Что выкупаем</p>
        <h2 className="font-display max-w-4xl text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          СДАЙ СТАРОЕ —<br />
          <span className="text-[#00e066]">ПОЛУЧИ ДЕНЬГИ СЕГОДНЯ</span>
        </h2>
      </Reveal>

      <div className="mt-14 md:mt-20">
        {ITEMS.map((it, i) => (
          <Reveal key={it.n} delay={i * 80}>
            <a
              href={WA + encodeURIComponent(it.title)}
              target="_blank"
              rel="noreferrer"
              onClick={() => goal('whatsapp_click')}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-white/10 py-7 transition last:border-b hover:bg-white/[0.03] md:grid-cols-[80px_1fr_1.2fr_auto] md:gap-8 md:px-4 md:py-9"
            >
              <span className="font-display text-sm font-bold text-[#00e066]/70 md:text-base">{it.n}</span>
              <h3 className="font-display text-xl font-extrabold uppercase tracking-tight transition group-hover:text-[#00e066] md:text-3xl">
                {it.title}
              </h3>
              <div className="col-span-3 md:col-span-1">
                <p className="max-w-md text-sm leading-relaxed text-white/55">{it.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {it.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/45">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 transition group-hover:rotate-45 group-hover:border-[#00e066] group-hover:bg-[#00e066] group-hover:text-[#04140a] md:flex">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
