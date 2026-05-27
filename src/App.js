import './index.css';
import Nav from './components/Nav';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Work from './sections/Work';
import Projects from './sections/Projects';
import ThrillNerds from './sections/ThrillNerds';
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="container" style={{maxWidth:'880px',margin:'0 auto'}}>
          <hr className="divider" />
        </div>
        <About />
        <div className="container" style={{maxWidth:'880px',margin:'0 auto'}}>
          <hr className="divider" />
        </div>
        <Skills />
        <div className="container" style={{maxWidth:'880px',margin:'0 auto'}}>
          <hr className="divider" />
        </div>
        <Work />
        <div className="container" style={{maxWidth:'880px',margin:'0 auto'}}>
          <hr className="divider" />
        </div>
        <Projects />
        <ThrillNerds />
        <div className="container" style={{maxWidth:'880px',margin:'0 auto'}}>
          <hr className="divider" />
        </div>
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
