import { Link } from 'react-router-dom';
import './NavLinks.css';
function NavLinks({ handleClick }) {
  return (
    <>
      <Link
        to="/stock"
        className="nav-link"
        onClick={handleClick}
      >
        Stock
      </Link>
      <Link
        to="/summon"
        className="nav-link"
        onClick={handleClick}
      >
        Summon
      </Link>
      <Link
        to="/fusion"
        className="nav-link"
        onClick={handleClick}
      >
        Fusion
      </Link>
      <Link
        to="/compendium"
        className="nav-link"
        onClick={handleClick}
      >
        Compendium
      </Link>
    </>
  );
}






export default NavLinks;