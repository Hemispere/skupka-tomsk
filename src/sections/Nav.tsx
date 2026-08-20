import { goal } from '@/lib/metrika'

const PHONE_CITY = '+7 (3822) 945-321'
const PHONE_CITY_HREF = 'tel:+73822945321'

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#070b08]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="font-display text-sm font-800 tracking-widest md:text-base">
          <span className="text-[#00e066]">СКУПКА</span>
          <span className="text-white/90">//НОУТБУКОВ</span>
          <span className="ml-2 hidden rounded border border-[#00e066]/40 px-1.5 py-0.5 text-[10px] text-[#00e066] md:inline-block">
            ТОМСК
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-widest text-white/60 md:flex">
          <a href="#buyback" className="transition hover:text-[#00e066]">Выкуп</a>
          <a href="#repair" className="transition hover:text-[#00e066]">Ремонт</a>
          <a href="#contacts" className="transition hover:text-[#00e066]">Контакты</a>
        </nav>
        <a
          href={PHONE_CITY_HREF}
          onClick={() => goal('phone_click')}
          className="group flex items-center gap-2 whitespace-nowrap rounded-full bg-[#00e066] px-4 py-2 text-xs font-bold text-[#04140a] transition hover:bg-white md:text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#04140a] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#04140a]" />
          </span>
          {PHONE_CITY}
        </a>
      </div>
    </header>
  )
}
