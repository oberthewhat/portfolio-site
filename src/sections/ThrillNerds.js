import './ThrillNerds.css';

const platforms = [
  { icon: '▶️', name: 'YouTube', handle: '@thrillnerds', url: 'https://www.youtube.com/@thrillnerds', desc: 'Videos, reviews, and park visits' },
  { icon: '📸', name: 'Instagram', handle: '@thrillnerds', url: 'https://www.instagram.com/thrillnerds/', desc: 'Photos and reels from the parks' },
  { icon: '🎵', name: 'TikTok', handle: '@thrillnerds', url: 'https://www.tiktok.com/@thrillnerds', desc: 'Short-form coaster content' },
  { icon: '🌐', name: 'Website', handle: 'thrillnerds.com', url: 'https://thrillnerds.com', desc: 'The ThrillNerds home base' },
];

export default function ThrillNerds() {
  return (
    <section id="thrillnerds" className="thrillnerds-section">
      <div className="container">
        <div className="tn-card">
          <div className="tn-left">
            <div className="tn-eyebrow">Personal brand</div>
            <h2 className="tn-title serif">ThrillNerds</h2>
            <p className="tn-desc">
              I've been creating content around amusement parks and roller coasters across YouTube, Instagram, and TikTok. It started as a passion project and turned into something I'm genuinely building. The website is next, and yes, it's going to be built in React.
            </p>
            <p className="tn-desc">
              It's also why I care so much about working in this industry. Theme parks aren't just a fun vertical to me, they're where I spend my free time, what I think about, and what I've been building around for years.
            </p>
            <div className="tn-platforms">
              {platforms.map(p => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tn-platform"
                >
                  <div className="tn-platform-icon">{p.icon}</div>
                  <div className="tn-platform-info">
                    <div className="tn-platform-name">{p.name}</div>
                    <div className="tn-platform-handle">{p.handle}</div>
                  </div>
                  <div className="tn-platform-arrow">→</div>
                </a>
              ))}
            </div>
          </div>
          <div className="tn-right">
            <div className="tn-visual">
              <div className="tn-logo-big">🎢</div>
              <div className="tn-logo-label serif">ThrillNerds</div>
              <div className="tn-logo-sub">Amusement park content</div>
              <a href="https://thrillnerds.com" target="_blank" rel="noopener noreferrer" className="tn-live-link">
                Visit thrillnerds.com →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}