import NavBar from './NavBar';
import Logo from './Logo';
import Headroom from 'react-headroom';
import './Header.css'; 

const Header = () => {
  


  return (
    <Headroom>
      <div className="headroom">
        <Logo />
         <NavBar />
      </div>
    </Headroom>
  );
};

export default Header;