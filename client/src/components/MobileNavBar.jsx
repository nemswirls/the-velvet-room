import  { useState } from 'react';
import './MobileNavBar.css'; // Add styles for the mobile navbar

const MobileNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <nav className="mobile-navbar">
      <div className="mobile-navbar-header">
        <button className="menu-button" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </button>
      </div>

      <div className={`menu-links ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/stock">Stock</a></li>
          <li><a href="/Summon">Contact</a></li>
          <li><a href="/fusion">Fusion</a></li>
          <li><a href="/compendium">Compendium</a></li>

        </ul>
      </div>
    </nav>
  );
};

export default MobileNavBar;