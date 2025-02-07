// import {  useState } from "react";
import {  StyledNavLink } from "../MiscStyling";
// import styled from "styled-components";

// const StyledAccountIcon = styled.div`
//   ${StyledMenuItem}
//   position: relative;
// `
function NavLinks({ handleClick }) {

    return (
        <>
          <StyledNavLink
            to="/stock"
            className="nav-link"
            onClick={handleClick}
          >     
            Stock
          </StyledNavLink>
          <StyledNavLink
            to="/summon"
            className="nav-link"
            onClick={handleClick}
          > 
           Summon
          </StyledNavLink>
          <StyledNavLink
            to="/fusion"
            className="nav-link"
            onClick={handleClick}
          > 
           Fusion
          </StyledNavLink>
          <StyledNavLink
            to="/compendium"
            className="nav-link"
            onClick={handleClick}
          >
             Compendium
          </StyledNavLink>
          
          
          
          
          
          {/* <StyledAccountIcon
            className="nav-link"
            onMouseOver={()=>setIsMenuOpen(true)}
            onMouseOut={()=>setIsMenuOpen(false)}
          >
           
          </StyledAccountIcon> */}
          {/* <AccountDropdown 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen} */}
          {/* /> */}
        </>
      );
    };







export default NavLinks;