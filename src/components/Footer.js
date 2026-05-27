import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo serif">john<span>.</span></div>
          <div className="footer-text">
            Built in React. Based in Austin, TX.
          </div>
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} John Obertubbesing
          </div>
        </div>
      </div>
    </footer>
  );
}
