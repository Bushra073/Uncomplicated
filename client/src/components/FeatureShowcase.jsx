import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import './FeatureShowcase.css'

const features = [
  {
    number: '01',
    tag: 'PROCEDURE NAVIGATOR',
    title: 'Find your way.',
    description:
      'Turn confusing procedures into clear steps. Know what you need, where to go, and what comes next.',
    items: ['Passport renewal', 'Required documents', 'Application guide'],
    accent: 'coral',
    symbol: '↗',
    route: '/procedures',
    buttonText: 'Explore procedures',
  },
  {
    number: '02',
    tag: 'PERSONAL DOCUMENT HUB',
    title: 'Keep things together.',
    description:
      'Organize important documents, track expiry dates, and keep missing requirements within reach.',
    items: ['National ID', 'Academic transcript', 'Passport'],
    accent: 'lime',
    symbol: '▤',
    route: '/documents',
    buttonText: 'Open Document Hub',
  },
  {
    number: '03',
    tag: 'SAVED KNOWLEDGE SHELF',
    title: 'Save what matters.',
    description:
      'Collect useful links, guides, tutorials and ideas so you can find them whenever you need them.',
    items: ['Useful guides', 'Saved articles', 'Helpful resources'],
    accent: 'lilac',
    symbol: '⌑',
    route: '/knowledge',
    buttonText: 'Open Knowledge Shelf',
  },
]

export default function FeatureShowcase() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const feature = features[active]

  const changeSlide = (direction) => {
    setActive((current) =>
      (current + direction + features.length) % features.length
    )
  }

  const arrowStyle =
    'absolute z-10 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#103B37] text-white shadow-lg cursor-pointer transition-all duration-300 hover:bg-[#28665B] hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#103B37]'

  return (
    <section id="features" className="feature-showcase">
      <div className="feature-heading">
        <span className="feature-eyebrow">
          A LITTLE MORE CLARITY
        </span>

        <h2>
          Three things.
          <br />
          <em>One simpler life.</em>
        </h2>
      </div>

      <div className={`feature-stage feature-scene-${feature.accent}`}>

        <button
          type="button"
          className={`${arrowStyle} left-1 md:left-1`}
          onClick={() => changeSlide(-1)}
          aria-label="Previous feature"
        >
          <ArrowLeft size={26} strokeWidth={2} />
        </button>

        <div className="feature-content" key={feature.number}>

          <div className="scene-copy">
            <span className="scene-number">
              {feature.number} / 03
            </span>

            <span className="scene-tag">{feature.tag}</span>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>


            {/* <button
              className="liquid-button"
              onClick={() => navigate(feature.route)}
            >
              {feature.buttonText}
              <span>↗</span>
            </button> */}

          <button
  type="button"
  onClick={() => navigate(feature.route)}
  className="group relative inline-flex cursor-pointer items-center gap-4 overflow-hidden rounded-full border border-white/50 bg-gradient-to-br from-[#518B7E]/90 via-[#235C51]/95 to-[#103B37] py-2 pl-5 pr-2 text-sm font-semibold text-white backdrop-blur-xl shadow-[0_8px_20px_rgba(16,59,55,0.25),inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-3px_5px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:brightness-110 active:scale-95"
>
  {/* Glossy glass reflection */}
  <span
    aria-hidden="true"
    className="pointer-events-none absolute left-[12%] top-[3px] h-[38%] w-[76%] rounded-full bg-gradient-to-b from-white/25 to-transparent"
  />

  <span className="relative z-10">
    {feature.buttonText}
  </span>

  <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#EFF6CF] to-[#C4D78B] text-lg text-[#103B37] shadow-inner transition-transform duration-300 group-hover:rotate-12">
    ↗
  </span>
</button>

          </div>

          <div className="scene-interface">
            <div className="interface-top">
              <span>YOUR PERSONAL SPACE</span>
              <span>•••</span>
            </div>

            <div className="interface-number">
              {feature.number}
            </div>

            <div className="interface-list">
              {feature.items.map((item, index) => (
                <div className="interface-item" key={item}>
                  <span className="interface-icon">
                    {index === 0
                      ? feature.symbol
                      : index === 1
                      ? '✳'
                      : '↗'}
                  </span>

                  <span>{item}</span>

                  <span className="interface-arrow">↗</span>
                </div>
              ))}
            </div>

            <div className="interface-bottom">
              <span>MADE FOR REAL LIFE</span>
              <span>{feature.number}</span>
            </div>
          </div>

        </div>

        <button
          type="button"
          className={`${arrowStyle} right-1 md:right-1`}
          onClick={() => changeSlide(1)}
          aria-label="Next feature"
        >
          <ArrowRight size={26} strokeWidth={2} />
        </button>
      </div>

      <div className="feature-controls">
        <span>EXPLORE THE FEATURES</span>

        <div className="feature-dots">
          {features.map((item, index) => (
            <button
              key={item.number}
              className={active === index ? 'active' : ''}
              onClick={() => setActive(index)}
              aria-label={`Show ${item.tag}`}
              aria-pressed={active === index}
            />
          ))}
        </div>

        <span>{feature.number} / 03</span>
      </div>
    </section>
  )
}