
import NavLinks from './NavLinks';
import './NavBar.css'; // Import the CSS file for styling

function NavBar() {
  return (
    <nav className="navbar">
      <div className="link-container">
        <NavLinks />
      </div>
    </nav>
  );
}

export default NavBar;