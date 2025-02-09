import styled from 'styled-components';

const StyledFooter = styled.footer`
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
    background-color: #151da6;
    color: white;
    
   
`
const Footer = () => {
return(
   <StyledFooter id= "footer">
      <p><em>&quot; I am thou... Thou art I... From the sea of thy soul, I cometh...&quot;</em></p>
   </StyledFooter>
)




}



export default Footer;