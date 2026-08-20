const ITEMS = [
  'Ноутбуки',
  'Системные блоки',
  'Мониторы',
  'Телевизоры',
  'В любом состоянии',
  'Деньги сразу',
  'Выезд бесплатно',
]

export default function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center">
          <span className="font-display px-6 text-2xl font-black uppercase tracking-tight text-[#04140a] md:px-10 md:text-4xl">
            {t}
          </span>
          <span className="h-3 w-3 rotate-45 bg-[#04140a]/70" />
        </span>
      ))}
    </div>
  )

  return (
    <section className="relative z-10 -rotate-1 border-y-4 border-[#04140a] bg-[#00e066] py-4 md:py-5">
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </section>
  )
}
