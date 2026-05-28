import CoasterFrogger from './CoasterFrogger';
import './Lab.css';

export default function Lab() {
  return (
    <section id="lab">
      <div className="container">
        <div className="section-eyebrow">The lab</div>
        <h2 className="section-title serif">Things I built for fun.</h2>
      </div>

      <div className="lab-game-wrap">
        <div className="container">
          <div className="lab-game-intro">
            <div className="lab-game-badge">Mini game</div>
            <h3 className="lab-game-title serif">Coaster Crossing</h3>
            <p className="lab-game-desc">
              Get your park guest safely across the midway without getting flattened by a coaster train. Classic arcade logic, built in React with canvas. Gets faster every level.
            </p>
          </div>
        </div>
        <CoasterFrogger />
      </div>
    </section>
  );
}
