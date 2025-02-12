import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import '../styles/SpecialFusion.css';


const SectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  background-color: #732424;
`;

const FusionSection = styled.div`
  flex: 1;
  margin-right: 10px;
  position: relative;
  height: 800px;
  background-color: #d92323;
  border-radius: 10px;
  padding: 20px;
`;

const FusionLeft = styled(FusionSection)`
  background-image: url('/images/personas/persona198.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const FusionMiddle = styled(FusionSection)`
  background-image: url('/images/personas/persona203.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const FusionRight = styled(FusionSection)`
  background-image: url('/images/personas/persona204.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const FusionTitle = styled.h3`
  color: black;
  font-weight: bold;
`;

const MaterialContainer = styled.div`
  display: block; 
  margin-top: 20px;
`;

const MaterialItem = styled.div`
   padding: 10px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  color: black;
  border-radius: 5px;
  text-align: center;
  opacity: 0.7;
  margin-bottom: 10px; 
`;

const FusionButton = styled.button`
  padding: 10px;
  background-color: #732424;
  color: white;
  border: none;
  border-radius: 10%;
  cursor: pointer;
  
    
  &:hover {
    background-color: #0d0d0d;
    text-decoration: none
  }
`;
const SpecialFusionContainer = styled.div`
  background-color: #732424; 
  padding: 20px;

`;
const SpecialFusionRen = () => {
  const [specialFusions, setSpecialFusions] = useState([]);
  const [playerStock, setPlayerStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuth();

  // Fetch player's stock
  const fetchPlayerStock = async () => {
    try {
      const res = await api.get('/stocks');
      setPlayerStock(res.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  // Fetch special fusions
  const fetchSpecialFusions = async () => {
    try {
      const res = await api.get('/special-fusions');
      setSpecialFusions(res.data);
    } catch (error) {
      console.error('Error fetching special fusions:', error);
    }
  };

  // Handle fusion
  const handleFusion = async (fusionName) => {
    try {
      const response = await api.post('/special-fusion', { fusion: fusionName });
      setUser(response.data.player); 
      fetchPlayerStock(); 
      alert(`Fusion successful! You created ${fusionName}. Your stock has been updated.`);
    } catch (error) {
      console.error('Error finalizing fusion:', error.response || error);
      alert(error.response?.data?.error || 'Fusion failed. Check if you have the required personas.');
    }
  };


  // Check if material is in stock
  const isInStock = (materialName) => {
    return playerStock.some(item => item.name === materialName);
  }; 

  useEffect(() => {
    fetchPlayerStock(); 
    fetchSpecialFusions(); 
  }, []);

  useEffect(() => {
    if (specialFusions.length > 0 && playerStock.length > 0) {
      setLoading(false);
    }
  }, [specialFusions, playerStock]);

  
  const safeMaterials = (fusion) => {
    return Array.isArray(fusion.materials) ? fusion.materials : [];
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
        <SpecialFusionContainer>
      <h2>Ren&apos;s Special Fusions</h2>
      {specialFusions.length === 0 ? (
        <p>No special fusions available.</p>
      ) : (
        <SectionContainer>
          {/* Left Section */}
          <FusionLeft>
            {specialFusions[0] && (
              <>
                <FusionTitle>{specialFusions[0].name}</FusionTitle>
                <MaterialContainer>
                  {safeMaterials(specialFusions[0]).map((material, index) => (
                    <MaterialItem key={index}>{material.name} {isInStock(material)}
                      {material}</MaterialItem>
                  ))}
                  <FusionButton
                    onClick={() => handleFusion(specialFusions[0].name)}
                   
                  >Fuse
                   
                  </FusionButton>
                </MaterialContainer>
              </>
            )}
          </FusionLeft>

          {/* Middle Section */}
          <FusionMiddle>
            {specialFusions[1] && (
              <>
                <FusionTitle>{specialFusions[1].name}</FusionTitle>
                <MaterialContainer>
                  {safeMaterials(specialFusions[1]).map((material, index) => (
                    <MaterialItem key={index}>{material.name} {isInStock(material)}
                      {material}</MaterialItem>
                  ))}
                  <FusionButton
                    onClick={() => handleFusion(specialFusions[1].name)}
                   
                  >Fuse
                   
                  </FusionButton>
                </MaterialContainer>
              </>
            )}
          </FusionMiddle>

          {/* Right Section */}
          <FusionRight>
            {specialFusions[2] && (
              <>
                <FusionTitle>{specialFusions[2].name}</FusionTitle>
                <MaterialContainer>
                  {safeMaterials(specialFusions[2]).map((material, index) => (
                    <MaterialItem key={index}>{material.name} {isInStock(material)}
                      {material}</MaterialItem>
                  ))}
                  <FusionButton
                    onClick={() => handleFusion(specialFusions[2].name)}
                   
                  >Fuse
                 
                  </FusionButton>
                </MaterialContainer>
              </>
            )}
          </FusionRight>
        </SectionContainer>
      )}
      </SpecialFusionContainer>
    </div>
  );
};

export default SpecialFusionRen;