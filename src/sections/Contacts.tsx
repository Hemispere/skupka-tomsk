import Reveal from '@/components/Reveal'
import { goal, type GoalName } from '@/lib/metrika'

const CHANNELS: { name: string; href: string; color: string; note: string; goal: GoalName }[] = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/79521618811?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.',
    color: '#25d366',
    note: '+7 (952) 161-88-11',
    goal: 'whatsapp_click',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/+79521618811',
    color: '#229ed9',
    note: '+7 (952) 161-88-11',
    goal: 'telegram_click',
  },
  {
    name: 'ВКонтакте',
    href: 'https://vk.ru/kuplu_nout70',
    color: '#0077ff',
    note: 'группа и отзывы',
    goal: 'vk_click',
  },
  {
    name: '2ГИС',
    href: 'https://go.2gis.com/jnyEf',
    color: '#00b956',
    note: 'мы на карте · 4.9 ★',
    goal: 'gis_click',
  },
]

export default function Contacts() {
  return (
    <section id="contacts" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.35em] text-[#00e066]">Контакты</p>
        <h2 className="font-display text-center text-[9vw] font-black uppercase leading-[0.9] tracking-tight md:text-7xl">
          Звони —<br />
          <span className="text-white">мы на связи</span>
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <a
          href="tel:+73822945321"
          onClick={() => goal('phone_click')}
          className="group mx-auto mt-12 block w-fit text-center"
        >
          <span className="font-display bg-gradient-to-r from-[#00e066] to-[#7dffb8] bg-clip-text text-3xl font-black tracking-tight text-transparent transition group-hover:from-white group-hover:to-[#00e066] md:text-6xl">
            +7 (3822) 945-321
          </span>
          <span className="mt-2 block text-xs font-bold uppercase tracking-[0.3em] text-white/40">
            круглосуточно · без выходных
          </span>
        </a>
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.name} delay={i * 90}>
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => goal(c.goal)}
              className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 p-5 transition hover:-translate-y-1 md:p-6"
              style={{ borderColor: 'rgba(255,255,255,.1)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
            >
              <span className="font-display text-sm font-extrabold uppercase tracking-wide md:text-base" style={{ color: c.color }}>
                {c.name}
              </span>
              <span className="mt-6 text-xs text-white/45 md:text-sm">{c.note}</span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#00e066]/25 bg-[#00e066]/[0.04] p-7 text-center md:flex-row md:p-9 md:text-left">
          <div>
            <div className="font-display text-lg font-extrabold uppercase tracking-tight md:text-xl">Сервисный центр</div>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Томск, проспект Кирова, 58 ст55<br />
              1 этаж · справа от арки · отдельный вход
            </p>
          </div>
          <a
            href="https://go.2gis.com/jnyEf"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full border border-[#00e066] px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider text-[#00e066] transition hover:bg-[#00e066] hover:text-[#04140a]"
          >
            Построить маршрут
          </a>
        </div>
      </Reveal>
    </section>
  )
}
