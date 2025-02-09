import styled from 'styled-components';

const ImageContainer = styled.div`
  width: 300px;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.5); /* Opaque background */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
`;

const PersonaImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
`;
const StockImage = ({ persona }) => {
    if (!persona) return null; // Render nothing if no persona is selected
    return (
      <ImageContainer>
        <PersonaImage src={`/images/personas/${persona.image}`} />
      </ImageContainer>
    );
  };
export default StockImage;