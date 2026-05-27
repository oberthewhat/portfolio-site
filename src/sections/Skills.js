import './Skills.css';

const skillGroups = [
  {
    label: 'Languages and frameworks',
    skills: ['React', 'JavaScript (ES6+)', 'Redux', 'Node.js', 'HTML5', 'CSS3 / Sass', 'Material UI'],
    highlight: ['React', 'JavaScript (ES6+)'],
  },
  {
    label: 'WordPress',
    skills: ['Custom themes', 'Custom post types', 'Advanced Custom Fields', 'Beaver Builder', 'WooCommerce', 'CMS customization'],
    highlight: ['Custom themes', 'Custom post types'],
  },
  {
    label: 'Marketing and analytics',
    skills: ['Technical SEO', 'Google Analytics (GA4)', 'Google Tag Manager', 'A/B testing', 'Conversion optimization', 'Schema markup', 'Hotjar', 'Search Console'],
    highlight: ['Technical SEO', 'Google Analytics (GA4)'],
  },
  {
    label: 'Tools and process',
    skills: ['Git / GitHub', 'Figma', 'Webpack', 'Postman', 'Jira', 'Agile / Scrum', 'Chrome DevTools'],
    highlight: [],
  },
];

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <div className="section-eyebrow">Toolkit</div>
        <h2 className="section-title serif">What I work with.</h2>

        <div className="skills-groups">
          {skillGroups.map(group => (
            <div className="skill-group" key={group.label}>
              <div className="skill-group-label">{group.label}</div>
              <div className="skill-tags">
                {group.skills.map(s => (
                  <span
                    className={`skill-tag ${group.highlight.includes(s) ? 'skill-tag--highlight' : ''}`}
                    key={s}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
