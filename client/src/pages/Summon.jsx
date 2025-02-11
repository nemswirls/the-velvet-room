import { useState } from 'react';
import { api } from '../api';
import styled from 'styled-components';
import StockImage from '../components/StockImage';
import { useAuth} from '../context/AuthContext';
const SummonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100vh;
  padding: 20px;
  background-color: #243c84;
`;
const LeftSection = styled.div`
  flex: 1;
  background-image: url('/images/margaret.png');
  background-size: contain; /* Adjust this to 'contain' or 'cover' */
  background-position: center;
  background-repeat: no-repeat;
  max-height: 100vh; /* Ensure it doesn't exceed viewport height */
  display: flex;
  align-items: center;
  justify-content: center;
`;
const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 12px;
`;
const SummonButton = styled.button`
  background-color: #151da6;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  margin-top: 20px;

  &:hover {
    background-color: #51eefc;
    color: black;
    text-decoration: none;
  }
`;
const OpaqueSquare = styled.div`
  width: 300px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

const Summon = () => {

 const [summonedPersona, setSummonedPersona] = useState(null);
 const { setUser} = useAuth()
      
 const handleSummon = async () => {
    try {
      const response = await api.get('/summon-persona');
      setSummonedPersona(response.data);
      setUser(response.data.player);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === 'You have reached your stock limit.') {
        alert('You have reached your stock limit. Please release a persona or fuse to summon another.');
      } else if (error.response && error.response.data.error) {
        alert(error.response.data.error); // Handle other server-side errors
      } else {
        console.error('Error summoning persona:', error);
        alert('Failed to summon a persona. Please try again.');
      }
    }
  };
return (
    <SummonWrapper>
      {/* Left Section with Background Image */}
      <LeftSection />

      {/* Right Section with Opaque Background */}
      <RightSection>
      <OpaqueSquare>
          {/* Always visible square */}
          {summonedPersona ? <StockImage persona={summonedPersona} /> : <p>Nothing summoned yet...</p>}
        </OpaqueSquare>
        
        {/* Summon Button */}
        <SummonButton onClick={handleSummon}>
          Summon Persona (200 Yen)
        </SummonButton>
      </RightSection>
    </SummonWrapper>
  );
};     

export default Summon;