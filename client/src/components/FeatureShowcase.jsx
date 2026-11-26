import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
          className="feature-arrow feature-arrow--left"
          onClick={() => changeSlide(-1)}
          aria-label="Previous feature"
        >
          ←
        </button>

        <div className="feature-content" key={feature.number}>

          <div className="scene-copy">
            <span className="scene-number">
              {feature.number} / 03
            </span>

            <span className="scene-tag">{feature.tag}</span>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

            {(active === 0 || active === 1) && (
              <button
                className="liquid-button"
                onClick={() =>
                  navigate(active === 0 ? '/procedures' : '/documents')
                }
              >
                {active === 0
                  ? 'Explore procedures'
                  : 'Open Document Hub'}
                <span>↗</span>
              </button>
            )}
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
          className="feature-arrow feature-arrow--right"
          onClick={() => changeSlide(1)}
          aria-label="Next feature"
        >
          →
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