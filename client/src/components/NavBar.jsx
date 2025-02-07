
import NavLinks from './NavLinks';
import './NavBar.css'; 

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