import './Work.css';

const jobs = [
  {
    dates: 'June 2024 — Present',
    role: 'Senior Custom Developer',
    company: 'Madwire',
    location: 'Remote',
    bullets: [
      'Build custom web solutions for marketing and e-commerce clients, with a focus on SEO and performance',
      'Collaborate with SEO, content, and analytics teams to make sure everything we ship actually moves the needle',
      'Set up GA4, Tag Manager, and conversion tracking so clients can see exactly what their traffic is doing',
    ],
  },
  {
    dates: 'June 2023 — June 2024',
    role: 'Front-End Developer',
    company: 'Madwire',
    location: 'Remote',
    bullets: [
      'Built marketing-focused e-commerce interfaces that improved user engagement and helped clients grow sales',
      'Worked closely with digital marketing strategists to build landing pages supporting paid campaigns and SEO',
      'Integrated A/B testing and conversion tracking tools to support data-driven decisions',
    ],
  },
  {
    dates: 'Sept 2021 — May 2023',
    role: 'Front-End Developer',
    company: 'Volusion',
    location: 'Remote',
    bullets: [
      'Built and customized e-commerce sites for business clients, optimizing for SEO, speed, and conversion',
      'Translated campaign objectives into digital experiences that improved lead generation and retention',
      'Delivered front-end solutions using modern JavaScript frameworks with solid analytics integration',
    ],
  },
];

export default function Work() {
  return (
    <section id="work">
      <div className="container">
        <div className="section-eyebrow">Experience</div>
        <h2 className="section-title serif">Where I've been.</h2>
        <p className="section-sub">Five years of remote front-end work, always focused on building things that actually do something for the business.</p>

        <div className="work-list">
          {jobs.map((job, i) => (
            <div className="work-item" key={i}>
              <div className="work-meta">
                <div className="work-dates">{job.dates}</div>
                <div className="work-dot" />
              </div>
              <div className="work-detail">
                <div className="work-role">{job.role}</div>
                <div className="work-company">{job.company} <span className="work-location">{job.location}</span></div>
                <ul className="work-bullets">
                  {job.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="work-edu">
          <div className="edu-eyebrow">Education</div>
          <div className="edu-items">
            <div className="edu-item">
              <div className="edu-school">Austin Coding Academy</div>
              <div className="edu-detail">Full Stack Web Development, 2019 — 2020</div>
            </div>
            <div className="edu-item">
              <div className="edu-school">Austin Community College</div>
              <div className="edu-detail">Applied Science, 2007 — 2019</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
