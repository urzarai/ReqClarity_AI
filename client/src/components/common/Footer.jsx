import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="brand-req">Req</span>
          <span className="brand-clarity">Clarity</span>
          <span className="brand-ai"> AI</span>
        </div>
        <p className="footer-tagline">
          Automated SRS Quality Analysis — Powered by AI
        </p>
      </div>

      <div className="footer-links">
        <a href="https://github.com/urzarai/ReqClarity_AI" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span className="footer-divider">|</span>
        <span>Built for academic research</span>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ReqClarity AI. Open Source.</p>
      </div>
    </footer>
  );
}

export default Footer;