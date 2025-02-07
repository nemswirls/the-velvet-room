import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom

function Logo() {
  const logoContainerStyle = {
    textAlign: 'left',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
  };

  const logoImageStyle = {
    height: 'clamp(2rem, 6vw, 4rem)',
  };

  const navLinkStyle = {
    textDecoration: 'none', // Remove default underline
  };

  return (
    <div style={logoContainerStyle}>
      <NavLink to="/" exact style={navLinkStyle}>
        <img src="images/velvet_room_logo.png" alt="home" style={logoImageStyle} />
      </NavLink>
    </div>
  );
}

export default Logo;