import NavBar from './NavBar';
import Logo from './Logo';
import ProfileDropdown from './ProfileDropdown';
import styled from 'styled-components';
import { Suspense } from 'react';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #151da6;
  color: white;
  position: relative;
`;
const LogoContainer = styled.div`
  position: absolute;
  left: 20px;
`;
const NavbarContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;
const PlayerInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: absolute;
  right: 160px;
`;

const InfoBox = styled.div`
  background: #6d9ac7;
  padding: 6px 12px;
  border-radius: 8px;
  text-align: center;
`;
const Header = () => {
 
  const { user}= useAuth()


return(
  <Suspense fallback={<div>loading</div>}>
<HeaderContainer>
<LogoContainer>
        <Logo />
      </LogoContainer>
      <NavbarContainer>
        <NavBar />
      </NavbarContainer>
      <PlayerInfoContainer>
        <InfoBox>
         {user && <h4>Level:{user.level}</h4>}
        </InfoBox>
        <InfoBox>
          {user && <h4>¥ {user.yen}</h4>}
        </InfoBox>
      </PlayerInfoContainer>
      <ProfileDropdown /> 
    </HeaderContainer>
    </Suspense>
  );
};

export default Header;