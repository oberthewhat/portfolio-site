import './Contact.css';

const links = [
  { icon: '✉️', label: 'Email', value: 'John.obertubbesing@gmail.com', href: 'mailto:John.obertubbesing@gmail.com' },
  { icon: '📞', label: 'Phone', value: '(512) 905-8855', href: 'tel:5129058855' },
  { icon: '▶️', label: 'YouTube', value: '@thrillnerds', href: 'https://www.youtube.com/@thrillnerds' },
  { icon: '📸', label: 'Instagram', value: '@thrillnerds', href: 'https://www.instagram.com/thrillnerds/' },
];

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <div className="contact-wrap">
          <div className="contact-left">
            <div className="section-eyebrow">Let's talk</div>
            <h2 className="section-title serif">I'd love to hear from you.</h2>
            <p className="contact-sub">
              Whether it's a full-time role, a freelance project, or just a conversation about theme parks, I'm always happy to chat. I'm pretty easy to get in touch with.
            </p>
            <a href="mailto:John.obertubbesing@gmail.com" className="btn btn-primary contact-btn">
              Send me an email
            </a>
          </div>
          <div className="contact-links-col">
            {links.map(l => (
              <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="contact-link-card" key={l.label}>
                <div className="contact-link-icon">{l.icon}</div>
                <div>
                  <div className="contact-link-label">{l.label}</div>
                  <div className="contact-link-value">{l.value}</div>
                </div>
                <div className="contact-link-arrow">→</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
