import './CurrentProjects.css';

const currentProjects = [
  {
    name: 'Untitled Puzzle Game', // swap in the real name
    status: 'In development',
    description:
      'A mobile puzzle game built with React Native and Expo, headed to both the App Store and Google Play. Designing the core puzzle mechanics, building the game loop, and handling all the UI and animation work myself. Publishing to iOS through my own Apple Developer account.',
    tags: ['React Native', 'Expo', 'iOS', 'Android'],
  },
];

function CurrentProjects() {
  return (
    <section className="current-projects" id="current">
      <div className="current-projects-inner">
        <p className="current-eyebrow">On the workbench</p>
        <h2>Current Projects</h2>
        <p className="current-intro">
          Things I'm actively building right now. These are works in progress,
          so expect rough edges and frequent changes.
        </p>

        <div className="current-grid">
          {currentProjects.map((project) => (
            <article className="current-card" key={project.name}>
              <div className="current-card-top">
                <span className="current-status">
                  <span className="current-status-dot" aria-hidden="true" />
                  {project.status}
                </span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <ul className="current-tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CurrentProjects;