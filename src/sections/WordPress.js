import './WordPress.css';

const capabilities = [
  {
    icon: '🧩',
    title: 'Custom themes from scratch',
    body: "Not Elementor, not a starter theme with heavy modifications. When I build a custom theme I'm writing the PHP, registering the hooks, building the template hierarchy, and making deliberate choices about how data flows through the site. Blusiast runs on a fully custom theme I wrote from the ground up.",
  },
  {
    icon: '🗄️',
    title: 'Custom post types and data architecture',
    body: "CPTs and ACF are where WordPress goes from a blog platform to an actual application. I've used them to build ride listing systems, member databases, event registries, and coaster review archives. The data structure I built for RideTrader lets them manage hundreds of ride listings with filterable metadata across multiple taxonomies.",
  },
  {
    icon: '⚙️',
    title: 'Custom admin tools and CRMs',
    body: "The most interesting WordPress work I've done is extending the admin itself. For Blusiast I built a full CRM inside WordPress — custom dashboard pages, member management with status tiers (Free, Active, Lapsed, Banned), event registration tracking, an event check-in tool, filtered email blasts, and SSO. None of that came from a plugin.",
  },
  {
    icon: '🔌',
    title: 'Plugin development',
    body: "When a feature doesn't exist as a plugin, or the plugins that exist are too heavy or too limiting, I build it. I'm comfortable with the WordPress plugin API, hooks and filters, settings pages, shortcodes, REST API endpoints, and custom database tables when the situation calls for it.",
  },
  {
    icon: '🛒',
    title: 'WooCommerce and e-commerce',
    body: "I've built WooCommerce stores and extended them with custom functionality — custom product types, checkout modifications, order workflows, and integrations with third-party systems. Most of my Madwire work involves e-commerce clients where performance and conversion are the main goals.",
  },
  {
    icon: '🧱',
    title: 'Page builders — but I prefer building from scratch',
    body: "I know Beaver Builder, Elementor, and Astra, and I've shipped real projects with all of them. But honestly, my favorite work is when I get to skip the builder entirely and write the theme from the ground up. You get cleaner code, better performance, and a site that actually does exactly what you need instead of fighting the builder's opinions. Blusiast is a good example — fully custom theme, no builder, every line intentional.",
  },
  {
    icon: '🛍️',
    title: 'E-commerce platforms',
    body: "Beyond WooCommerce, I've worked extensively on Shopify, Volusion, and BigCommerce storefronts — customizing themes, building out product pages, integrating analytics and conversion tracking, and optimizing for performance. Most of my time at Volusion was exactly this, and it's where I got comfortable thinking about e-commerce as a system, not just a template.",
  },
];

export default function WordPress() {
  return (
    <section id="wordpress">
      <div className="container">
        <div className="section-eyebrow">WordPress and e-commerce</div>
        <h2 className="section-title serif">More than themes and plugins.</h2>
        <p className="section-sub">
          I’ve spent a lot of time working in WordPress and across major e-commerce platforms. The work I enjoy most is building things from scratch, like custom themes, plugins, and admin tools, without relying too much on heavy page builders. I know my way around those tools too, but clean, hand-written code is where I feel like I do my best work.
        </p>

        <div className="wp-grid">
          {capabilities.map((cap, i) => (
            <div className="wp-card" key={i}>
              <div className="wp-card-icon">{cap.icon}</div>
              <h3 className="wp-card-title">{cap.title}</h3>
              <p className="wp-card-body">{cap.body}</p>
            </div>
          ))}
        </div>

        <div className="wp-proof">
          <div className="wp-proof-label">In practice</div>
          <div className="wp-proof-items">
            <div className="wp-proof-item">
              <div className="wp-proof-num serif">133</div>
              <div className="wp-proof-text">members managed through a custom CRM I built inside WordPress</div>
            </div>
            <div className="wp-proof-divider" />
            <div className="wp-proof-item">
              <div className="wp-proof-num serif">2</div>
              <div className="wp-proof-text">live production platforms in the amusement park industry built on WordPress</div>
            </div>
            <div className="wp-proof-divider" />
            <div className="wp-proof-item">
              <div className="wp-proof-num serif">0</div>
              <div className="wp-proof-text">page builders used on Blusiast — fully custom theme, every line written by hand</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}