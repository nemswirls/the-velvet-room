import { useState, useEffect } from 'react';
import { api } from '../api';
import styled from 'styled-components';
import StockContainer from '../components/StockContainer'; 
import StockImage from '../components/StockImage';
import '../styles/Stock.css';
import { useAuth} from '../context/AuthContext';
const StockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #243c84;
`;
const BackgroundImageContainer = styled.div`
  background-image: url('/images/marie.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 600px;  /* Adjust the height based on how much of the image you want to show */
`;

const Stock = () => {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [setError] = useState(null);
  const { setUser} = useAuth()

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await api.get('/stocks');
        if (response.data.length === 0) {
          setPersonas([]); // Keep personas empty to show the empty stock message
        } else {
          setPersonas(response.data); // Set personas if stock is not empty
        }
      } catch (error) {
        console.error('Error fetching stock:', error);
        setPersonas([]); // Still set personas to empty in case of error
      }
    };
    fetchStocks();
  }, []);

  const handlePersonaClick = (persona) => {
    setSelectedPersona(persona);
  };

  const handleRelease = async (personaId) => {
    if (!personaId) {
      alert('Invalid persona ID.');
      return;
    }

    try {
     const response =  await api.delete(`/release-persona/${personaId}`);
      setPersonas((prevPersonas) => prevPersonas.filter((p) => p.id !== personaId));
      setUser(response.data)
      alert('Persona released successfully!');
    } catch (error) {
      console.error('Error releasing persona:', error);
      setError('Failed to release the persona.');
    }
  };

  if (personas.length === 0) {
    return <p>Your stock is empty</p>;
  }

  return (
    <StockWrapper>
      <div style={{ display: 'flex', padding: '20px' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h1 className="stock-title">Your Persona Stock</h1>
          <StockContainer personas={personas} onClick={handlePersonaClick} onRelease={handleRelease} />
        </div>
        <StockImage persona={selectedPersona} />
      </div>
      <BackgroundImageContainer />
    </StockWrapper>
  );
};

export default Stock;