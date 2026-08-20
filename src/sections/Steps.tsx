import Reveal from '@/components/Reveal'

const STEPS = [
  {
    n: '1',
    title: 'Напиши или позвони',
    desc: 'Скинь фото и модель техники в WhatsApp или Telegram — назовём предварительную цену за пару минут.',
  },
  {
    n: '2',
    title: 'Приезжаем сами',
    desc: 'Выезд по Томску бесплатно, в удобное время — хоть днём, хоть ночью. Или привози на пр-т Кирова, 58 ст55.',
  },
  {
    n: '3',
    title: 'Деньги сразу',
    desc: 'Быстрая диагностика на месте и расчёт наличными или на карту. Без торга в последний момент.',
  },
]

export default function Steps() {
  return (
    <section className="relative border-y border-white/5 bg-[#0c120d] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.35em] text-[#00e066]">Как это работает</p>
          <h2 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            Три шага — <span className="text-[#00e066]">и кэш у тебя</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#070b08] p-7 transition hover:border-[#00e066]/50 md:p-9">
                <span className="font-display pointer-events-none absolute -right-3 -top-6 text-[110px] font-black leading-none text-white/[0.04] transition group-hover:text-[#00e066]/10">
                  {s.n}
                </span>
                <span className="font-display flex h-11 w-11 items-center justify-center rounded-full bg-[#00e066] text-lg font-black text-[#04140a]">
                  {s.n}
                </span>
                <h3 className="font-display mt-6 text-lg font-extrabold uppercase tracking-tight md:text-xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
