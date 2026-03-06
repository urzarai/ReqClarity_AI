import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-brand">
        <Link to="/" className="brand">
          <span className="brand-req">Req</span>
          <span className="brand-clarity">Clarity</span>
          <span className="brand-ai"> AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <ul className="navbar-links">
        <li>
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
        </li>

        <li>
          <Link to="/upload" className={isActive("/upload")}>
            Analyze
          </Link>
        </li>

        <li>
          <Link to="/history" className={isActive("/history")}>
            History
          </Link>
        </li>
      </ul>

      {/* CTA */}
      <div className="navbar-actions">
        <Link to="/contact" className="btn-primary">
          Contact Us
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;