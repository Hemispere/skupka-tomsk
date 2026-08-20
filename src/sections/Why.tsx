import Reveal from '@/components/Reveal'

const STATS = [
  { value: '4.9', label: 'рейтинг в 2ГИС', sub: '230+ оценок клиентов' },
  { value: '24/7', label: 'на связи круглосуточно', sub: 'ответим хоть ночью' },
  { value: '0 ₽', label: 'выезд по Томску', sub: 'приедем сами, бесплатно' },
  { value: '10+', label: 'лет с техникой', sub: 'скупка и ремонт любой сложности' },
]

export default function Why() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[#0c120d] py-24 md:py-32">
      <div className="orb left-1/2 top-0 h-72 w-[60rem] -translate-x-1/2 bg-[#00e066]/10" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2 className="font-display text-center text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            Нам <span className="text-[#00e066]">доверяют</span> Томск
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:mt-20 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="bg-[#0c120d] p-7 text-center transition hover:bg-[#101810] md:p-10">
              <Reveal delay={i * 100}>
                <div className="font-display text-4xl font-black text-[#00e066] md:text-6xl">{s.value}</div>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest text-white/80 md:text-sm">{s.label}</div>
                <div className="mt-1 text-[11px] text-white/40 md:text-xs">{s.sub}</div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
