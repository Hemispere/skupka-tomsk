import { goal } from '@/lib/metrika'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-xs text-white/35 md:flex-row md:px-8">
        <span className="font-display font-bold tracking-widest">
          <span className="text-[#00e066]">СКУПКА</span>//НОУТБУКОВ · ТОМСК
        </span>
        <span>Скупка · Ремонт · Выезд по городу</span>
        <a href="tel:+73822945321" onClick={() => goal('phone_click')} className="transition hover:text-[#00e066]">
          +7 (3822) 945-321
        </a>
      </div>
    </footer>
  )
}
