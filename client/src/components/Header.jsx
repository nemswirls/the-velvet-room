import  {useContext} from 'react';
import NavBar from "./NavBar";
import MobileNavBar from './MobileNavBar';
import {WindowWidthContext} from "../context/windowSize";
// import {UserContext} from '../context/userProvider';
import Headroom from 'react-headroom';
import styled from 'styled-components';
import Logo from './Logo';
const StyledHeader = styled(Headroom)`
padding: 0;
margin: 0;

 .headroom {
    display: flex;
    justify-content: space-between;
    background: white;
    height: var(--height-header);
  }
`
const Header = () => {
    const {isMobile} = useContext(WindowWidthContext);
    // const { user } = useContext(UserContext);

    return (
        <StyledHeader>
            <Logo />
            {isMobile ? <MobileNavBar /> : <NavBar />}
        </StyledHeader>
    );
};

export default Header;