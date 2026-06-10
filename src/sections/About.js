import './About.css';

const hobbies = [
  { icon: '🎢', name: 'Coaster enthusiast', desc: 'Theme park design, engineering, and theming' },
  { icon: '🏒', name: 'Hockey player', desc: 'Team player on and off the ice' },
  { icon: '🌱', name: 'Gardening', desc: 'Patient, hands-on, detail oriented' },
  { icon: '🪵', name: 'Woodworking', desc: 'Building things that actually last' },
];

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-photo-col">
            <div className="about-photo-wrap">
              <img
                src="/john.jpg"
                alt="John Obertubbesing"
                className="about-photo"
              />
              <div className="about-photo-badge">
                <span>📍</span> Austin, TX
              </div>
            </div>
          </div>
          <div className="about-content">
            <div className="section-eyebrow">About me</div>
            <h2 className="section-title serif">Developer. Creator.<br />Coaster nerd.</h2>
            <p className="about-p">
              I've been building websites professionally for about five years now, mostly focused on front-end work for marketing and e-commerce clients. React is my home base, but I'm equally comfortable deep in WordPress building custom themes, post types, and integrations from scratch.
            </p>
            <p className="about-p">
              What I actually enjoy is the intersection of good code and real business results. I like knowing that the site I built is ranking well, converting visitors, and making someone's business better.
            </p>
            <p className="about-p">
              Outside of work, I'm pretty deep into the amusement park world. I run ThrillNerds on YouTube, Instagram, and TikTok, and I built a couple of real platforms in the industry because I just couldn't help myself.
            </p>

            <div className="hobbies-grid">
              {hobbies.map(h => (
                <div className="hobby-card" key={h.name}>
                  <div className="hobby-icon">{h.icon}</div>
                  <div className="hobby-name">{h.name}</div>
                  <div className="hobby-desc">{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
