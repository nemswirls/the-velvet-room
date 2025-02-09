import  { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext'; 
import { Link } from 'react-router-dom';

const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10%;
  cursor: pointer;
  margin-right: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: #151da6;
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: ${props => (props.$Open ? 'block' : 'none')};
   z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background-color: #6d9ac7;
  
`;
const StyledLink = styled(Link)`
  color: white; 
  text-decoration: none; 
  display: block; 
  `
;

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth(); // Get the user data from context

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  if (!user || !user.wildcard) {
    return null; // Return null or a loading spinner if user/wildcard isn't available
  }

  return (
    <ProfileContainer>
      {/* Use the wildcard image stored in context */}
      <ProfileImage
        src={`images/wildcards/${user.wildcard.image}`} 
        onClick={toggleDropdown}
      />
      <DropdownMenu $Open={isDropdownOpen}>
      <StyledLink to="/update-profile">
        <DropdownItem>Update Profile</DropdownItem>
        </StyledLink>
        <DropdownItem onClick={logout}>Logout</DropdownItem>
      </DropdownMenu>
    </ProfileContainer>
  );
};

export default ProfileDropdown;