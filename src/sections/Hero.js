import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner container">
        <div className="hero-left">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            Open to new opportunities
          </div>
          <h1 className="hero-h1 serif">
            Front-end dev who <em>gets</em> marketing.
          </h1>
          <p className="hero-sub">
            I'm John, a developer based in Austin. I build websites that actually help businesses grow, and I'm the kind of person teams actually enjoy working with.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn btn-primary">See my work</a>
            <a href="#contact" className="btn btn-ghost">Get in touch</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-row">
              <div className="hero-card-icon">⚡</div>
              <div>
                <div className="hero-card-label">Current role</div>
                <div className="hero-card-val">Sr. Custom Developer at Madwire</div>
              </div>
            </div>
            <div className="hero-pill available">
              <span className="hero-pill-dot" /> Available for new roles
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-row">
              <div className="hero-card-icon">🛠️</div>
              <div>
                <div className="hero-card-label">Specialty</div>
                <div className="hero-card-val">React, WordPress, SEO, E-commerce</div>
              </div>
            </div>
            <div className="hero-tags-row">
              <span className="hero-mini-tag">5 years experience</span>
              <span className="hero-mini-tag">Remote ready</span>
            </div>
          </div>
          <div className="hero-card hero-card-quote">
            <div className="hero-card-row">
              <div className="hero-card-icon">🎢</div>
              <div>
                <div className="hero-card-label">Side projects</div>
                <div className="hero-card-val">ThrillNerds, Blusiast, RideTrader</div>
              </div>
            </div>
            <div className="hero-pill thrillnerds">
              <span>Built in the industry I love</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-stats">
        <div className="container">
          <div className="hero-stats-inner">
            <div className="stat">
              <div className="stat-num serif">5<span>+</span></div>
              <div className="stat-label">Years as a dev</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num serif">3</div>
              <div className="stat-label">Live industry sites built</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num serif">133</div>
              <div className="stat-label">Blusiast members</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num serif">∞</div>
              <div className="stat-label">Coasters ridden</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
