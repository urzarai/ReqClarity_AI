import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-req">Req</span>
          <span className="brand-clarity">Clarity</span>
          <span className="brand-ai"> AI</span>
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/upload"
            className={location.pathname === '/upload' ? 'nav-link active' : 'nav-link'}
          >
            Analyze
          </Link>
        </li>
        <li>
          <Link
            to="/history"
            className={location.pathname === '/history' ? 'nav-link active' : 'nav-link'}
          >
            History
          </Link>
        </li>
      </ul>

      <div className="navbar-cta">
        <Link to="/upload" className="btn-primary">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;