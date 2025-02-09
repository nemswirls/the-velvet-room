import NavBar from './NavBar';
import Logo from './Logo';
import ProfileDropdown from './ProfileDropdown';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #151da6;
`;
const Header = () => {
  

return(
<HeaderContainer>
      <Logo /> 
      <NavBar /> 
      <ProfileDropdown /> 
    </HeaderContainer>
  );
};

export default Header;