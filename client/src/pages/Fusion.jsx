import { useState, useEffect } from 'react';
import { api } from '../api';
import styled from 'styled-components';
import { useAuth} from '../context/AuthContext';
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #272e7d;
`;

const LeftSide = styled.div`
  width: 65%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RightSide = styled.div`
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Heading = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  color: white;
`;

const PersonaList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PersonaItem = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 300px;
  box-sizing: border-box;
  background-color: #fff;

  &:hover {
    background-color: #151da6;
  }
`;

const FusionPreview = styled.div`
  margin-top: 20px;
  width: 300px;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const FusionImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const FusionButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #151da6;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1269cc;
    text-decoration: none;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
const PersonaName = styled.p`
 position: absolute;
  margin-top: 8px; 
  font-size: 16px;
  font-weight: bold; 
  color: #fff; 
`;

const Fusion = () => {
  const [selectedPersonas, setSelectedPersonas] = useState([]);
  const [fusionResult, setFusionResult] = useState(null);
  const [personas, setPersonas] = useState([]);
  const { setUser} = useAuth()
  // Fetch the player's stock
  const fetchStocks = async () => {
    try {
      const response = await api.get('/stocks');
      setPersonas(response.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Handle persona selection
  const handlePersonaSelect = (persona) => {
    if (selectedPersonas.some((p) => p.id === persona.id)) {
      // Deselect if already selected
      setSelectedPersonas((prev) => prev.filter((p) => p.id !== persona.id));
    } else if (selectedPersonas.length < 2) {
      // Add to selection if less than 2
      setSelectedPersonas((prev) => [...prev, persona]);
    }
  };

  // Check potential fusion result
  const previewFusionResult = async () => {
    if (selectedPersonas.length === 2) {
      const [persona1, persona2] = selectedPersonas;
      try {
        const response = await api.get(`/preview-fusion/${persona1.id}/${persona2.id}`);
        setFusionResult(response.data); // Set the potential fusion result
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Fusion failed. These personas can't be fused.";
        alert(errorMessage); // Show alert for fusion failure
      }
    }
  };

  const handleFusion = async () => {
    if (fusionResult) {
      try {
        const [persona1, persona2] = selectedPersonas;
        const response = await api.post(`/fuse-personas/${persona1.id}/${persona2.id}`);
        console.log('Fusion finalized:', response.data);
        setSelectedPersonas([]);
        setFusionResult(null);
        setUser(response.data.player)
        fetchStocks();
      } catch (error) {
        console.error('Error finalizing fusion:', error.response || error);
      }
    }
  };

  return (
    <Container>
      <LeftSide>
        <Heading>Fusion</Heading>
        <PersonaList>
          {personas.map((persona) => (
            <PersonaItem
              key={persona.id}
              onClick={() => handlePersonaSelect(persona)}
              selected={selectedPersonas.some((p) => p.id === persona.id)}
            >
              <input
                type="checkbox"
                checked={selectedPersonas.some((p) => p.id === persona.id)}
                readOnly
              />
              <span>
                {persona.name} ({persona.arcana.name})
              </span>
            </PersonaItem>
          ))}
        </PersonaList>

        {/* Preview Button */}
        <FusionButton
          onClick={previewFusionResult}
          disabled={selectedPersonas.length !== 2}
        >
          Preview Fusion
        </FusionButton>

        {/* Fusion Preview */}
        {fusionResult && (
          <FusionPreview>
            <FusionImage
              src={`/images/personas/${fusionResult.image}`} 
              alt={fusionResult.name}
                />
                <PersonaName>{fusionResult.name}</PersonaName>
          </FusionPreview>
        )}

        {/* Fusion Finalize Button */}
        <FusionButton
          onClick={handleFusion}
          disabled={!fusionResult}
        >
          Fuse Personas
        </FusionButton>
      </LeftSide>

      <RightSide>
        <img
          src="/images/twins.png"
          alt="twins"
          style={{ maxWidth: '100%', height: '800px' }}
        />
      </RightSide>
    </Container>
  );
};

export default Fusion;