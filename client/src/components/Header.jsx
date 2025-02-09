import NavBar from './NavBar';
import Logo from './Logo';
import ProfileDropdown from './ProfileDropdown';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext'

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
  const { user } = useAuth();
  const playerLevel = user?.level ?? 1;
  const playerYen = user?.yen ?? 0;

return(
<HeaderContainer>
<LogoContainer>
        <Logo />
      </LogoContainer>
      <NavbarContainer>
        <NavBar />
      </NavbarContainer>
      <PlayerInfoContainer>
        <InfoBox>
         <h4>Level:{playerLevel}</h4>
        </InfoBox>
        <InfoBox>
          <h4>¥ {playerYen}</h4>
        </InfoBox>
      </PlayerInfoContainer>
      <ProfileDropdown /> 
    </HeaderContainer>
  );
};

export default Header;