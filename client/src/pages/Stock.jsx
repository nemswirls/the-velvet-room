import { useState, useEffect } from 'react';
import { api } from '../api';
import styled from 'styled-components';
import '../styles/Stock.css'
import StockImage from '../components/StockImage';


const StockContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns per row */
  gap: 10px;
  padding: 20px;
  align-items: flex-start;
  grid-auto-rows: minmax(100px, auto); /* Optional: Ensures uniform item height */
`;

const StockRow = styled.div`
   display: flex;
  justify-content: space-between; /* Space out the items */
  align-items: center;
  padding: 10px 20px; /* Add horizontal padding for more space */
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 400px; 
  gap: 20px; /* Adds space between each item */
  cursor: pointer; /* Add pointer cursor to indicate it's clickable */
  &:hover {
    background-color: #6d9ac7; /* Optional: Change background color on hover */
  }
`;
const ReleaseButton = styled.button`
  background-color: #151da6;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #51eefc;
    text-decoration: none;
  }
`;
const StockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #243c84; 
`;

const Stock = () => {
    const [personas, setPersonas] = useState([]);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [ setError] = useState(null);
    
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
        setSelectedPersona(persona); // Set the selected persona when clicked
      };

      const handleRelease = async (personaId) => {
        if (!personaId) {
          alert("Invalid persona ID.");
          return;
        }
      
        try {
       await api.delete(`/release-persona/${personaId}`);
          setPersonas((prevPersonas) => prevPersonas.filter((p) => p.id !== personaId));
         
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
          {/* Left side - Stock Container */}
          <div style={{ flex: 1, marginRight: '20px' }}>
            <h1 className='stock-title'>Your Persona Stock</h1>
            <StockContainer>
              {personas.map((persona) => (
                <StockRow key={persona.id} onClick={() => handlePersonaClick(persona)}>
                  <div>
                    <h3>{persona.name}</h3>
                    <p>Arcana: {persona.arcana.name}</p>
                    <p>Level: {persona.level}</p>
                  </div>
                  <ReleaseButton onClick={(e) => { 
                    e.stopPropagation(); 
                    handleRelease(persona.id);
                  }}>
                    Release
                  </ReleaseButton>
                </StockRow>
              ))}
            </StockContainer>
          </div>
    
          {/* Right side - Selected Persona Image */}
          <StockImage persona={selectedPersona} />
        </div>
        </StockWrapper>
      );
      
    };
    export default Stock;