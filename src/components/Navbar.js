import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-shield-alt"></i>
          <span>Apada Mitra</span>
        </Link>

        <div className="mobile-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/disaster-prediction" className={location.pathname === '/disaster-prediction' ? 'active' : ''}>
              <i className="fas fa-chart-line"></i>
              <span>Disaster Prediction</span>
            </Link>
          </li>
          <li>
            <Link to="/mental-health" className={location.pathname === '/mental-health' ? 'active' : ''}>
              <i className="fas fa-heart"></i>
              <span>Mental Health</span>
            </Link>
          </li>
          <li className="emergency-nav-button">
            <Link to="/emergency">
              <i className="fas fa-phone-alt"></i>
              <span>Emergency</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;