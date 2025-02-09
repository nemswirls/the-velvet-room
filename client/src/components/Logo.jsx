
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;

`;

const Logo = () => {
  return (
    <LogoContainer>
      <img src="/images/velvet_room_logo.png" alt="Velvet Room Logo" style={{ height: '80px', marginRight: '10px' }} />
    </LogoContainer>
  );
};

export default Logo;