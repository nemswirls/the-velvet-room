
import styled from 'styled-components';
import { Link } from 'react-router-dom'
const LogoContainer = styled.div`
  display: flex;

`;

const Logo = () => {
  return (
    <Link to="/">
    <LogoContainer>
      <img src="/images/velvet_room_logo.png" alt="Velvet Room Logo" style={{ height: '80px', marginRight: '10px' }} />
    </LogoContainer>
    </Link>
  );
};

export default Logo;