import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import {
  ArrowUpRight,
  ArrowDown,
  Check,
  Bookmark,
  FolderOpen,
  Sparkles,
  Route,
} from 'lucide-react'

export default function LandingHero() {
  const { token } = useAuth()
  const navigate = useNavigate()

  return (
    <section id="why" className="mx-auto max-w-7xl px-5 pt-6 md:px-10">

      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#103B37] via-[#164C49] to-[#28665B] px-6 py-8 md:rounded-[3rem] md:px-12 md:py-10">

        {/* Textured background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(#FFFFFF_0.6px,transparent_0.6px)] [background-size:5px_5px]"
        />

        {/* Soft lighting */}
        <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-[#83AD99]/25 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full bg-[#071F1D]/60 blur-[70px]" />

        {/* Top caption */}
        <div className="flex items-center justify-between gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-widest text-[#DDEBA8]">
            <Sparkles size={13} />
            A little more clarity, every day
          </span>

          <span className="hidden text-xs tracking-widest text-white/40 sm:block">
            YOUR PERSONAL SPACE
          </span>

        </div>

        {/* Original wordmark animation */}
        <div className="relative mt-8 overflow-hidden">
          <div className="hero-wordmark">
            <div className="wordmark">
              <span className="wordmark__old">
                complicated
              </span>

              <span className="wordmark__prefix">
                un
              </span>

              <span className="wordmark__final">
                uncomplicated
              </span>
            </div>
          </div>
        </div>

        {/* Main composition */}
        <div className="grid items-center gap-5 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Typography */}
          <div className="relative z-10 py-5">

            <h1 className="max-w-xl font-serif text-4xl font-normal leading-[1.1] tracking-tight text-[#F5F2E5] md:text-5xl">

              Life is complicated.

              <span className="mt-2 block italic text-[#DDEBA8]">
                Keeping track shouldn't be.
              </span>

            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#C4D9CE] md:text-base">
              Navigate unfamiliar procedures, organize important
              documents and keep useful knowledge close.
              All in one thoughtful space.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5">

              <button
                type="button"
                onClick={() => navigate(token ? '/dashboard' : '/login')}
                className="group flex cursor-pointer items-center gap-4 rounded-full bg-[#DDEBA8] py-2 pl-5 pr-2 text-sm font-semibold text-[#103B37] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#EDF5C8]"
              >
                {token ? 'Open your dashboard' : 'Explore your space'}

                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#164C49] text-white transition group-hover:rotate-12">
                  <ArrowUpRight size={18} />
                </span>

              </button>

              <Link
                to="/procedures"
                className="flex items-center gap-2 text-sm text-white"
              >
                Browse procedures
                <ArrowUpRight size={15} />
              </Link>

            </div>

          </div>

          {/* Organic layered illustration */}
          <div
            aria-hidden="true"
            className="relative mx-auto aspect-square w-full max-w-[340px] select-none"
          >

            {/* Orbit */}
            <div className="absolute inset-[5%] rounded-full border border-dashed border-white/20" />

            {/* Textured arch */}
            <div className="absolute bottom-[8%] left-[24%] top-[9%] w-[60%] overflow-hidden rounded-t-full rounded-b-[2rem] bg-gradient-to-br from-[#C8DCC8] via-[#A1C4B4] to-[#659D91] shadow-2xl">

              <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#164C49_0.7px,transparent_0.7px)] [background-size:5px_5px]" />

              <div className="absolute inset-[8%] rounded-t-full rounded-b-[1.5rem] border border-white/40" />

            </div>

            {/* Circular procedure illustration */}
            <div className="landing-drift absolute left-[5%] top-[8%] grid aspect-square w-[31%] place-items-center rounded-full bg-gradient-to-br from-[#EDF5C8] to-[#CBDD87] shadow-lg">

              <div className="absolute inset-3 rounded-full border border-[#164C49]/15" />

              <Route
                className="h-[36%] w-[36%] text-[#164C49]"
                strokeWidth={1.3}
              />

            </div>

            {/* Paper checklist */}
            <div className="landing-drift-slow absolute left-[29%] top-[25%] w-[46%]">

              <div className="-rotate-[9deg] rounded-xl border border-white/80 bg-[#FFFCF1] p-4 shadow-2xl">

                <span className="text-[8px] font-semibold tracking-widest text-[#397C76]">
                  YOUR JOURNEY
                </span>

                <h3 className="mt-2 font-serif text-lg leading-tight text-[#164C49]">
                  One step
                  <br />
                  at a time.
                </h3>

                <div className="mt-4 space-y-2">

                  {['Prepare', 'Organize', 'Complete'].map((item, index) => (

                    <div key={item} className="flex items-center gap-2">

                      <span
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                          index === 0
                            ? 'bg-[#397C76] text-white'
                            : 'border border-[#397C76]/30 bg-[#E5ECDD]'
                        }`}
                      >
                        {index === 0 && <Check size={10} />}
                      </span>

                      <span className="text-[10px] text-[#526C63]">
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

                <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#E0E8D9]">
                  <div className="h-full w-1/3 rounded-full bg-[#397C76]" />
                </div>

              </div>

            </div>

            {/* Warm circular bookmark */}
            <div className="landing-drift absolute bottom-[9%] right-[2%] grid aspect-square w-[30%] place-items-center rounded-full bg-gradient-to-br from-[#F1D5BD] to-[#D9A98C] shadow-xl">

              <div className="absolute inset-3 rounded-full border border-dashed border-[#164C49]/25" />

              <Bookmark
                className="h-[35%] w-[35%] text-[#164C49]"
                strokeWidth={1.3}
              />

            </div>

            {/* Frosted glass document */}
            <div className="absolute right-[1%] top-[20%] grid aspect-square w-[18%] rotate-12 place-items-center rounded-[35%] border border-white/40 bg-white/15 shadow-lg backdrop-blur-xl">

              <FolderOpen
                className="h-[40%] w-[40%] text-[#F5F2E5]"
                strokeWidth={1.4}
              />

            </div>

            {/* Capsule */}
            <div className="absolute bottom-[6%] left-[3%] -rotate-6 rounded-full bg-[#F5F2E5] px-4 py-2.5 text-[10px] font-medium text-[#164C49] shadow-md">
              Everything in its place.
            </div>

            <Sparkles
              className="absolute right-[15%] top-[3%] text-[#DDEBA8]"
              size={28}
              strokeWidth={1.2}
            />

          </div>

        </div>

        {/* Bottom caption */}
        <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-5">

          <span className="text-[10px] uppercase tracking-widest text-[#C4D9CE]">
            Less chaos. More clarity.
          </span>

          <a
            href="#features"
            className="flex items-center gap-2 text-xs text-white"
          >
            Discover more
            <ArrowDown size={15} />
          </a>

        </div>

      </div>

    </section>
  )
}