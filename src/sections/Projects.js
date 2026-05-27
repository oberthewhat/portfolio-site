import './Projects.css';

const projects = [
  {
    featured: true,
    emoji: '🎡',
    type: 'WordPress, Beaver Builder, CPTs, ACF',
    name: 'Ride Trader',
    url: 'https://ride-trader.com',
    desc: "A B2B marketplace for buying and selling amusement rides worldwide. I built the whole platform using Beaver Builder with custom post types and Advanced Custom Fields to power the ride listings. Ride Trader is the official North American rep for Levent, a manufacturer that has been around since 1975, and they broker real equipment deals globally.",
    tags: ['WordPress', 'Beaver Builder', 'Custom Post Types', 'ACF', 'E-commerce'],
    highlight: 'Live B2B marketplace',
  },
  {
    featured: true,
    emoji: '🎢',
    type: 'Custom WordPress Theme, CRM',
    name: 'Blusiast',
    url: 'https://blusiast.org',
    desc: "I built the entire site and a custom CRM from scratch, no page builder. Blusiast is a global community of Black and diverse theme park enthusiasts. The CRM I built handles 133 members across multiple status tiers, tracks event registrations in real time, has an event check-in tool, SSO, filtered email blasts, coaster reviews, and a shop. It is the project I am most proud of.",
    tags: ['Custom WP Theme', 'Custom CRM', 'Member Portal', 'SSO', 'WooCommerce'],
    highlight: '133 members and growing',
  },
  {
    featured: false,
    emoji: '🗺️',
    type: 'React, Real-time APIs',
    name: 'Hippie Hollow World',
    url: 'https://hippiehollowworld.com',
    desc: "A React-powered interactive guide for Hippie Hollow, Austin's clothing-optional public park on Lake Travis. It pulls in real-time busyness data, live lake levels, weather, and park info, all wrapped in a custom game-style map UI.",
    tags: ['React', 'API Integration', 'Interactive Map', 'Real-time Data'],
    highlight: null,
  },
  {
    featured: false,
    emoji: '💼',
    type: 'React',
    name: 'This portfolio',
    url: null,
    desc: "Built from scratch in React. Wanted something that felt like me rather than a generic template, so I started from zero and made every design decision myself.",
    tags: ['React', 'CSS3', 'Custom design'],
    highlight: null,
  },
];

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <div className="section-eyebrow">Projects</div>
        <h2 className="section-title serif">Things I've built.</h2>
        <p className="section-sub">Three of these are live, real-world sites operating in the amusement park industry. That part wasn't planned, it just kind of happened.</p>

        <div className="projects-list">
          {projects.map((p, i) => (
            <div className={`project-card ${p.featured ? 'project-card--featured' : ''}`} key={i}>
              <div className="project-card-left">
                <div className="project-emoji">{p.emoji}</div>
              </div>
              <div className="project-card-right">
                <div className="project-meta-row">
                  <span className="project-type">{p.type}</span>
                  {p.highlight && <span className="project-highlight">{p.highlight}</span>}
                </div>
                <h3 className="project-name serif">{p.name}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="project-footer">
                  <div className="project-tags">
                    {p.tags.map(t => (
                      <span className="project-tag" key={t}>{t}</span>
                    ))}
                  </div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="project-link">
                      Visit site →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
