import './styles/animations.css'
import './styles/landing.css'
import './styles/LandingMotion.css'

import LandingNavbar from './components/Landing/LandingNavbar'
import LandingHero from './components/Landing/LandingHero'
import FeatureShowcase from './components/FeatureShowcase'

import { Link } from 'react-router-dom'
import { ArrowUpRight, Asterisk } from 'lucide-react'

function App() {
  return (
    <main
      id="top"
      className="relative isolate min-h-screen overflow-x-clip bg-[#F0F2E8] text-[#164C49]"
    >

      {/* Subtle background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.045] [background-image:radial-gradient(#164C49_1px,transparent_1px)] [background-size:5px_5px]"
      />

      {/* Soft background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 -z-10 h-[500px] w-[45%] rounded-full bg-[#C4DCC5]/50 blur-[100px]"
      />

      <LandingNavbar />

      <LandingHero />

      {/* Editorial introduction */}
      <section className="relative mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">

        <div className="grid items-center gap-8 md:grid-cols-[0.65fr_1.35fr]">

          <div className="flex items-center gap-5">

            <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full bg-[#DDEBA8] md:h-32 md:w-32">

              <div className="absolute inset-2 rounded-full border border-dashed border-[#164C49]/30" />

              <Asterisk
                size={55}
                strokeWidth={1}
                className="landing-drift-slow text-[#164C49]"
              />

            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#397C76]">
                The idea
              </span>

              <p className="mt-2 font-serif text-xl italic">
                Less chaos.
                <br />
                More clarity.
              </p>
            </div>

          </div>

          <div className="border-[#164C49]/15 md:border-l md:pl-10">

            <h2 className="max-w-xl font-serif text-3xl font-normal leading-tight tracking-tight md:text-4xl">
              The little things shouldn't
              <span className="italic text-[#397C76]">
                {' '}feel so big.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#526C63] md:text-base">
              Applications, renewals, documents, deadlines and useful
              information scattered across the internet.
              Uncomplicated brings the pieces together, so you can
              spend less time figuring things out and more time
              moving forward.
            </p>

          </div>

        </div>

      </section>

      {/* Existing feature showcase */}
      <FeatureShowcase />

      {/* Compact footer */}
      <footer className="mx-auto max-w-7xl px-6 pb-6 pt-10 md:px-12">

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[#164C49]/15 pt-6">

          <Link to="/" className="flex items-center gap-3">

            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#164C49] font-serif text-xl italic text-white">
              u.
            </span>

            <span className="text-xs font-semibold tracking-[0.12em]">
              UNCOMPLICATED
            </span>

          </Link>

          <span className="font-serif text-sm italic text-[#397C76]">
            Made for real life.
          </span>

          <a
            href="#top"
            className="flex items-center gap-2 text-xs font-medium text-[#164C49]"
          >
            Back to top
            <ArrowUpRight size={14} />
          </a>

        </div>

      </footer>

    </main>
  )
}

export default App