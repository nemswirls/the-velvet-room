import { useContext } from 'react';
import NavBar from './NavBar';
import MobileNavBar from './MobileNavBar';
import { WindowWidthContext } from '../context/windowSize';
import Logo from './Logo';
import Headroom from 'react-headroom';
import './Header.css'; // Import the CSS file

const Header = () => {
  const { isMobile } = useContext(WindowWidthContext);


  return (
    <Headroom>
      <div className="headroom">
        <Logo />
        {isMobile ? <MobileNavBar /> : <NavBar />}
      </div>
    </Headroom>
  );
};

export default Header;