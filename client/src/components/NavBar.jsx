import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavBarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 20px;
  margin: 0 20px;
  &:hover {
    color: #6d9ac7;
  }
`;

const NavBar = () => {
  return (
    <NavBarContainer>
      <StyledLink to="/stock">Stock</StyledLink>
      <StyledLink to="/summon">Summon</StyledLink>
      <StyledLink to="/fusion">Fusion</StyledLink>
      <StyledLink to="/compendium">Compendium</StyledLink>
    </NavBarContainer>
  );
};
export default NavBar;