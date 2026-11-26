
import './styles/animations.css'
import './styles/landing.css'

import FeatureShowcase from './components/FeatureShowcase'
import { Link } from 'react-router-dom'


const features = [
  {
    number: '01',
    title: 'Find your way',
    description:
      'Turn confusing procedures into clear steps, with the documents and information you need along the way.',
    symbol: '↗',
    accent: 'coral',
    tag: 'PROCEDURE NAVIGATOR',
  },
  {
    number: '02',
    title: 'Keep things together',
    description:
      'Keep important documents organized, track expiry dates, and see what is still missing.',
    symbol: '▤',
    accent: 'lime',
    tag: 'PERSONAL DOCUMENT HUB',
  },
  {
    number: '03',
    title: 'Save what matters',
    description:
      'Collect useful links, guides, and resources so you can find them again when you need them.',
    symbol: '⌑',
    accent: 'lilac',
    tag: 'SAVED KNOWLEDGE SHELF',
  },
]

function App() {
  return (
    <main className="landing-page" id="top">
      <div className="page-noise" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Uncomplicated home">
          <span className="brand-symbol">u.</span>
          <span className="brand-name">UNCOMPLICATED</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#why">The idea</a>
          <a href="#features">Explore features</a>
        </nav>

        <div className="auth-actions">
  <Link
    to="/login"
    className="glass-button glass-button--quiet"
  >
    Log in
  </Link>

  <Link
    to="/login"
    className="glass-button glass-button--primary"
  >
    Sign up <span aria-hidden="true">↗</span>
  </Link>
</div>
      </header>

      <section className="hero-section" id="why">
        <div className="hero-panel">
          <div className="hero-panel-inner">
            <div className="hero-topline">
              <span className="eyebrow">
                <span className="status-dot" />
                A little more clarity, every day
              </span>
              <span className="hero-index">01 / 03</span>
            </div>

            <div className="hero-wordmark">
              <div className="wordmark">
                <span className="wordmark__old">complicated</span>
                <span className="wordmark__prefix">un</span>
                <span className="wordmark__final">uncomplicated</span>
              </div>
            </div>

            <div className="hero-copy-card">
              <span className="card-overline">A SPACE FOR REAL LIFE</span>
              <h1>
                Life is complicated.
                <span>Keeping track shouldn&apos;t be.</span>
              </h1>
              <p>
                Navigate unfamiliar procedures, organize important
                documents, and keep useful knowledge close. All in one
                thoughtful space.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="glass-button glass-button--primary glass-button--large"
                  onClick={() => alert('The dashboard will be connected later.')}
                >
                  Explore your space <span aria-hidden="true">↗</span>
                </button>
                <a className="text-link" href="#features">
                  Discover more <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="hero-side-note">
              <span className="side-note-mark">✳</span>
              <span>Less searching.<br />More peace of mind.</span>
            </div>

            <div className="hero-decoration hero-decoration--ring" />
            <div className="hero-decoration hero-decoration--orb" />
          </div>
        </div>

        <div className="hero-caption">
          <span>YOUR PERSONAL LIFE-ADMIN SPACE</span>
          <span>MADE FOR THE THINGS LIFE ASKS OF YOU ↘</span>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-label">
          <span className="section-kicker">THE IDEA</span>
          <span className="intro-line" />
          <span className="intro-count">01 — 03</span>
        </div>

        <div className="intro-content">
          <h2>
            The little things
            <br />
            <em>shouldn&apos;t feel so big.</em>
          </h2>
          <p>
            Applications, renewals, documents, deadlines, useful
            information scattered across the internet. Uncomplicated
            brings the pieces together, so you can spend less time
            figuring things out and more time moving forward.
          </p>
        </div>

        <div className="intro-stamp" aria-hidden="true">
          <span>LESS CHAOS</span>
          <strong>✳</strong>
          <span>MORE CLARITY</span>
        </div>
      </section>

    <FeatureShowcase />

      
      <section className="closing-section">
        <div className="closing-card">
          <span className="section-kicker">A FRESH START</span>
          <h2>
            Make room for
            <br />
            <em>what matters.</em>
          </h2>
          <p>
            A little structure can make a whole lot of difference.
            Start with one thing, and take it from there.
          </p>
          <button
            type="button"
            className="glass-button glass-button--light glass-button--large"
            onClick={() => alert('Getting started will be implemented later.')}
          >
            Let&apos;s get started <span aria-hidden="true">↗</span>
          </button>
          <span className="closing-decoration" aria-hidden="true">✳</span>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#top" aria-label="Back to top">
          <span className="brand-symbol">u.</span>
          <span className="brand-name">UNCOMPLICATED</span>
        </a>
        <span>Less chaos. More clarity.</span>
        <span>Made for real life. <span className="footer-star">✳</span></span>
      </footer>
    </main>
  )
}

export default App
