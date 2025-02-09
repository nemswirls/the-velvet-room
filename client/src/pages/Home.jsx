import styled from 'styled-components';

const HomeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #333;
  color: white;
  font-family: 'Arial', sans-serif;
  overflow: hidden;  
`;

const WelcomeMessage = styled.h1`
  font-size: 50px;
  font-weight: bold;
  color: white;
  position: absolute;
  top: 80%;
  left: 80%;
  transform: translate(-50%, -50%);
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const IgorImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;


const Home = () => {

return(
 <HomeContainer>
 
< IgorImage src="images/homepage_image.png" alt="Igor" />
<WelcomeMessage>Welcome to the Velvet Room!</WelcomeMessage>
 </HomeContainer>

)
}



export default Home;