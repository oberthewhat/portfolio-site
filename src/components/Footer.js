import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo serif">obertubbesing<span>.dev</span></div>
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/john-obertubbesing/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href="https://github.com/oberthewhat" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href="mailto:John.obertubbesing@gmail.com" className="footer-link">Email</a>
          </div>
          <div className="footer-copy">&copy; {new Date().getFullYear()} John Obertubbesing</div>
        </div>
      </div>
    </footer>
  );
}