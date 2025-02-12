import styled from 'styled-components';

// Styled Components
const FusionSectionContainer = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin: 10px;
`;

const FusionImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 20px;
`;

const MaterialList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const MaterialItem = styled.div`
  opacity: ${({ hasMaterial }) => (hasMaterial ? 1 : 0.4)};
  font-size: 14px;
  margin: 5px;
`;

const FusionButton = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const SpecialFusionSection = ({ fusion, requiredMaterials, playerStock, onFuse }) => {
  // Ensure requiredMaterials is an array
  const materials = Array.isArray(requiredMaterials) ? requiredMaterials : [];

  // Check if player has the required materials in their stock
  const hasAllMaterials = materials.every((material) =>
    playerStock.some((persona) => persona.name === material.name)
  );

  // Prepare image path (fallback if no image is available)
  const fusionImage = fusion.image ? `/images/personas/${fusion.image}` : '/images/default-fusion.png';

  return (
    <FusionSectionContainer>
      <FusionImage src={fusionImage} alt={fusion.name} />
      <h3>{fusion.name}</h3>
      <MaterialList>
        {materials.map((material, id) => (
          <MaterialItem
            key={id}
            hasMaterial={playerStock.some((persona) => persona.name === material.name)}
          >
            {material.name}
          </MaterialItem>
        ))}
      </MaterialList>
      <FusionButton
        onClick={() => onFuse(fusion.name)}
        disabled={!hasAllMaterials}
      >
        {hasAllMaterials ? 'Fuse' : 'Missing Materials'}
      </FusionButton>
    </FusionSectionContainer>
  );
};

export default SpecialFusionSection;