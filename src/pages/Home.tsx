import Nav from '@/sections/Nav'
import Hero from '@/sections/Hero'
import Marquee from '@/sections/Marquee'
import Buyback from '@/sections/Buyback'
import Steps from '@/sections/Steps'
import Repair from '@/sections/Repair'
import Why from '@/sections/Why'
import Contacts from '@/sections/Contacts'
import Footer from '@/sections/Footer'

export default function Home() {
  return (
    <div className="grain relative min-h-screen bg-[#070b08] text-[#eaf3ec]">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Buyback />
        <Steps />
        <Repair />
        <Why />
        <Contacts />
      </main>
      <Footer />
    </div>
  )
}
